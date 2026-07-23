# ThesisFlow 🎓

**ThesisFlow** is a modern, full-stack Academic Thesis Management & Review Platform designed for universities and higher education institutions. It streamlines the entire thesis lifecycle from student draft creation, supervisor review, and feedback discussions to final department coordinator approval and archiving.

---

## 🌟 Key Features

### 👤 Role-Based Portals & Scoping
- **Students**: Create thesis drafts, upload `.pdf` or `.docx` papers into private workspace previews, manually submit to supervisors, track revision history, and communicate directly with supervisors.
- **Supervisors**: Access a dedicated **"My Department Students"** roster showing student index numbers, manage incoming thesis submissions, leave version-specific feedback notes, request revisions, or approve theses.
- **Department Coordinators**: Access the department-wide archive of supervisor-approved theses, view approved documents, and utilize coordinator override powers to reopen theses for revisions if necessary.

### 🔢 Institutional 8-Digit Index Numbers
- Automatic generation of cryptographically secure 8-digit unique index numbers (e.g. `58492019`) for all registered students and staff.
- Enforced at both the database level via PostgreSQL `@unique` constraints and the application level via zero-collision retry algorithms.

### 📄 2-Step Draft Upload & Submission Workflow
1. **Upload Draft File**: Uploading a paper file saves it to the student's private workspace preview area. The thesis remains in `Draft` state so supervisors **cannot** view it until the student is 100% ready.
2. **Submit to Supervisor**: Students click **"Submit Version X to Supervisor"** with a confirmation dialog, transitioning the thesis to `Submitted` and notifying the assigned supervisor in real time.

### 🔍 Live Document Viewer & Version History
- **Interactive PDF Viewer**: Embedded `<iframe>` document preview built directly into the student workspace and supervisor review screens.
- **Version Switcher**: View and compare historical submissions (`v1`, `v2`, `v3`) with version-specific feedback threads and direct file download links.

### 🔔 Real-Time Notification System & Unread Badges
- Smart unread notification badges displaying `1` through `9` or **`9+`** on the desktop sidebar and mobile header.
- **Click-to-Navigate**: Clicking a notification automatically marks it as read and redirects the user straight to the relevant workspace or review page.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **Styling**: TailwindCSS & Custom Design System (Material Symbols)
- **State & Auth**: React Context API (`AuthContext`)

### Backend
- **Runtime**: Node.js & Express.js
- **ORM**: Prisma ORM
- **Database**: PostgreSQL
- **Security & Uploads**: JWT (`jsonwebtoken`), `bcryptjs`, `multer` static storage

---

## 📂 System Architecture & Schema

```
ThesisFlow System Architecture:

+-------------------+          +----------------------+          +-------------------------+
|   Student Portal  | -------- |  Express Backend API | -------- |  PostgreSQL (Prisma)    |
|   (React / Vite)  |          |  (Node.js / JWT)     |          |  - Users (Index #)      |
+-------------------+          +----------------------+          |  - Departments          |
                                          |                      |  - Theses & Submissions |
+-------------------+                     |                      |  - Comments & Notes     |
| Supervisor Portal | --------------------+                      |  - Notifications        |
+-------------------+                                            +-------------------------+
```

---

## ⚙️ Setup & Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Running on `localhost:5432` or remote server)
- [Git](https://git-scm.com/)

---

### Step 1: Environment Setup

1. **Backend Environment**:
   Navigate to `backend/` and create/verify the `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/thesisflow?schema=public"
   JWT_SECRET="dev-secret-change-me-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   ```

2. **Frontend Environment**:
   Vite is preconfigured in `frontend/vite.config.js` to proxy `/api` and `/uploads` requests directly to `http://localhost:3000`.

---

### Step 2: Backend Installation & Database Setup

Open your terminal and run:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Push database schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed the database with default departments, coordinators, and supervisors
node prisma/seed.js
```

---

### Step 3: Frontend Installation

Open a second terminal window and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

---

### Step 4: Run Development Servers

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   *The Express API will start on `http://localhost:3000`.*

2. **Start Frontend App**:
   ```bash
   cd frontend
   npm run dev
   ```
   *The React app will start on `http://localhost:5173`.*

---

## 🔐 Default Seeded Accounts

The seed script (`backend/prisma/seed.js`) automatically provisions 3 departments, 3 coordinators, and 9 supervisors. 

**Password for ALL seeded accounts**: `password123`

### 1. Computer Science Department
- **Coordinator**: `compscicoordinator@gmail.com`
- **Supervisor 1**: `compscisupervisor1@gmail.com`
- **Supervisor 2**: `compscisupervisor2@gmail.com`
- **Supervisor 3**: `compscisupervisor3@gmail.com`

### 2. Mathematics Department
- **Coordinator**: `mathcoordinator@gmail.com`
- **Supervisor 1**: `mathsupervisor1@gmail.com`
- **Supervisor 2**: `mathsupervisor2@gmail.com`
- **Supervisor 3**: `mathsupervisor3@gmail.com`

### 3. Engineering Department
- **Coordinator**: `engineeringcoordinator@gmail.com`
- **Supervisor 1**: `engineeringsupervisor1@gmail.com`
- **Supervisor 2**: `engineeringsupervisor2@gmail.com`
- **Supervisor 3**: `engineeringsupervisor3@gmail.com`

*Note: Students self-register on the frontend at `http://localhost:5173/register` and select their department.*

---

## 🔄 Thesis Workflow Summary

```
[Student Creates Draft] ➔ [Uploads Draft File (.pdf/.docx)] ➔ [Previews in Workspace]
                                                                     |
                                                                     v
                                                   [Clicks "Submit to Supervisor"]
                                                                     |
                                                                     v
                                                   [Supervisor Clicks "Start Review"]
                                                                     |
                                                                     v
                                            +------------------------+------------------------+
                                            |                                                 |
                                            v                                                 v
                             [Requests Revisions]                                      [Approves Thesis]
                                     |                                                        |
                                     v                                                        v
                       [Student Uploads New Version]                             [Forwarded to Coordinator Archive]
```

---

## 📜 License
This project is open-source and licensed under the MIT License.
