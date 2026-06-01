"""
Unit tests for the custom blockchain engine: Merkle Tree, Transactions, Blocks, PoW, and Chain Validation.
"""
import pytest
from datetime import datetime, timezone
from app.services.blockchain_engine import Transaction, Block, MerkleTree, Blockchain
from app.services.crypto import generate_key_pair, sign_data, verify_signature, encrypt_private_key, decrypt_private_key

# ===================== MERKLE TREE TESTS =====================

def test_merkle_empty():
    """Merkle root of empty list should be hash of empty string."""
    root = MerkleTree.generate_merkle_root([])
    assert len(root) == 64  # SHA-256 hex digest

def test_merkle_single():
    """Merkle root of single hash should be itself."""
    root = MerkleTree.generate_merkle_root(["abc123"])
    assert root is not None and len(root) == 64

def test_merkle_even():
    """Merkle root of even number of hashes."""
    hashes = ["aaa", "bbb", "ccc", "ddd"]
    root = MerkleTree.generate_merkle_root(hashes)
    assert len(root) == 64

def test_merkle_odd():
    """Merkle root of odd number duplicates the last element."""
    hashes = ["aaa", "bbb", "ccc"]
    root = MerkleTree.generate_merkle_root(hashes)
    assert len(root) == 64

def test_merkle_determinism():
    """Same input should always produce same Merkle root."""
    hashes = ["tx1hash", "tx2hash", "tx3hash"]
    root1 = MerkleTree.generate_merkle_root(hashes)
    root2 = MerkleTree.generate_merkle_root(hashes)
    assert root1 == root2

# ===================== TRANSACTION TESTS =====================

def test_transaction_hash():
    """Transaction hash should be deterministic."""
    tx = Transaction(
        transaction_id="tx-001",
        election_id=1,
        candidate_id=5,
        voter_hash="abcdef1234567890",
        signature="fakesig",
        timestamp=datetime(2026, 1, 1, 12, 0, 0)
    )
    h1 = tx.calculate_hash()
    h2 = tx.calculate_hash()
    assert h1 == h2
    assert len(h1) == 64

def test_transaction_to_dict():
    """Transaction dict serialization."""
    tx = Transaction(
        transaction_id="tx-002",
        election_id=2,
        candidate_id=3,
        voter_hash="voter_hash_123",
        signature="sig_123",
        timestamp=datetime(2026, 6, 1)
    )
    d = tx.to_dict()
    assert d["transaction_id"] == "tx-002"
    assert d["election_id"] == 2

# ===================== BLOCK & PROOF OF WORK TESTS =====================

def test_block_mining():
    """Block should mine successfully and hash should start with difficulty zeros."""
    tx = Transaction("tx-mine", 1, 1, "voter", "sig", datetime.now(timezone.utc).replace(tzinfo=None))
    block = Block(
        index=1,
        timestamp=datetime.now(timezone.utc).replace(tzinfo=None),
        transactions=[tx],
        previous_hash="0" * 64
    )
    block.mine(difficulty=2)  # Use low difficulty for fast test
    assert block.hash.startswith("00")
    assert block.nonce > 0

def test_block_merkle_root():
    """Block merkle root should be consistent with transactions."""
    tx1 = Transaction("tx-a", 1, 1, "v1", "s1", datetime(2026, 1, 1))
    tx2 = Transaction("tx-b", 1, 2, "v2", "s2", datetime(2026, 1, 1))
    block = Block(
        index=1,
        timestamp=datetime(2026, 1, 1),
        transactions=[tx1, tx2],
        previous_hash="prev"
    )
    expected = MerkleTree.generate_merkle_root([tx1.calculate_hash(), tx2.calculate_hash()])
    assert block.merkle_root == expected

# ===================== BLOCKCHAIN TESTS =====================

def test_blockchain_genesis():
    """Blockchain genesis block creation."""
    bc = Blockchain(difficulty=2)
    genesis = bc.create_genesis_block()
    bc.chain.append(genesis)
    assert len(bc.chain) == 1
    assert bc.chain[0].index == 0

def test_blockchain_mine_block():
    """Blockchain should mine block with pending transactions."""
    bc = Blockchain(difficulty=2)
    genesis = bc.create_genesis_block()
    bc.chain.append(genesis)

    tx = Transaction("tx-1", 1, 1, "voter", "sig", datetime.now(timezone.utc).replace(tzinfo=None))
    bc.add_transaction(tx)
    mined = bc.mine_block()

    assert len(bc.chain) == 2
    assert mined.index == 1
    assert mined.previous_hash == genesis.hash
    assert len(bc.pending_transactions) == 0

def test_blockchain_validation_valid():
    """Valid blockchain should pass validation."""
    bc = Blockchain(difficulty=2)
    genesis = bc.create_genesis_block()
    bc.chain.append(genesis)

    tx = Transaction("tx-v", 1, 1, "voter", "sig", datetime.now(timezone.utc).replace(tzinfo=None))
    bc.add_transaction(tx)
    bc.mine_block()

    assert bc.validate_chain() == True

def test_blockchain_validation_tampered():
    """Tampered blockchain should fail validation."""
    bc = Blockchain(difficulty=2)
    genesis = bc.create_genesis_block()
    bc.chain.append(genesis)

    tx = Transaction("tx-t", 1, 1, "voter", "sig", datetime.now(timezone.utc).replace(tzinfo=None))
    bc.add_transaction(tx)
    bc.mine_block()

    # Tamper with a transaction
    bc.chain[1].transactions[0].candidate_id = 999
    assert bc.validate_chain() == False

# ===================== CRYPTOGRAPHY TESTS =====================

def test_rsa_key_generation():
    """RSA key pair generation and PEM format."""
    private_pem, public_pem = generate_key_pair()
    assert "BEGIN RSA PRIVATE KEY" in private_pem
    assert "BEGIN PUBLIC KEY" in public_pem

def test_rsa_sign_and_verify():
    """RSA signing and verification."""
    private_pem, public_pem = generate_key_pair()
    data = b"vote:election1:candidate5:voter_hash_abc"
    sig = sign_data(private_pem, data)
    assert verify_signature(public_pem, data, sig) == True

def test_rsa_verify_wrong_data():
    """Signature should fail for different data."""
    private_pem, public_pem = generate_key_pair()
    data = b"original_data"
    sig = sign_data(private_pem, data)
    assert verify_signature(public_pem, b"tampered_data", sig) == False

def test_private_key_encryption():
    """Private key encryption/decryption with passphrase."""
    private_pem, _ = generate_key_pair()
    passphrase = "my_secure_password"
    encrypted = encrypt_private_key(private_pem, passphrase)
    assert "ENCRYPTED" in encrypted
    decrypted = decrypt_private_key(encrypted, passphrase)
    assert decrypted == private_pem

def test_private_key_wrong_passphrase():
    """Decryption with wrong passphrase should fail."""
    private_pem, _ = generate_key_pair()
    encrypted = encrypt_private_key(private_pem, "correct_password")
    with pytest.raises(Exception):
        decrypt_private_key(encrypted, "wrong_password")
