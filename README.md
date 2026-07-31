# UniHirex

## Connecting Students with Opportunities

UniHirex is a university recruitment platform that bridges the gap between students and employers. Students build professional profiles, upload resumes, and apply to jobs and internships, while recruiters post listings, search candidates, and manage applications, all under platform-wide admin moderation.

**Live site:** [UniHirex](https://unihirex.vercel.app)

---

## About

UniHirex started as a Final Year Project at the Islamia University of Bahawalpur (IUB), built as a full MERN stack application from the ground up. From a landing page and brand system through role-based dashboards, a real Node.js/Express/MongoDB backend, file storage, email delivery, and production deployment.

---

## Tech Stack

### Frontend

- React 19 + Vite
- Tailwind CSS
- React Router
- Context API (auth state)
- react-hot-toast (notifications/feedback)

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication + bcrypt password hashing
- Cloudinary (resume, photo, and logo storage)
- Nodemailer + Gmail (transactional email: verification, password reset)

### Deployment

- Vercel (frontend - static hosting with SPA rewrites)
- Vercel (backend - Express adapted for serverless functions)
- MongoDB Atlas (cloud database)

---

## Features

### Authentication

- Register (role selection: Student / Recruiter), with recruiter accounts requiring admin approval before login
- Login with real JWT issuance
- Separate, unlisted Admin Login (`/admin-login`)
- Email verification - real emails sent on registration, **enforced at login** (unverified accounts cannot sign in; admin accounts are auto-verified)
- Forgot Password → real email with a secure, time-limited reset link → Reset Password
- Role-based route protection with a dedicated Unauthorized screen and a 404 page

### Student

- Dashboard → real profile completion percentage, recommended jobs, recent applications, notifications
- Profile management → basic info, photo upload (Cloudinary), skills, projects, certifications, resume upload (Cloudinary, downloadable)
- Browse Jobs & Internships → real backend search/filter (category, type, experience, location), pagination, save/bookmark listings
- Job details + Apply (duplicate-application protection enforced at the database level)
- Track Applications → real status updates (Under Review / Shortlisted / Rejected), pagination
- Notifications with unread badge count

### Recruiter

- Dashboard → real stats (active listings, total applicants, shortlisted, new this week) computed from the database, recent applicant feed
- Company Profile management with logo upload
- Post Jobs / Internships
- Manage Listings → close/reopen postings, pagination
- Applicant Review → view each applicant's full profile (including resume), shortlist or reject, pagination
- Search Candidates → real database search by skill/university, pagination, save/bookmark candidates
- Notifications (new applicant, account approval)

### Admin

- Separate secured login, not linked from the public site
- Dashboard → real platform-wide stats and a merged recent-activity feed (new users + new listings)
- Manage Users → filter/search, approve pending recruiters, suspend/activate accounts, create additional admin accounts
- Manage Jobs → platform-wide listing moderation (flag/close/reactivate), independent of a recruiter's own view
- Notifications (new recruiter registrations pending review)

---

## Design System

| Token | Description |
| --- | --- |
| `primary` | Main brand blue |
| `primaryLight` | Soft blue accent |
| `accent` | Brand burgundy (CTAs, highlights) |
| `accentLight` | Soft burgundy accent |
| `textDark` | Primary text color |
| `textMuted` | Secondary/muted text |
| `surfaceMuted` | Light background surfaces |

Colors are defined as semantic tokens (not literal color names) in `theme.js`, so the entire palette can be re-themed by editing one file.

**Typography:** Poppins (headings), Inter (body)

---

## Project Structure

```text
unihirex/
├── frontend/
│   ├── src/
│   │   ├── api/                 # All backend API calls, grouped by resource
│   │   │   ├── client.js        # Shared fetch wrapper (auth headers, error handling)
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── jobs.js
│   │   │   ├── applications.js
│   │   │   ├── admin.js
│   │   │   ├── notifications.js
│   │   │   └── upload.js
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   │   ├── student/
│   │   │   │   ├── recruiter/
│   │   │   │   └── admin/
│   │   │   ├── home/
│   │   │   └── Pagination.jsx
│   │   ├── context/              # AuthContext (real JWT + user state)
│   │   ├── hooks/                # useSavedCandidates, etc.
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── recruiter/
│   │   │   ├── admin/
│   │   │   ├── company/          # About, Careers, Contact, Blog
│   │   │   ├── legal/            # Privacy, Terms, Cookies
│   │   │   └── home/
│   │   ├── routes/                # ProtectedRoute
│   │   ├── theme.js
│   │   └── App.jsx
│   ├── vercel.json                # SPA rewrite rules (fixes 404 on direct route access)
│   └── package.json
│
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection (cached for serverless)
│   │   ├── cloudinary.js
│   │   └── email.js
│   ├── models/                   # User, Job, Application, Notification
│   ├── controllers/
│   ├── routes/
│   ├── middleware/                # authMiddleware (JWT verify + role authorize), uploadMiddleware
│   ├── utils/                     # generateToken, paginate
│   ├── seedAdmin.js               # One-time/repeatable script to create or reset the first admin
│   ├── vercel.json                # Serverless function config
│   └── server.js
│
└── README.md
```

## Project Status

**Frontend:** Complete → all pages, flows, and role-based dashboards, fully connected to the real backend.

**Backend:** Complete → real authentication, database-backed jobs/applications/profiles, file uploads, email delivery, notifications, and pagination across all list views.

**Deployed:** Live on Vercel (frontend + backend), connected to MongoDB Atlas.

**Planned / in progress:**

- Real skill-based job matching
- AI Resume Analyzer, AI Interview Preparation (from original spec's Phase 2)
- Student ↔ Recruiter messaging (post-shortlist)
- Interview scheduling
- Dashboard analytics charts
- Recruiter verification documents
- Security hardening (rate limiting, input sanitization)

---

### Author

**Sehar Tahir**
Web Developer & GoHighLevel Specialist
[Portfolio](https://sehar-portfolio-site.vercel.app) · [GitHub](https://github.com/Sehar-Tahir) · [LinkedIn](https://linkedin.com/in/sehartahir)
