from datetime import datetime, timedelta
from app.core.security import get_password_hash
from app.models.user import User

def test_election_crud_and_status(client, db_session):
    # Seed administrator
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
    
    start_date = (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z"
    end_date = (datetime.utcnow() + timedelta(days=2)).isoformat() + "Z"
    
    # Create election
    election_data = {
        "title": "College President Election 2026",
        "description": "Annual election to select student council president.",
        "position": "President",
        "startDate": start_date,
        "endDate": end_date,
        "status": "Draft"
    }
    response = client.post("/api/v1/elections/", json=election_data, headers=admin_headers)
    assert response.status_code == 201
    election_id = response.json()["id"]
    assert response.json()["status"] == "Draft"
    
    # Update election
    new_title = "College President General Election 2026"
    update_resp = client.put(f"/api/v1/elections/{election_id}", json={"title": new_title}, headers=admin_headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == new_title
    
    # Activate election
    act_resp = client.patch(f"/api/v1/elections/{election_id}/activate", headers=admin_headers)
    assert act_resp.status_code == 200
    assert act_resp.json()["status"] == "Active"
    
    # Close election
    close_resp = client.patch(f"/api/v1/elections/{election_id}/close", headers=admin_headers)
    assert close_resp.status_code == 200
    assert close_resp.json()["status"] == "Completed"

def test_invalid_election_dates(client, db_session):
    # Seed administrator
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
    
    # Date anomaly: end date is chronologically before start date
    start_date = (datetime.utcnow() + timedelta(days=2)).isoformat() + "Z"
    end_date = (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z"
    
    election_data = {
        "title": "Invalid Date Election",
        "description": "Should trigger model validation errors.",
        "position": "Vice President",
        "startDate": start_date,
        "endDate": end_date,
        "status": "Draft"
    }
    response = client.post("/api/v1/elections/", json=election_data, headers=admin_headers)
    assert response.status_code == 422  # Pydantic validation error triggers 422
