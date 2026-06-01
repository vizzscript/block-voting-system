from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes

def generate_key_pair() -> tuple[str, str]:
    """
    Generates a secure RSA 2048-bit key pair.
    Returns:
        tuple[str, str]: (private_key_pem, public_key_pem)
    """
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    
    # Serialize private key in PEM format (unencrypted)
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    ).decode("utf-8")
    
    # Serialize public key in PEM format
    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode("utf-8")
    
    return private_pem, public_pem

def encrypt_private_key(pem_private_key: str, passphrase: str) -> str:
    """
    Encrypts a raw PEM private key using a secure passphrase (e.g. user password hash).
    """
    private_key = serialization.load_pem_private_key(
        pem_private_key.encode("utf-8"),
        password=None
    )
    
    encrypted_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.BestAvailableEncryption(passphrase.encode("utf-8"))
    ).decode("utf-8")
    
    return encrypted_pem

def decrypt_private_key(encrypted_pem: str, passphrase: str) -> str:
    """
    Decrypts a password-encrypted PEM private key.
    """
    private_key = serialization.load_pem_private_key(
        encrypted_pem.encode("utf-8"),
        password=passphrase.encode("utf-8")
    )
    
    decrypted_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    ).decode("utf-8")
    
    return decrypted_pem

def sign_data(pem_private_key: str, data: bytes) -> str:
    """
    Signs data bytes with an RSA private key.
    Returns the signature encoded in hexadecimal.
    """
    private_key = serialization.load_pem_private_key(
        pem_private_key.encode("utf-8"),
        password=None
    )
    
    signature = private_key.sign(
        data,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    
    return signature.hex()

def verify_signature(pem_public_key: str, data: bytes, signature_hex: str) -> bool:
    """
    Verifies an RSA PSS signature against a public key.
    """
    try:
        public_key = serialization.load_pem_public_key(
            pem_public_key.encode("utf-8")
        )
        
        public_key.verify(
            bytes.fromhex(signature_hex),
            data,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True
    except Exception:
        return False
