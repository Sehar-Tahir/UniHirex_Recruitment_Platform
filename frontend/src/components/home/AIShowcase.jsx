import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import SectionHead from "./SectionHead";
import Button from "./Button";
import CheckIcon from "./CheckIcon";
import { icons } from "./icons";

// Update this if you change the default AI limits in backend/utils/aiQuota.js
const AI_ALLOWANCE = "Each student account includes 2 AI interviews and 2 resume analyses. Need more? Request access from inside the app.";

function Frame({ children }) {
  return (
    <div className="rounded-2xl border border-[#E3E8F5] bg-white shadow-[0_24px_48px_-24px_rgba(35,64,184,0.25)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#EEF1F8] bg-[#FAFBFE]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E4E7EF]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#E4E7EF]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#E4E7EF]" />
        <span className="ml-3 text-[11.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          Sample preview
        </span>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

function Bubble({ who, children, cursor }) {
  const ai = who === "ai";
  return (
    <div className={`flex ${ai ? "justify-start" : "justify-end"} mb-3`}>
      <div
        className="max-w-[88%] px-4 py-3 rounded-2xl"
        style={{
          background: ai ? "#EEF1FC" : "#F8ECF1",
          borderTopLeftRadius: ai ? 4 : undefined,
          borderTopRightRadius: ai ? undefined : 4,
        }}
      >
        <p className="text-[11px] font-semibold mb-1" style={{ ...fontBody, color: ai ? COLORS.primary : COLORS.accent }}>
          {ai ? "AI Interviewer" : "You"}
        </p>
        <p className="text-[13.5px] leading-relaxed" style={{ ...fontBody, color: COLORS.textDark }}>
          {children}
          {cursor && (
            <span className="inline-block w-1.5 h-3.5 ml-1 align-middle rounded-sm animate-pulse" style={{ background: COLORS.accent }} />
          )}
        </p>
      </div>
    </div>
  );
}

function InterviewPreview() {
  return (
    <Frame>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12.5px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
          Question 3 of 5
        </span>
        <span className="text-[11.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          Voice · live transcript
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#EEF1F8] overflow-hidden mb-5">
        <div className="h-full rounded-full" style={{ width: "60%", background: COLORS.primary }} />
      </div>
      <Bubble who="ai">How would you handle authentication in a MERN stack application?</Bubble>
      <Bubble who="you" cursor>
        I'd issue a JWT after login and verify it in middleware on every protected route
      </Bubble>
      <div className="flex items-center gap-2 mt-4">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: COLORS.accent }} />
        <span className="text-[12.5px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
          Your turn. Speak your answer
        </span>
      </div>
    </Frame>
  );
}

function ScoreRing({ value }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#E7EAF3" strokeWidth="8" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={COLORS.primary}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="50" textAnchor="middle" fontSize="22" fontWeight="700" fill={COLORS.textDark} style={fontHead}>
        {value}
      </text>
    </svg>
  );
}

function MiniBar({ label, value, color }) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between mb-1">
        <span className="text-[12px]" style={{ ...fontBody, color: COLORS.textDark }}>{label}</span>
        <span className="text-[12px] font-semibold" style={{ ...fontBody, color }}>{value}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function ResumePreview() {
  return (
    <Frame>
      <div className="flex items-center gap-5 mb-5">
        <ScoreRing value={78} />
        <div className="flex-1">
          <MiniBar label="Content" value={82} color="#15803D" />
          <MiniBar label="Skills" value={80} color="#15803D" />
          <MiniBar label="ATS" value={64} color="#B45309" />
        </div>
      </div>
      <div className="rounded-xl px-4 py-3 mb-2" style={{ background: "#FBEAEA" }}>
        <p className="text-[11px] font-semibold mb-1" style={{ ...fontBody, color: "#B91C1C" }}>Before</p>
        <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textDark }}>Worked on a job board website.</p>
      </div>
      <div className="rounded-xl px-4 py-3" style={{ background: "#E7F7EE" }}>
        <p className="text-[11px] font-semibold mb-1" style={{ ...fontBody, color: "#15803D" }}>After</p>
        <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textDark }}>
          Built a responsive job board in React and Node.js that improved load time by [X%].
        </p>
      </div>
    </Frame>
  );
}

function FitPreview() {
  return (
    <Frame>
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5" style={{ background: "#E7F7EE" }}>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 text-white"
          style={{ background: "#15803D" }}
        >
          82%
        </div>
        <div>
          <p className="text-[13px] font-semibold" style={{ ...fontBody, color: "#15803D" }}>AI Match Score</p>
          <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textDark }}>
            Strong match on React and Node.js. MongoDB isn't on your profile yet.
          </p>
        </div>
      </div>
      <p className="text-[12px] font-semibold mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>
        When you apply, you choose:
      </p>
      <div className="flex flex-wrap gap-2">
        {["Resume: Full Stack Developer", "2 of 3 projects", "Phone: not shared", "Cover note"].map((chip) => (
          <span
            key={chip}
            className="text-[12px] font-medium px-3 py-1.5 rounded-full"
            style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
          >
            {chip}
          </span>
        ))}
      </div>
    </Frame>
  );
}

