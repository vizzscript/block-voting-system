from app.core.security import get_password_hash
from app.models.user import User

def test_candidate_crud(client, db_session):
    # Seed system administrator
    hashed_pwd = get_password_hash("adminpassword123")
    admin = User(
        email="admin@college.edu",
        full_name="Admin User",
        password_hash=hashed_pwd,
        role="admin",
        is_active=True,
    )
    db_session.add(admin)
    db_session.commit()
    
    # Authenticate administrator
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@college.edu", "password": "adminpassword123"}
    )
    admin_token = login_resp.json()["accessToken"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Create Candidate
    candidate_data = {
        "candidateName": "John Doe",
        "studentId": "STU5001",
        "department": "Computer Science",
        "position": "President",
        "manifesto": "Better campus Wi-Fi and open labs!",
        "profileImage": "http://example.com/john.jpg"
    }
    response = client.post("/api/v1/candidates/", json=candidate_data, headers=admin_headers)
    assert response.status_code == 201
    candidate_id = response.json()["id"]
    
    # Read Candidates Listing
    list_resp = client.get("/api/v1/candidates/", headers=admin_headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 1
    assert list_resp.json()[0]["candidateName"] == "John Doe"
    
    # Update Candidate Details
    update_data = {
        "candidateName": "John H. Doe",
        "manifesto": "Upgraded computer laboratories and extended Wi-Fi access!"
    }
    update_resp = client.put(f"/api/v1/candidates/{candidate_id}", json=update_data, headers=admin_headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["candidateName"] == "John H. Doe"
    assert update_resp.json()["manifesto"] == "Upgraded computer laboratories and extended Wi-Fi access!"
    
    # Delete Candidate
    del_resp = client.delete(f"/api/v1/candidates/{candidate_id}", headers=admin_headers)
    assert del_resp.status_code == 200
    
    # Verify deletion
    verify_resp = client.get(f"/api/v1/candidates/{candidate_id}", headers=admin_headers)
    assert verify_resp.status_code == 404

def test_student_restricted_candidate_crud(client, db_session):
    # Seed student voter
    hashed_pwd = get_password_hash("securepassword123")
    student = User(
        email="student@college.edu",
        full_name="Alice Johnson",
        password_hash=hashed_pwd,
        role="student",
        is_active=True,
        student_id="STU5002",
        department="Information Technology",
        year="4th Year"
    )
    db_session.add(student)
    db_session.commit()
    
    # Authenticate student
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "student@college.edu", "password": "securepassword123"}
    )
    student_token = login_resp.json()["accessToken"]
    student_headers = {"Authorization": f"Bearer {student_token}"}
    
    # Attempt to Add Candidate (Should fail with 403)
    candidate_data = {
        "candidateName": "Illegal Candidate",
        "studentId": "STU5003",
        "department": "Political Science",
        "position": "President",
        "manifesto": "Should fail."
    }
    response = client.post("/api/v1/candidates/", json=candidate_data, headers=student_headers)
    assert response.status_code == 403
