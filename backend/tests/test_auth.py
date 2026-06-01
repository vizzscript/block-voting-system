from app.core.security import get_password_hash
from app.models.user import User

def test_register_student(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "studentId": "STU1001",
            "fullName": "Alice Johnson",
            "email": "alice@college.edu",
            "department": "Computer Science",
            "year": "3rd Year",
            "password": "securepassword123",
            "confirmPassword": "securepassword123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["studentId"] == "STU1001"
    assert data["fullName"] == "Alice Johnson"
    assert data["email"] == "alice@college.edu"
    assert data["role"] == "student"
    assert "id" in data

def test_register_duplicate_student_id(client):
    # Register first student
    client.post(
        "/api/v1/auth/register",
        json={
            "studentId": "STU1001",
            "fullName": "Alice Johnson",
            "email": "alice@college.edu",
            "department": "Computer Science",
            "year": "3rd Year",
            "password": "securepassword123",
            "confirmPassword": "securepassword123"
        }
    )
    # Register second student with same student ID
    response = client.post(
        "/api/v1/auth/register",
        json={
            "studentId": "STU1001",
            "fullName": "Bob Smith",
            "email": "bob@college.edu",
            "department": "Mechanical Engineering",
            "year": "2nd Year",
            "password": "securepassword123",
            "confirmPassword": "securepassword123"
        }
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_student(client):
    # Register student
    client.post(
        "/api/v1/auth/register",
        json={
            "studentId": "STU1002",
            "fullName": "Alice Johnson",
            "email": "alice2@college.edu",
            "department": "Computer Science",
            "year": "3rd Year",
            "password": "securepassword123",
            "confirmPassword": "securepassword123"
        }
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "alice2@college.edu",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "accessToken" in data
    assert "refreshToken" in data
    assert data["tokenType"] == "bearer"

def test_refresh_token(client):
    # Register & Login
    client.post(
        "/api/v1/auth/register",
        json={
            "studentId": "STU1003",
            "fullName": "Alice Johnson",
            "email": "alice3@college.edu",
            "department": "Computer Science",
            "year": "3rd Year",
            "password": "securepassword123",
            "confirmPassword": "securepassword123"
        }
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "alice3@college.edu",
            "password": "securepassword123"
        }
    )
    refresh_token = login_resp.json()["refreshToken"]
    
    # Refresh
    response = client.post(
        "/api/v1/auth/refresh",
        json={"refreshToken": refresh_token}
    )
    assert response.status_code == 200
    data = response.json()
    assert "accessToken" in data
    assert "refreshToken" in data

def test_read_and_update_profile(client, db_session):
    # Seed user manually to ensure independence
    hashed_pwd = get_password_hash("securepassword123")
    user = User(
        email="alice4@college.edu",
        full_name="Alice Johnson",
        password_hash=hashed_pwd,
        role="student",
        is_active=True,
        student_id="STU1004",
        department="Computer Science",
        year="3rd Year"
    )
    db_session.add(user)
    db_session.commit()
    
    # Authenticate user
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "alice4@college.edu", "password": "securepassword123"}
    )
    token = login_resp.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch profile
    profile_resp = client.get("/api/v1/users/profile", headers=headers)
    assert profile_resp.status_code == 200
    assert profile_resp.json()["fullName"] == "Alice Johnson"
    
    # Update profile
    update_resp = client.put(
        "/api/v1/users/profile",
        json={"fullName": "Alice J. Smith", "year": "4th Year"},
        headers=headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["fullName"] == "Alice J. Smith"
    assert update_resp.json()["year"] == "4th Year"
