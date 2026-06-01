import hashlib
from datetime import datetime, timezone

class MerkleTree:
    @staticmethod
    def generate_merkle_root(transaction_hashes: list[str]) -> str:
        """
        Computes the Merkle Root of a list of transaction hashes recursively.
        """
        if not transaction_hashes:
            # Return hash of empty string if there are no transactions
            return hashlib.sha256(b"").hexdigest()
        
        # Hash each leaf first to ensure uniform 64-char hex digests
        current_level = [hashlib.sha256(h.encode("utf-8")).hexdigest() for h in transaction_hashes]
        
        while len(current_level) > 1:
            next_level = []
            # Duplicate the last element if count is odd to pair up
            if len(current_level) % 2 != 0:
                current_level.append(current_level[-1])
            
            for i in range(0, len(current_level), 2):
                combined = current_level[i] + current_level[i + 1]
                hashed = hashlib.sha256(combined.encode("utf-8")).hexdigest()
                next_level.append(hashed)
            current_level = next_level
            
        return current_level[0]

class Transaction:
    def __init__(
        self,
        transaction_id: str,
        election_id: int,
        candidate_id: int,
        voter_hash: str,
        signature: str,
        timestamp: datetime
    ):
        self.transaction_id = transaction_id
        self.election_id = election_id
        self.candidate_id = candidate_id
        self.voter_hash = voter_hash
        self.signature = signature
        self.timestamp = timestamp

    def to_dict(self) -> dict:
        return {
            "transaction_id": self.transaction_id,
            "election_id": self.election_id,
            "candidate_id": self.candidate_id,
            "voter_hash": self.voter_hash,
            "signature": self.signature,
            "timestamp": self.timestamp.isoformat() if hasattr(self.timestamp, "isoformat") else str(self.timestamp)
        }

    def calculate_hash(self) -> str:
        """
        Generates a stable SHA-256 hash of the transaction components.
        """
        ts_str = self.timestamp.isoformat() if hasattr(self.timestamp, "isoformat") else str(self.timestamp)
        tx_string = f"{self.transaction_id}:{self.election_id}:{self.candidate_id}:{self.voter_hash}:{ts_str}"
        return hashlib.sha256(tx_string.encode("utf-8")).hexdigest()

class Block:
    def __init__(
        self,
        index: int,
        timestamp: datetime,
        transactions: list[Transaction],
        previous_hash: str,
        nonce: int = 0,
        merkle_root: str = "",
        hash: str = ""
    ):
        self.index = index
        self.timestamp = timestamp
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.merkle_root = merkle_root or self.calculate_merkle_root()
        self.hash = hash or self.calculate_hash()

    def to_dict(self) -> dict:
        return {
            "index": self.index,
            "timestamp": self.timestamp.isoformat() if hasattr(self.timestamp, "isoformat") else str(self.timestamp),
            "transactions": [tx.to_dict() for tx in self.transactions],
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
            "merkle_root": self.merkle_root,
            "hash": self.hash
        }

    def calculate_merkle_root(self) -> str:
        hashes_list = [tx.calculate_hash() for tx in self.transactions]
        return MerkleTree.generate_merkle_root(hashes_list)

    def calculate_hash(self) -> str:
        """
        Generates SHA-256 hash of the Block headers.
        """
        ts_str = self.timestamp.isoformat() if hasattr(self.timestamp, "isoformat") else str(self.timestamp)
        block_string = f"{self.index}:{ts_str}:{self.previous_hash}:{self.nonce}:{self.merkle_root}"
        return hashlib.sha256(block_string.encode("utf-8")).hexdigest()

    def mine(self, difficulty: int) -> None:
        """
        Proof of Work miner looping until the hash begins with '0' * difficulty.
        """
        target = "0" * difficulty
        self.merkle_root = self.calculate_merkle_root()
        while not self.hash.startswith(target):
            self.nonce += 1
            self.hash = self.calculate_hash()

class Blockchain:
    def __init__(self, difficulty: int = 4):
        self.difficulty = difficulty
        self.chain: list[Block] = []
        self.pending_transactions: list[Transaction] = []

    def create_genesis_block(self) -> Block:
        ts = datetime.now(timezone.utc).replace(tzinfo=None)
        genesis = Block(
            index=0,
            timestamp=ts,
            transactions=[],
            previous_hash="0",
            nonce=0,
            merkle_root=MerkleTree.generate_merkle_root([]),
            hash=""
        )
        genesis.hash = genesis.calculate_hash()
        return genesis

    def add_transaction(self, transaction: Transaction) -> None:
        self.pending_transactions.append(transaction)

    def mine_block(self) -> Block:
        """
        Mines a new block containing pending transactions and appends it to the chain.
        """
        if not self.chain:
            raise ValueError("Blockchain must be initialized with a genesis block.")
            
        last_block = self.chain[-1]
        ts = datetime.now(timezone.utc).replace(tzinfo=None)
        
        new_block = Block(
            index=last_block.index + 1,
            timestamp=ts,
            transactions=list(self.pending_transactions),
            previous_hash=last_block.hash,
            nonce=0
        )
        
        new_block.mine(self.difficulty)
        
        self.chain.append(new_block)
        self.pending_transactions = []
        return new_block

    def validate_chain(self) -> bool:
        """
        Performs structural verification across the entire blockchain sequence.
        """
        if not self.chain:
            return True
            
        # Verify genesis block
        genesis = self.chain[0]
        if genesis.hash != genesis.calculate_hash():
            return False
            
        # Verify links and data integrity
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]
            
            # Recalculate hash checks
            if current.hash != current.calculate_hash():
                return False
                
            # Previous hash linkage verification
            if current.previous_hash != previous.hash:
                return False
                
            # Proof of work verification
            target = "0" * self.difficulty
            if not current.hash.startswith(target):
                return False
                
            # Merkle tree integrity
            if current.merkle_root != current.calculate_merkle_root():
                return False
                
        return True
