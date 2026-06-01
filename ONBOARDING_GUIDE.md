# 🗳️ Localhost Onboarding Guide: College Secure Voting Portal

Welcome to the **Secure Voting Portal for College Elections**. This onboarding document provides clear, step-by-step instructions for **Students** and **Administrators** to log in, navigate, and utilize the application running locally on `localhost`.

---

## 📅 Quick Links (Localhost)
- **Portal Landing Page:** `http://localhost:5173` (or `http://localhost:5174`)
- **Login Portal:** `http://localhost:5173/login`
- **Voter Registration:** `http://localhost:5173/register`

---

## 🧑‍🎓 1. Student (Voter) Onboarding Guide

As a student, you can register, update your personal voter profile, inspect running candidates, view manifestos, and track active elections.

### Step 1.1: Voter Registration
1. Navigate to the **Voter Registration** page: `http://localhost:5173/register`.
2. Fill in your details:
   - **Full Name** & **Student ID** (e.g., `STU-2026-0891`)
   - **University Email** (e.g., `student@college.edu`)
   - **Department** (Select from dropdown) & **Year** (Select from dropdown)
   - **Secure Password** (Minimum 6 characters)
3. Click **Register Account**. Upon success, you will be redirected to the Login page.

### Step 1.2: Logging In
1. Go to the **Login Portal**: `http://localhost:5173/login`.
2. Enter your registered email and password.
3. Click **Sign In**. You will land on the **Student Dashboard**.

### Step 1.3: Exploring the Student Portal
Once logged in, use the sidebar to navigate the following sections:
- **📊 Student Dashboard:** See a summary of active elections and running candidates.
- **🛡️ My Profile:** Review your student registration identifiers. You can update your **Full Name**, **Department**, and **Year** (your Email and Student ID are locked for security auditing).
- **🎓 View Candidates:** Search, sort, and filter candidate nominees by department or running position. Click **manifesto** on any candidate's card to read their campaign promises in a full detailed dialog.
- **🗳️ View Elections:** Track the college election timeline. View **ongoing** elections and read their descriptions. *(Note: Draft ballots are strictly hidden from students).*

---

## 🔑 2. Administrator (System Manager) Onboarding Guide

As an administrator, you have complete control over the system, including auditing registered students, nominating candidate portfolios, and coordinating the election lifecycles.

### Step 2.1: Logging in with Pre-seeded Credentials
Your local system automatically seeds a secure Administrator account on startup. Log in with the following default credentials:

*   **Email Address:** `admin@college.edu`
*   **Password:** `adminpassword123`

---

### Step 2.2: Operating the Admin Console
Once logged in, you will be redirected to the **Admin Console Dashboard** (`/admin/dashboard`) showing analytical charts, active student counts, and live elections.

Using the sidebar, you can access your administrative portals:

#### 👥 A. Manage Users (Student Roster)
- View a listing of all registered student voters.
- Audit student names, email addresses, departments, and active statuses.

#### 📝 B. Manage Candidates (Nominee Profiles)
- **Add Nominees:** Click the **Add Nominee** button. Fill out the nominee's Name, Student ID, running Position (e.g., President), Department, optional Profile Image link, and campaign Manifesto.
- **Edit Nominees:** Click the **Edit (Pencil) Icon** on any nominee's row to modify their manifesto or department settings.
- **Remove Nominees:** Click the **Delete (Trash) Icon** to permanently remove a candidate nominee from the system.

#### ⚙️ C. Manage Elections (Lifecycle Coordinator)
This is where you schedule and control the lifecycle of all ballots:
1. **Create Ballots:** Click **Create Ballot**. Specify a Title, category Position, Start Date, End Date, and initial status (**Draft** or **Scheduled**).
2. **Launch Live Voting (Activate):** When a ballot is in `Draft` or `Scheduled` status, click the **Play (Green) Icon** to instantly make the election live. It will immediately appear on the Student Portal for voting.
3. **End Voting (Close):** Click the **Block (Red) Icon** on any active election to terminate voting immediately and close the ballot.
4. **Audit Voter Stats:** Click the **Chart (Purple) Icon** on any closed or ongoing election to view total voter turnouts and candidate nominal statistics.

---

## 🛠️ 3. Troubleshooting Local Access

### Q: Why is my browser blocking network calls (CORS error)?
- **Cause:** This happens if your frontend dev server falls back to port `5174` (or `5175`) due to port `5173` being occupied.
- **Solution:** We implemented a dynamic CORS regex. Simply refresh your browser tab, clear the cache, and ensure the URL in the address bar is pointing directly to either `http://localhost:5173` or `http://localhost:5174`. The backend will automatically recognize and trust the port.

### Q: What should I do if the backend says "OperationalError"?
- **Cause:** The database connection is interrupted or looking for Docker hostnames.
- **Solution:** Ensure you set `export DATABASE_URL=sqlite:///voting.db` before executing the `uvicorn main:app` command in the terminal to route all local queries to a standalone database file!