function RecruiterPreview() {
  return (
    <Frame>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-[14px]"
            style={{ background: COLORS.primary }}
          >
            A
          </div>
          <div>
            <p className="text-[14px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>Sample applicant</p>
            <p className="text-[12px]" style={{ ...fontBody, color: COLORS.textMuted }}>Applied for Frontend Intern</p>
          </div>
        </div>
        <span
          className="text-[11.5px] font-bold px-2.5 py-1 rounded-full"
          style={{ ...fontBody, background: "#E7F7EE", color: "#15803D" }}
        >
          AI fit 76%
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {["Resume attached", "3 projects shared", "Phone: not shared"].map((chip) => (
          <span
            key={chip}
            className="text-[12px] font-medium px-3 py-1.5 rounded-full"
            style={{ ...fontBody, background: "#F1F5F9", color: COLORS.textMuted }}
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="flex gap-2.5">
        <span className="text-[12.5px] font-semibold px-4 py-2 rounded-lg text-white" style={{ ...fontBody, background: COLORS.primary }}>
          Shortlist
        </span>
        <span className="text-[12.5px] font-semibold px-4 py-2 rounded-lg text-white" style={{ ...fontBody, background: COLORS.accent }}>
          📅 Invite to Interview
        </span>
      </div>
    </Frame>
  );
}

const TABS = [
  {
    id: "interview",
    label: "AI Interview Coach",
    icon: icons.mic,
    audience: "For students",
    title: "Practice interviews out loud",
    desc: "Have a real voice conversation with an AI interviewer, tailored to your role, level and interview type. Every answer is transcribed live and scored at the end.",
    points: [
      "Choose 1 to 10 questions and the interview type, such as technical, HR or behavioral",
      "Practice for a specific listing straight from its job page",
      "Get a scored report with strengths, areas to improve and feedback on each answer",
      "Track your progress across interviews",
    ],
    cta: { label: "Start practicing", to: "/register" },
    Preview: InterviewPreview,
  },
  {
    id: "resume",
    label: "AI Resume Analyzer",
    icon: icons.resume,
    audience: "For students",
    title: "See your resume like a recruiter and an ATS do",
    desc: "Upload a PDF or DOCX and get a score out of 100, an ATS compatibility check, and the exact lines to rewrite.",
    points: [
      "Scores for content, structure, skills, language and ATS compatibility",
      "Paste a job description to see matched and missing keywords",
      "A suggested professional summary and before-and-after bullet rewrites you can copy",
      "Save up to 5 named resumes and track your score for each",
    ],
    cta: { label: "Analyze my resume", to: "/register" },
    Preview: ResumePreview,
  },
  {
    id: "fit",
    label: "AI Job Fit Score",
    icon: icons.sparkle,
    audience: "For students",
    title: "Know your match before you apply",
    desc: "Open any listing and the AI compares your skills with the job's requirements, then explains the score in a sentence. It understands that ReactJS and React.js are the same skill.",
    points: [
      "A match percentage with a plain-language explanation",
      "Before you apply, review everything the company will receive and edit it",
      "Pick which resume, projects and certifications to include",
      "Choose whether to share your phone number",
    ],
    cta: { label: "Create student profile", to: "/register" },
    Preview: FitPreview,
  },
  {
    id: "recruiter",
    label: "Candidate Fit (recruiters)",
    icon: icons.discover,
    audience: "For recruiters",
    title: "Shortlist faster with an AI fit score",
    desc: "Open an application to see exactly what the student chose to share, then check an AI fit score against your listing's requirements.",
    points: [
      "Each applicant's shared details, resume and cover note on one page",
      "Request an AI fit score for any applicant, only when you want one",
      "Shortlist, then invite to interview with a date, time and meeting link",
      "Scores are a guide. The decision stays with you",
    ],
    cta: { label: "Post a job", to: "/register?role=recruiter" },
    Preview: RecruiterPreview,
  },
];

export default function AIShowcase() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const active = TABS.find((t) => t.id === activeId);
  const isRecruiter = active.audience === "For recruiters";
  const Preview = active.Preview;

  return (
    <section id="ai" className="py-20 md:py-24" style={{ background: "linear-gradient(180deg, #FFFFFF, #F4F6FD)" }}>
      <div className="max-w-295 mx-auto px-5 md:px-8">
        <SectionHead
          kicker="AI toolkit"
          title="An AI coach in your corner"
          desc="Four tools built into the platform, so students walk into every application prepared and recruiters spend less time guessing."
        />

        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {TABS.map((t) => {
            const on = t.id === activeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                aria-pressed={on}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[13.5px] font-semibold transition-all duration-200"
                style={{
                  ...fontBody,
                  background: on ? COLORS.primary : "#fff",
                  color: on ? "#fff" : COLORS.textDark,
                  border: `1.5px solid ${on ? COLORS.primary : "#D7DEF5"}`,
                  boxShadow: on ? "0 8px 20px -10px rgba(35,64,184,0.6)" : "none",
                }}
              >
                <span className="scale-75 -mx-1">{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
          <div>
            <span
              className="inline-block text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded-full mb-4 text-white"
              style={{ ...fontBody, background: isRecruiter ? COLORS.accent : COLORS.primary }}
            >
              {active.audience}
            </span>
            <h3 className="text-2xl md:text-[28px] font-semibold mb-3 leading-snug" style={{ ...fontHead, color: COLORS.textDark }}>
              {active.title}
            </h3>
            <p className="text-[15px] leading-relaxed mb-5" style={{ ...fontBody, color: COLORS.textMuted }}>
              {active.desc}
            </p>
            <ul className="mb-6">
              {active.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14.5px] font-medium mb-3" style={{ ...fontBody, color: COLORS.textDark }}>
                  <CheckIcon color={isRecruiter ? COLORS.accent : COLORS.primary} />
                  {p}
                </li>
              ))}
            </ul>
            <Button variant="primary" to={active.cta.to}>
              {active.cta.label} →
            </Button>
          </div>

          <div key={active.id}>
            <Preview />
          </div>
        </div>

        <p className="text-center text-[13px] mt-10" style={{ ...fontBody, color: COLORS.textMuted }}>
          {AI_ALLOWANCE}
        </p>
      </div>
    </section>
  );
}