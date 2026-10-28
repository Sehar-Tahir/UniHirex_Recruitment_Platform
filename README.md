# UniHirex

**Where talent meets opportunity.**

UniHirex is a full-stack recruitment platform that connects university students with recruiters. Students build one profile, sharpen it with AI tools, and apply with full control over what the company sees. Recruiters post listings, review exactly what each applicant shared, and move good candidates forward. Admins keep the platform trusted and watch how it is used.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

**Live site:** [unihirex.app](https://unihirex.vercel.app)


> UniHirex is a Final Year Project built at the Islamia University of Bahawalpur (IUB). It started as an IUB-only platform and now accepts students from any university.

---

## Table of Contents

- [UniHirex](#unihirex)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
    - [Accounts and access](#accounts-and-access)
    - [Students](#students)
    - [Recruiters](#recruiters)
    - [Admins](#admins)
    - [Admin analytics](#admin-analytics)
    - [Landing page](#landing-page)
  - [AI Features in Detail](#ai-features-in-detail)
    - [AI Interview Coach](#ai-interview-coach)
    - [AI Resume Analyzer](#ai-resume-analyzer)
    - [AI Job Fit and Candidate Fit](#ai-job-fit-and-candidate-fit)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Data Model](#data-model)
  - [API Overview](#api-overview)
  - [Environment Variables](#environment-variables)
    - [`backend/.env`](#backendenv)
    - [`frontend/.env`](#frontendenv)
  - [Deployment](#deployment)
  - [Security and Privacy](#security-and-privacy)
  - [Author](#author)
  - [License and Credits](#license-and-credits)

---

## Key Features

### Accounts and access

- Register as a **student** or **recruiter** (students can use any email domain).
- **Email verification is enforced at login.** Unverified accounts cannot sign in.
- Real **forgot password and reset password** emails with secure, time-limited links.
- **Recruiters must be approved by an admin** before they can sign in.
- Role-based routing for Student, Recruiter and Admin, plus a separate, unlisted admin login.

### Students

- **Dashboard** with profile completion, recent applications, interview details and notifications.
- **Rich profile:** phone, university and department (pick from a list or type your own), semester, CGPA (validated 0 to 4.00), skills, projects with **GitHub and live links**, certifications, **portfolio, LinkedIn and GitHub links**, and a profile photo.
- **Up to 5 named resumes** (for example "Full Stack Developer", "DevOps") with one default.
- **Browse jobs and internships** with search, filters (category including custom ones, type, experience level, location, minimum salary), pagination and saved jobs.
- **Apply with full control.** A review window shows exactly what the company will receive. Edit your details for this application, choose which projects, certifications and resume to include, decide whether to share your phone number, add a cover note, and optionally save the edits to your profile. A copy of what you shared is stored, so later profile edits don't change an application already sent.
- **My Applications** with status tabs. Shortlisted applications show the interview details, the recruiter's message, a **Join meeting** button that stays active until 24 hours after the interview time, and an **Add to Google Calendar** link.
- **Notifications** for status changes, matching jobs and interview invitations, with an unread badge. Links in notifications are clickable.

### Recruiters

- **Dashboard** with live stats and a recent-applicant feed.
- **Company profile** with logo.
- **Post jobs and internships** with a validated salary range (whole numbers, 0 or more), custom categories and requirements.
- **Manage listings** with applicant counts and close or reopen.
- **Applicants list**, then a full **application page** showing everything the student chose to share: contact details, education, links, skills, selected projects and certifications, cover note and the attached resume.
- On the application page: **Shortlist or Reject**, an **AI fit score on request**, and **Invite to Interview** (date, time, meeting link and message) once shortlisted.
- **Candidate search** by name, university or skill, with saved candidates and full candidate profiles.

### Admins

- **Dashboard** and a full **Analytics** page (see below).
- **Manage Users:** search, filter, approve recruiters, suspend or activate, create other admins, change a student's **AI access limits**, and **permanently delete** a student or recruiter account with a clear summary of what will be removed.
- **Manage Jobs:** platform-wide moderation (flag, close, reactivate).
- **Notifications** for new recruiters awaiting approval and AI access requests.

### Admin analytics

A date-range selector (7, 30, 90 days or all time) and independent sections that each load on their own:

- **Overview:** KPI cards with change versus the previous period.
- **Application funnel:** received, shortlisted, invited to interview, under review, rejected.
- **Platform health:** pending recruiters, students without a resume or skills, unverified and suspended accounts, listings by status.
- **Growth:** daily sign-ups, listings and applications (grouped in Pakistan time).
- **Jobs and skills:** listings by category and type, most-applied jobs, top companies, and **skills demand versus supply**.
- **AI usage:** interviews and resume analyses, average scores, daily usage, students at their limit and access requests.

### Landing page

A public landing page with an AI toolkit showcase and **live platform statistics** that come from a cached public endpoint (real numbers, no placeholders).

---

## AI Features in Detail

All AI features use **Google Gemini**. Each student account includes **2 AI interviews and 2 resume analyses** by default. Admins can change the limit for any student, and students can request more access from inside the app. Failed AI calls are not counted against the limit.

### AI Interview Coach

- A real **voice conversation** with an AI interviewer. Choose the role, level (junior, mid, senior), type (technical, HR, behavioral, mixed, role-specific) and 1 to 10 questions.
- Can be started **from a job page**, so the questions follow that listing's requirements.
- The room shows a **live transcript** in a chat layout. The AI's question and your answer appear as text while you speak.
- At the end you get a **scored report**: overall score, five category scores, strengths, areas to improve, a recommendation and per-question feedback.
- **Interview history** with a progress chart across attempts.
- UniHirex stores the **text transcript and scores, not your audio**.

### AI Resume Analyzer

- Analyze any saved resume (**as PDF**), with an optional target role and pasted job description.
- Scores for **content, structure, skills, language and ATS compatibility**, plus an overall score out of 100.
- **ATS issue list**, sections found, skills found, **recommended skills to add**, and **matched and missing keywords** against a job description.
- **Issues with a concrete fix**, a suggested **professional summary**, and **before-and-after bullet rewrites** with Copy and "Mark as applied".
- **History, version tracking per resume, and progress** between analyses. Reports can be deleted.

### AI Job Fit and Candidate Fit

- Students click **Check my match** on a job to see a percentage and a one-sentence explanation. The AI understands that "ReactJS" and "React.js" are the same skill.
- Recruiters click **Check AI Match** on an application. It uses the skills the student shared for that application.
- Both run **only when clicked**, work once per page visit, and results are cached so identical questions are not sent to the AI twice.
- Scores are a guide only. The hiring decision stays with the recruiter.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router, Context API, react-hot-toast, Recharts |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt, email verification, role-based middleware |
| File storage | Cloudinary (resumes, profile photos, company logos) |
| Email | Nodemailer with Gmail SMTP |
| AI | Google Gemini (`@google/generative-ai` for text, `@google/genai` for Live voice) |
| Document parsing | mammoth (DOCX text extraction) |
| Hosting | Vercel (frontend and backend), MongoDB Atlas |

---

## Architecture

```

                     ┌───────────────────────────────┐
                     │   React app (Vercel static)   │
                     └───────┬───────────────┬───────┘
                             │ REST (JWT)    │ WebSocket (audio)
                             ▼               ▼
        ┌──────────────────────────┐   ┌──────────────────────┐
        │  Express API (Vercel     │   │  Gemini Live API     │
        │  serverless functions)   │   │  (voice interviews)  │
        └───┬──────┬──────┬────────┘   └──────────────────────┘
            │      │      │                      ▲
            ▼      ▼      ▼                      │ short-lived
        MongoDB  Cloudinary  Gemini (text)       │ token minted
         Atlas   (files)     + Gmail (email)     │ by the API
            └────────────────────────────────────┘
```

**Why voice interviews connect directly from the browser.** Serverless functions can't hold a WebSocket open. So the backend only checks the student's quota, builds the interview instructions on the server, and mints a **single-use, 30-minute token**. The browser then talks to Gemini Live directly using that token. The real API key never reaches the browser, and the instructions can't be tampered with because they are locked into the token.

**Other design decisions**

- **Quotas are atomic.** A single database operation checks and uses a slot, so two simultaneous requests can't both get through. Slots are refunded if the AI call fails.
- **Applications store a snapshot** of what the student shared, so recruiters always see exactly that version.
- **Interview times are read and shown in Pakistan time (UTC+5)** regardless of where the server runs.
- The landing page stats come from `GET /api/public/stats`, which returns aggregate counts only and is cached for 5 minutes.

---

## Project Structure

```
unihirex/
├── frontend/
│   ├── src/
│   │   ├── api/                 # One file per resource; shared fetch wrapper in client.js
│   │   ├── components/
│   │   │   ├── auth/            # Auth layout and form pieces
│   │   │   ├── dashboard/       # student/, recruiter/, admin/ components
│   │   │   ├── admin/analytics/ # Chart and card components for the analytics page
│   │   │   ├── home/            # Landing page sections
│   │   │   └── resume/          # Resume analysis report
│   │   ├── context/             # AuthContext (user, token, login, logout)
│   │   ├── data/                # Dropdown options (universities, departments, semesters)
│   │   ├── hooks/               # Reusable hooks (saved candidates, public stats, analytics)
│   │   ├── pages/               # auth, student, recruiter, admin, company, legal, home
│   │   ├── routes/              # ProtectedRoute
│   │   ├── utils/               # Link checks, audio capture and playback
│   │   └── theme.js             # Colour tokens and fonts
│   ├── vercel.json              # Rewrites every route to index.html (single-page app)
│   └── package.json
│
├── backend/
│   ├── config/                  # db, cloudinary, email, gemini, geminiLive
│   ├── controllers/             # Request handlers by feature
│   ├── middleware/              # JWT protect, role authorize, upload (multer + Cloudinary)
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # Express routers
│   ├── utils/                   # Validation, quotas, AI prompts, analytics helpers, pagination
│   ├── seedAdmin.js             # Create or reset the first admin account
│   ├── seedDemoData.js          # Optional demo data for screenshots and demos
│   ├── vercel.json              # Serverless function configuration
│   └── server.js
│
└── README.md
```

---

## Data Model

| Collection | Purpose |
|---|---|
| `User` | Students, recruiters and admins. Profile, saved resumes, links, AI limits and usage, verification and reset tokens (hidden from normal queries). |
| `Job` | Listings with category, type, salary range, requirements and status (Active, Flagged, Closed). |
| `Application` | One per student per job (unique). Status, interview invitation, and the snapshot of what the student shared. |
| `Notification` | Per-user notifications with read state. |
| `Interview` | AI interview sessions: configuration, transcript, scores and status. |
| `ResumeAnalysis` | Saved resume reports, with scores, suggestions and per-resume version tracking. |
| `MatchCache` | Saved AI match results (keyed by a fingerprint, expires after 30 days). |

---

## API Overview

All routes are under `/api`. Routes marked 🔒 need a valid token, and the role is shown in brackets.

| Area | Key endpoints |
|---|---|
| **Auth** `/auth` | `POST /register`, `POST /login`, `POST /verify-email/:token`, `POST /resend-verification`, `POST /forgot-password`, `POST /reset-password/:token` |
| **Users** `/users` 🔒 | `GET/PATCH /me`, `GET /me/ai-quota`, `POST /me/ai-quota/request`, resumes `GET/POST /me/resumes` and `PATCH/DELETE /me/resumes/:id`, saved jobs and candidates, `GET /candidates` and `GET /candidates/:id` [recruiter, admin] |
| **Jobs** `/jobs` | `GET /` (public, filters and pagination), `GET /recommended`, `GET /categories`, `GET /:id`, `GET /:id/match-score` 🔒 [student], `POST /` 🔒 [recruiter], `PATCH /:id/status`, `GET /recruiter/mine`, `GET /recruiter/stats` |
| **Applications** `/applications` 🔒 | `POST /` [student], `GET /mine`, `GET /check/:jobId`, `GET /job/:jobId` [recruiter], `GET /:id` [recruiter], `PATCH /:id/status`, `GET /:id/candidate-match`, `POST /:id/invite-interview` |
| **Interviews** `/interviews` 🔒 [student] | `POST /`, `GET /`, `GET /:id`, `POST /:id/ephemeral-token`, `PATCH /:id/transcript` |
| **Resume analysis** `/resume-analysis` 🔒 [student] | `POST /`, `GET /`, `GET /:id`, `PATCH /:id/suggestions`, `DELETE /:id` |
| **Notifications** `/notifications` 🔒 | List, mark one as read, mark all as read |
| **Upload** `/upload/:type` 🔒 | `POST` for `resume`, `photo` or `logo` |
| **Admin** `/admin` 🔒 [admin] | Users (list, approve, toggle status, create admin, AI quota and limits, deletion summary and delete), jobs, stats, and `analytics/overview`, `growth`, `jobs`, `ai` |
| **Public** `/public` | `GET /stats` (aggregate counts only, cached) |

---

## Environment Variables

### `backend/.env`

| Variable | Description |
|---|---|
| `PORT` | Local port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign login tokens |
| `FRONTEND_URL` | Where the frontend runs. Used in verification and reset email links, for example `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | From the Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From the Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From the Cloudinary dashboard |
| `GMAIL_USER` | The Gmail address emails are sent from |
| `GMAIL_APP_PASSWORD` | The 16-character app password (no spaces) |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GEMINI_MODEL` | Text model for matching, resume analysis and interview scoring |
| `GEMINI_LIVE_MODEL` | Live voice model for the Interview Coach |

Google renames and retires model names often, which is why they are environment variables. Check Google's current model list and update them without touching code.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GMAIL_USER=your_address@gmail.com
GMAIL_APP_PASSWORD=your16characterpassword
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_LIVE_MODEL=gemini-3.1-flash-live-preview
```

Generate a strong `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL **ending in `/api`**, for example `http://localhost:5000/api` |

---

## Deployment

Both apps deploy to **Vercel** as two separate projects from the same repository.

1. **Backend project.** Set the root directory to `backend`. Add every variable from the backend table above, with `FRONTEND_URL` set to the real frontend URL. The backend runs as serverless functions: `server.js` exports the Express app, skips `app.listen()` on Vercel, and reuses its database connection between requests.
2. **Frontend project.** Set the root directory to `frontend` (Vite is detected automatically). Add `VITE_API_URL` pointing to the backend URL plus `/api`. The included `vercel.json` rewrites every route to `index.html`, so direct links and page refreshes work.
3. **Redeploy after changing any environment variable.** Vercel applies them only to new deployments.
4. **Cloudinary:** in the Cloudinary dashboard under Settings → Security, allow delivery of PDF files, or resume links will not open.
5. **Check after deploying:** register, verify the email link, apply for a job, and run one AI interview and one resume analysis on the live site.

---

## Security and Privacy

**What is in place**

- Passwords are hashed with bcrypt and never returned by the API.
- JWT authentication with role-based middleware, and ownership checks so users can only read or change their own data.
- Email verification and admin approval of recruiters before sign-in.
- Server-side validation for profile fields, links, CGPA, salary ranges and application data. Nothing the browser sends is trusted on its own.
- Uploaded resume links must point to the project's own Cloudinary folder.
- AI usage limits that cannot be bypassed by repeating requests or deleting reports.
- Short-lived, single-use tokens for voice interviews, so the Gemini API key stays on the server.
- Deleting an account removes the profile, applications, AI data, notifications and (where possible) uploaded files.

**Privacy notes**

- Resumes, interview audio and job details are processed by **Google Gemini** when you use the AI features. UniHirex does not store interview audio, only the text transcript and scores. The in-app **Privacy Policy** page describes this in full.
- Approved recruiters can view student profiles, including the default resume, even before a student applies. Phone numbers are shared only when a student chooses to include one in an application.
- Uploaded files are stored at unlisted but not password-protected links.

---

<!-- ## Screenshots

_Add screenshots here. A good set: landing page, student dashboard, profile, apply window, application page (recruiter), AI Interview Coach room and report, Resume Analyzer report, admin analytics._

```markdown
![Landing page](docs/screenshots/landing.png)
```

--- -->

## Author

**Sehar Tahir**
Full Stack Web Developer and GoHighLevel CRM AUtomation Specialist
[Portfolio](https://sehar-portfolio-site.vercel.app) · [GitHub](https://github.com/Sehar-Tahir) · [LinkedIn](https://linkedin.com/in/sehartahir)

---

## License and Credits

This is an academic Final Year Project. Choose and add a license file before making the repository public.

Built with [React](https://react.dev), [Vite](https://vite.dev), [Tailwind CSS](https://tailwindcss.com), [Express](https://expressjs.com), [MongoDB Atlas](https://www.mongodb.com/atlas), [Cloudinary](https://cloudinary.com), [Google Gemini](https://ai.google.dev), [Recharts](https://recharts.org) and [Vercel](https://vercel.com).
