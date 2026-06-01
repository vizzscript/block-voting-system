from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.services.crypto import generate_key_pair, encrypt_private_key

def seed_admin_user(db: Session) -> None:
    # Check if admin user exists
    admin = db.query(User).filter(User.role == "admin").first()
    if not admin:
        private_pem, public_pem = generate_key_pair()
        encrypted_pem = encrypt_private_key(private_pem, "adminpassword123")
        new_admin = User(
            email="admin@college.edu",
            full_name="System Administrator",
            password_hash=get_password_hash("adminpassword123"),
            role="admin",
            is_active=True,
            student_id=None,
            department=None,
            year=None,
            rsa_public_key=public_pem,
            encrypted_rsa_private_key=encrypted_pem
        )
        db.add(new_admin)
        db.commit()
        print("Default administrator user seeded successfully: admin@college.edu / adminpassword123")
    else:
        print("Administrator user already exists, seeding skipped.")

def init_db() -> None:
    db = SessionLocal()
    try:
        seed_admin_user(db)
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
