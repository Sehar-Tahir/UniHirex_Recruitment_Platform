# UniHirex

**Connecting Students with Opportunities**

UniHirex is a university recruitment platform that bridges the gap between students and employers — students build professional profiles and apply to jobs and internships, while recruiters post listings, search candidates, and manage applications, all under platform-wide admin moderation.

---

## About

UniHirex started as a Final Year Project at the Islamia University of Bahawalpur (IUB), built as a full MERN stack application from the ground up — from a landing page and brand system through role-based dashboards for three distinct user types.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- React Router
- Context API (auth state)

**Backend** *(in progress)*
- Node.js + Express.js
- MongoDB
- JWT Authentication + Bcrypt
- Cloudinary (file storage)

**Deployment**
- Vercel (frontend)
- Render (backend)

---

## Features

### Authentication
- Register (role selection: Student / Recruiter)
- Login
- Forgot Password → Reset Password flow
- Email Verification
- Role-based route protection with a dedicated Unauthorized screen

### Student
- Dashboard — profile completion, recommended jobs/internships, recent applications, notifications
- Profile management — basic info, photo, skills, projects, certifications, resume upload
- Browse Jobs & Internships — search, filter by category/type/experience/location, save listings
- Job details + Apply
- Track Applications — status filtering (Under Review / Shortlisted / Rejected)
- Notifications

### Recruiter
- Dashboard — active listings, applicant stats, recent applicant activity
- Company Profile management
- Post Jobs / Internships
- Manage Listings — close/reopen postings
- Applicant Review — shortlist or reject candidates per listing
- Search Candidates — filter by skill, view full candidate profiles, save/bookmark candidates
- Notifications

### Admin
- Dashboard — platform-wide stats and activity feed
- Manage Users — filter by role, suspend/activate accounts
- Manage Jobs — platform-wide listing moderation (flag/close/reactivate)
- Notifications

---

## Design System

| Token | Description |
|---|---|
| `primary` | Main brand blue |
| `primaryLight` | Soft blue accent |
| `accent` | Brand burgundy (CTAs, highlights) |
| `accentLight` | Soft burgundy accent |
| `textDark` | Primary text color |
| `textMuted` | Secondary/muted text |
| `surfaceMuted` | Light background surfaces |

Colors are defined as semantic tokens (not literal color names) in `theme.js`, so the entire palette can be re-themed by editing one file.

**Typography:** Poppins (headings), Inter (body)

**UI principles:** rounded corners, soft shadows, card-based layouts, mobile-responsive.

---

## Project Structure

```
unihirex/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Auth layout, form inputs, role toggle
│   │   │   ├── dashboard/      # Sidebar, topbar, layout shell
│   │   │   │   ├── student/
│   │   │   │   ├── recruiter/
│   │   │   │   └── admin/
│   │   │   └── home/           # Landing page components
│   │   ├── context/            # AuthContext
│   │   ├── data/                # Mock data (temporary, pre-backend)
│   │   ├── hooks/                # useListings, useApplicants, useUsers, etc.
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── recruiter/
│   │   │   ├── admin/
│   │   │   └── home/
│   │   ├── routes/             # ProtectedRoute
│   │   ├── theme.js             # Design tokens
│   │   └── App.jsx
│   └── package.json
└── backend/                     # In progress
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Sehar-Tahir/unihirex.git
cd unihirex/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Testing the app (current state)

Since backend integration is still in progress, authentication currently runs on dummy logic — any email/password combination will log you in as a Student. To test other roles, open your browser console and run:

```js
localStorage.setItem("unihirex_user", JSON.stringify({ name: "Your Name", role: "recruiter" }))
```

Replace `"recruiter"` with `"student"` or `"admin"` as needed, then refresh.

---

## Project Status

**Frontend:** Complete — all pages, flows, and role-based dashboards are built and functional using mock data with `localStorage` persistence.

**Backend:** In progress — Express + MongoDB API, JWT authentication, and real data persistence to replace the current mock layer.

**Planned (Phase 2+):**
- AI Resume Analyzer
- AI Job Matching
- AI Skill Gap Analysis
- AI Career Recommendations
- AI Interview Preparation
- Student ↔ Recruiter messaging

---

## Author

**Sehar Tahir**
Web Developer & GoHighLevel Specialist
[Portfolio](https://sehar-portfolio.vercel.app) · [GitHub](https://github.com/Sehar-Tahir) · [LinkedIn](https://linkedin.com/in/sehartahir)
