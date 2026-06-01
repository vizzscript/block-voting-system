# 💻 Developer Local Setup Guide

If you need to move this project to another computer, or if another developer wants to run it locally, follow this comprehensive step-by-step guide. 

This guide assumes you are setting up the project using a local **SQLite database**, which requires zero external database installation and is perfect for quick testing and development.

---

## 🛠️ Prerequisites

Before you begin, ensure the new system has the following installed:
1. **Python 3.10 or higher** (For the Backend)
2. **Node.js v18 or higher** (For the React Frontend)
3. **Git** (To clone the repository)

---

## Step 1: Clone the Repository
Open your terminal and clone the project to your local machine:
```bash
git clone <your-repository-url>
cd block-voting-system
```

---

## Step 2: Setup the Python Backend (FastAPI + Blockchain)

The backend handles all the cryptographic signing, database management, and blockchain mining.

**1. Navigate to the backend directory:**
```bash
cd backend
```

**2. Create and activate a Virtual Environment:**
This isolates the Python dependencies so they don't interfere with your system.
* **On Linux/macOS:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```
* **On Windows (Command Prompt or PowerShell):**
  ```bash
  python -m venv venv
  venv\Scripts\activate
  ```

**3. Install the required Python packages:**
```bash
pip install -r requirements.txt
```

**4. Initialize the SQLite Database & Seed the Admin:**
This command will create the `voting.db` file, set up all the blockchain tables, and generate the RSA cryptographic keys for the default administrator.

*(Run this while inside the `backend` folder, with your `venv` activated)*
* **On Linux/macOS:**
  ```bash
  DATABASE_URL=sqlite:///../voting.db PYTHONPATH=. python -c "from app.database.session import engine; from app.database.base import Base; Base.metadata.create_all(bind=engine); from app.utils.initial_data import init_db; init_db(); print('Database tables created and admin seeded successfully!')"
  ```
* **On Windows (PowerShell):**
  ```powershell
  $env:DATABASE_URL="sqlite:///../voting.db"; $env:PYTHONPATH="."; python -c "from app.database.session import engine; from app.database.base import Base; Base.metadata.create_all(bind=engine); from app.utils.initial_data import init_db; init_db(); print('Database tables created and admin seeded successfully!')"
  ```

**5. Start the Backend Server:**
* **On Linux/macOS:**
  ```bash
  DATABASE_URL=sqlite:///../voting.db PYTHONPATH=. uvicorn main:app --reload --host 127.0.0.1 --port 8000
  ```
* **On Windows:**
  ```powershell
  $env:DATABASE_URL="sqlite:///../voting.db"; $env:PYTHONPATH="."; uvicorn main:app --reload --host 127.0.0.1 --port 8000
  ```

Your backend is now running at `http://127.0.0.1:8000`. You can view the API documentation at `http://127.0.0.1:8000/docs`.

---

## Step 3: Setup the React Frontend

Open a **new, separate terminal window** (keep the backend running in the first one).

**1. Navigate to the frontend directory:**
```bash
cd block-voting-system/frontend
```

**2. Install Node modules:**
This downloads all the required packages (React, Material UI, Redux, Chart.js) listed in `package.json`.
```bash
npm install
```

**3. Start the Vite Development Server:**
```bash
npm run dev
```

Your frontend is now running, typically at `http://localhost:5173`. 

---

## Step 4: Verify the Installation

1. Open your web browser and go to `http://localhost:5173`.
2. Navigate to the **Login** page.
3. Enter the default administrator credentials that were seeded during Step 2.4:
   - **Email:** `admin@college.edu`
   - **Password:** `adminpassword123`
4. If you successfully log in and see the Admin Dashboard, the system is perfectly configured! You are ready to start registering candidates and running blockchain elections.

---

## ⚙️ Troubleshooting

- **Error: `ModuleNotFoundError` when starting the backend.**
  *Fix:* Ensure your virtual environment (`venv`) is activated and you have run `pip install -r requirements.txt`. Also, ensure you are passing `PYTHONPATH=.` when running uvicorn.
- **Error: `OperationalError: no such table` or missing columns.**
  *Fix:* Delete the `voting.db` file in the root directory and re-run the database initialization command in Step 2.4.
- **Frontend fails to connect to backend (Network Errors).**
  *Fix:* Ensure the Python backend terminal is actively running without errors on port 8000. The React frontend relies on `http://127.0.0.1:8000` to fetch and post data.
