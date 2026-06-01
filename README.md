# 🗳️ Blockchain-Based Secure Voting Mechanism for College Elections

> **Phase 1 & Phase 2 Fully Completed** — User Management, Elections, Custom Cryptographic Blockchain Engine, and Results Visualization.

A full-stack web application for conducting transparent, secure college elections. Built with **FastAPI** (Python) on the backend and **React.js** with **Material UI** on the frontend, featuring a custom, mathematically-verifiable Proof-of-Work blockchain to guarantee election integrity.

---

## 🏗️ Architecture

```
block-voting-system/
├── backend/                    # FastAPI Python Backend
│   ├── app/
│   │   ├── api/               # REST API endpoints & dependencies
│   │   │   └── v1/
│   │   │       ├── endpoints/ # auth, users, candidates, elections, votes, blockchain, results
│   │   ├── core/              # Configuration, security, DB engine
│   │   ├── models/            # SQLAlchemy ORM models (Users, Blocks, Transactions, Receipts)
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── services/          # Business logic (Crypto Engine, PoW Mining, Merkle Trees)
│   │   └── utils/             # Admin seeding & helpers
│   ├── tests/                 # Pytest unit & integration test suite (30 Tests)
│   ├── main.py                # FastAPI app entrypoint
│   └── requirements.txt       # Python dependencies
├── frontend/                   # React.js + Vite Frontend
│   ├── src/
│   │   ├── pages/             # Route-level page components
│   │   │   ├── admin/         # Admin dashboard, Blockchain Explorer, Results Dashboards
│   │   │   └── student/       # Cast Vote (Signing), Verify Receipt, Profile
│   │   ├── services/          # Axios API client with JWT interceptors
│   │   ├── store/             # Redux Toolkit slices (auth, elections, blockchain)
│   │   └── App.jsx            # Root component with routing
│   └── package.json
└── DEVELOPER_SETUP_GUIDE.md    # Guide for running the project locally
```

---

## 🚀 Technology Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 18, Vite 5, Material UI 5, Redux Toolkit, Chart.js |
| Backend    | Python 3.10+, FastAPI, SQLAlchemy 2.0, Pydantic V2  |
| Database   | SQLite (Local Development & Testing)                |
| Crypto     | RSA-2048, AES-256 (CBC), SHA-256, PBKDF2            |
| Auth       | JWT (python-jose), bcrypt (passlib)                 |

---

## 📦 Quick Start

To run this project locally, please refer to our dedicated setup guide:

👉 **[DEVELOPER_SETUP_GUIDE.md](./DEVELOPER_SETUP_GUIDE.md)**

This guide provides exactly what you need to clone, install dependencies, seed the database, and launch both servers locally using SQLite.

---

## 🔐 Default Admin Credentials

When the database is initialized, the system auto-seeds an admin account and creates their RSA key pair:

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@college.edu`    |
| Password | `adminpassword123`     |
| Role     | `admin`                |

> ⚠️ **Change these credentials in production!**

---

## 🧪 Testing Coverage

The system includes a robust integration and unit testing suite covering API flows, authentication, and cryptographic integrity.

```bash
# Run with SQLite override
export DATABASE_URL=sqlite:// && PYTHONPATH=backend pytest backend/tests/ -v
```

**Test Coverage (30 Passing Tests):**
- ✅ **Authentication:** Registration, Login, Token Refresh
- ✅ **Cryptography:** RSA Key Generation, AES encryption, PBKDF2 padding
- ✅ **Blockchain Engine:** Merkle Tree derivation, SHA-256 integrity, PoW Mining automation
- ✅ **Elections & Candidates:** CRUD operations, Date validations
- ✅ **Voting Integration:** End-to-end voting, double-voting prevention, independent receipt verification

---

## 📡 API Endpoints

### Authentication & Users
| Method | Endpoint                    | Description              | Auth  |
|--------|-----------------------------|--------------------------|-------|
| POST   | `/api/v1/auth/register`     | Register new student     | No    |
| POST   | `/api/v1/auth/login`        | Login & receive JWT      | No    |
| GET    | `/api/v1/users/profile`     | Get current user profile | JWT   |

### Candidates & Elections
| Method | Endpoint                    | Description              | Auth    |
|--------|-----------------------------|--------------------------|---------|
| GET    | `/api/v1/candidates`        | List candidates          | JWT     |
| POST   | `/api/v1/candidates`        | Register new candidate   | Admin   |
| GET    | `/api/v1/elections`         | List all elections       | JWT     |
| PATCH  | `/api/v1/elections/{id}/activate` | Activate election  | Admin   |

### Voting & Blockchain Engine
| Method | Endpoint                    | Description                    | Auth    |
|--------|-----------------------------|--------------------------------|---------|
| POST   | `/api/v1/votes/cast`        | Digitally sign & cast vote     | JWT     |
| GET    | `/api/v1/votes/verify/{id}` | Independent receipt auditor    | JWT     |
| GET    | `/api/v1/votes/history`     | Student's voting history       | JWT     |
| GET    | `/api/v1/blockchain/chain`  | Fetch ledger for explorer      | Admin   |
| GET    | `/api/v1/blockchain/validate`| Live cryptographic chain audit | Admin  |
| GET    | `/api/v1/results/{id}`      | Get Merkle-audited tallies     | Admin   |

---

## 🎨 System Features

### Cryptographic Security
- **Asymmetric Signatures:** Every vote is mathematically signed using the student's personal RSA-2048 private key.
- **Voter Anonymity:** Votes are tracked via a salted `sha256(student_id + election_id)` hash; names are never attached to ballots.
- **Tamper-Evident Ledger:** A Proof-of-Work blockchain validates all incoming blocks via Merkle Roots and sequential hash mapping.

### Frontend Dashboards
- **Premium UI:** Glassmorphism, neon-cyan accents, and responsive drawers built with Material UI.
- **Student Auditor:** Independent `VoteVerification.jsx` portal to verify receipt IDs against the chain.
- **Admin Explorer:** Internal `BlockchainExplorer.jsx` to trace nonces, block indexes, and live chain validations.
- **Chart.js Results:** Interactive `ElectionResults.jsx` calculating live voter turnout, pie shares, and nominal bar statistics.

---

## 📄 License

This project is developed as part of an academic capstone project focused on applied cryptography and software architecture.
