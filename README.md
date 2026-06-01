# 🗳️ Blockchain-Based Secure Voting Mechanism for College Elections

> **Phase 1** — User Management, Candidate Management & Election Management modules

A full-stack web application for conducting transparent, secure college elections. Built with **FastAPI** (Python) on the backend and **React.js** with **Material UI** on the frontend, orchestrated via **Docker Compose**.

---

## 🏗️ Architecture

```
block-voting-system/
├── backend/                    # FastAPI Python Backend
│   ├── app/
│   │   ├── api/               # REST API endpoints & dependencies
│   │   │   ├── deps.py        # JWT extraction & DB session injection
│   │   │   └── v1/
│   │   │       ├── api.py     # API router aggregator
│   │   │       └── endpoints/ # auth, users, candidates, elections
│   │   ├── core/              # Configuration, security, DB engine
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── repositories/      # Data access layer (base + per-entity)
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── services/          # Business logic layer
│   │   └── utils/             # Admin seeding & helpers
│   ├── alembic/               # Database migration configs
│   ├── tests/                 # Pytest unit test suite
│   ├── main.py                # FastAPI app entrypoint
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile
├── frontend/                   # React.js + Vite Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── layouts/           # Dashboard layout with sidebar/navbar
│   │   ├── pages/             # Route-level page components
│   │   │   ├── admin/         # Admin dashboard, manage users/candidates/elections
│   │   │   └── student/       # Student dashboard, profile, candidates, elections
│   │   ├── services/          # Axios API client with JWT interceptors
│   │   ├── store/             # Redux Toolkit slices & store
│   │   ├── App.jsx            # Root component with routing
│   │   ├── theme.js           # MUI dark theme configuration
│   │   └── main.jsx           # Vite entry point
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml          # Multi-container orchestration
```

---

## 🚀 Technology Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 18, Vite 5, Material UI 5, Redux Toolkit 2   |
| Backend    | Python 3.10+, FastAPI, SQLAlchemy 2.0, Pydantic V2  |
| Database   | PostgreSQL 15 (Docker), SQLite (testing)            |
| Auth       | JWT (python-jose), bcrypt (passlib)                 |
| DevOps     | Docker, Docker Compose, Alembic migrations          |

---

## 📦 Quick Start

### Prerequisites
- Docker & Docker Compose **OR** Python 3.10+ and Node.js 18+

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd block-voting-system

# Build and start all services
docker compose up -d --build

# Services will be available at:
#   Frontend  → http://localhost:5173
#   Backend   → http://localhost:8000
#   API Docs  → http://localhost:8000/docs
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/voting_system
export SECRET_KEY=your-secret-key

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Default Admin Credentials

The system auto-seeds an admin account on first startup:

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@college.edu`    |
| Password | `admin123`             |
| Role     | `admin`                |

> ⚠️ **Change these credentials in production!**

---

## 🧪 Running Tests

```bash
# From project root
python -m venv venv && source venv/bin/activate
pip install -r backend/requirements.txt

# Run with SQLite override (no Docker needed)
export DATABASE_URL=sqlite:// && PYTHONPATH=backend pytest backend/tests/ -v
```

**Test Coverage:**
- ✅ Authentication: Registration, Login, Token Refresh, Profile Management
- ✅ Candidates: Admin CRUD, Student access restrictions
- ✅ Elections: Lifecycle transitions (Draft → Active → Completed), Date validation

---

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint      | Description              | Auth  |
|--------|---------------|--------------------------|-------|
| POST   | `/register`   | Register new student     | No    |
| POST   | `/login`      | Login & receive JWT      | No    |
| POST   | `/refresh`    | Refresh access token     | JWT   |

### Users (`/api/v1/users`)
| Method | Endpoint      | Description              | Auth    |
|--------|---------------|--------------------------|---------|
| GET    | `/profile`    | Get current user profile | JWT     |
| PUT    | `/profile`    | Update profile details   | JWT     |
| GET    | `/students`   | List all students        | Admin   |

### Candidates (`/api/v1/candidates`)
| Method | Endpoint       | Description              | Auth    |
|--------|----------------|--------------------------|---------|
| GET    | `/`            | List/search candidates   | JWT     |
| POST   | `/`            | Register new candidate   | Admin   |
| GET    | `/{id}`        | Get candidate details    | JWT     |
| PUT    | `/{id}`        | Update candidate         | Admin   |
| DELETE | `/{id}`        | Delete candidate         | Admin   |

### Elections (`/api/v1/elections`)
| Method | Endpoint            | Description              | Auth    |
|--------|---------------------|--------------------------|---------|
| GET    | `/`                 | List all elections       | JWT     |
| POST   | `/`                 | Create new election      | Admin   |
| GET    | `/{id}`             | Get election details     | JWT     |
| PUT    | `/{id}`             | Update election          | Admin   |
| DELETE | `/{id}`             | Delete election          | Admin   |
| PATCH  | `/{id}/activate`    | Activate election        | Admin   |
| PATCH  | `/{id}/close`       | Close election           | Admin   |
| GET    | `/{id}/stats`       | Get election statistics  | Admin   |

---

## 🎨 Frontend Features

- **Premium Dark Theme** with glassmorphism and neon-cyan accents
- **Role-Based Dashboards** — separate views for Admin and Student
- **JWT Token Management** — automatic token refresh via Axios interceptors
- **React Hook Form** — client-side validation on all forms
- **Redux Toolkit** — centralized state management for auth, candidates, elections
- **Responsive Layout** — adaptive sidebar with mobile drawer support

---

## 🔮 Phase 2 (Planned)

- Blockchain-based vote casting with on-chain verification
- Vote tallying and result generation
- Blockchain explorer for audit trails
- Real-time election monitoring

---

## 📄 License

This project is developed as part of an academic capstone project.
