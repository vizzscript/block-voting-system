"""
Integration tests for the voting workflow: register, login, cast vote, verify receipt, and check results.
"""
import pytest
from datetime import datetime, timedelta, timezone

# Helper to register a student and get auth token
def register_and_login(client, student_id, email, password="testpass123"):
    # Register
    reg_response = client.post("/api/v1/auth/register", json={
        "student_id": student_id,
        "full_name": f"Test Student {student_id}",
        "email": email,
        "department": "Computer Science & Engineering",
        "year": "3rd Year",
        "password": password,
        "confirm_password": password
    })
    assert reg_response.status_code in [201, 200], f"Registration failed: {reg_response.text}"

    # Login
    login_response = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    token = login_response.json()["accessToken"]
    return token

def get_admin_token(client, db_session=None):
    """Login as admin user. Seeds admin into the test DB first since fixtures rollback per test."""
    if db_session:
        from app.models.user import User
        from app.core.security import get_password_hash
        from app.services.crypto import generate_key_pair, encrypt_private_key
        
        # Check if admin already exists
        existing = db_session.query(User).filter(User.email == "admin@college.edu").first()
        if not existing:
            private_pem, public_pem = generate_key_pair()
            encrypted_pem = encrypt_private_key(private_pem, "adminpassword123")
            admin = User(
                email="admin@college.edu",
                full_name="System Administrator",
                password_hash=get_password_hash("adminpassword123"),
                role="admin",
                is_active=True,
                rsa_public_key=public_pem,
                encrypted_rsa_private_key=encrypted_pem
            )
            db_session.add(admin)
            db_session.flush()
    
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@college.edu",
        "password": "adminpassword123"
    })
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    return response.json()["accessToken"]

def test_full_voting_workflow(client, db_session):
    """
    Full integration test:
    1. Admin creates election and candidate
    2. Admin activates election
    3. Student registers, logs in, and casts vote
    4. Student verifies vote receipt
    5. Results are fetched and verified
    """
    # --- ADMIN SETUP ---
    admin_token = get_admin_token(client, db_session)
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Create candidate
    candidate_res = client.post("/api/v1/candidates/", json={
        "candidate_name": "Alice Johnson",
        "student_id": "CAND-001",
        "department": "Computer Science & Engineering",
        "position": "President",
        "manifesto": "I will improve campus facilities.",
        "profile_image": None
    }, headers=admin_headers)
    assert candidate_res.status_code == 201
    candidate_id = candidate_res.json()["id"]

    # Create election with future-safe dates
    start_date = (datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(hours=1)).isoformat() + "Z"
    end_date = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat() + "Z"

    election_res = client.post("/api/v1/elections/", json={
        "title": "Student Body President 2026",
        "description": "Annual presidential election",
        "position": "President",
        "start_date": start_date,
        "end_date": end_date
    }, headers=admin_headers)
    assert election_res.status_code == 201
    election_id = election_res.json()["id"]

    # Activate election
    activate_res = client.patch(f"/api/v1/elections/{election_id}/activate", headers=admin_headers)
    assert activate_res.status_code == 200

    # --- STUDENT VOTING ---
    student_token = register_and_login(client, "STU-V001", "voter1@college.edu", "voterpass123")
    student_headers = {"Authorization": f"Bearer {student_token}"}

    # Cast vote
    vote_res = client.post("/api/v1/votes/cast", json={
        "election_id": election_id,
        "candidate_id": candidate_id,
        "password": "voterpass123"
    }, headers=student_headers)
    assert vote_res.status_code == 201, f"Vote cast failed: {vote_res.text}"
    receipt = vote_res.json()
    assert "receipt_id" in receipt
    assert "transaction_hash" in receipt

    # Verify receipt
    verify_res = client.get(f"/api/v1/votes/verify/{receipt['receipt_id']}", headers=student_headers)
    assert verify_res.status_code == 200
    verification = verify_res.json()
    assert verification["status"] in ["Verified", "Pending (In Transaction Pool)"]

    # Check vote history
    history_res = client.get("/api/v1/votes/history", headers=student_headers)
    assert history_res.status_code == 200
    assert len(history_res.json()) >= 1

    # --- RESULTS ---
    results_res = client.get(f"/api/v1/results/{election_id}", headers=admin_headers)
    assert results_res.status_code == 200
    results = results_res.json()
    assert results["statistics"]["votes_cast"] >= 1

def test_double_voting_prevention(client, db_session):
    """Student should not be able to vote twice in the same election."""
    admin_token = get_admin_token(client, db_session)
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Create candidate
    cand_res = client.post("/api/v1/candidates/", json={
        "candidate_name": "Bob Smith",
        "student_id": "CAND-002",
        "department": "Electrical & Electronics Engineering",
        "position": "Vice President",
        "manifesto": "Better labs for everyone.",
        "profile_image": None
    }, headers=admin_headers)
    assert cand_res.status_code == 201
    cand_id = cand_res.json()["id"]

    # Create & activate election
    start = (datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(hours=1)).isoformat() + "Z"
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=1)).isoformat() + "Z"
    elec_res = client.post("/api/v1/elections/", json={
        "title": "VP Election 2026",
        "description": "VP vote",
        "position": "Vice President",
        "start_date": start,
        "end_date": end
    }, headers=admin_headers)
    assert elec_res.status_code == 201
    elec_id = elec_res.json()["id"]
    client.patch(f"/api/v1/elections/{elec_id}/activate", headers=admin_headers)

    # Register and login student
    token = register_and_login(client, "STU-DV001", "doublevote@college.edu", "voterpass123")
    headers = {"Authorization": f"Bearer {token}"}

    # First vote should succeed
    res1 = client.post("/api/v1/votes/cast", json={
        "election_id": elec_id, "candidate_id": cand_id, "password": "voterpass123"
    }, headers=headers)
    assert res1.status_code == 201

    # Second vote should fail
    res2 = client.post("/api/v1/votes/cast", json={
        "election_id": elec_id, "candidate_id": cand_id, "password": "voterpass123"
    }, headers=headers)
    assert res2.status_code == 400
    assert "already submitted" in res2.json()["detail"].lower()

def test_blockchain_validation_endpoint(client, db_session):
    """Blockchain validation API should return valid status."""
    admin_token = get_admin_token(client, db_session)
    headers = {"Authorization": f"Bearer {admin_token}"}

    res = client.get("/api/v1/blockchain/validate", headers=headers)
    assert res.status_code == 200
    assert res.json()["is_valid"] == True
