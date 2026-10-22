import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import SectionHead from "./SectionHead";

const CASES = [
  {
    who: "A student",
    title: "Landing a frontend internship",
    color: COLORS.primary,
    bg: "#EEF1FC",
    steps: [
      "Add projects with GitHub and live links, and save a separate resume for each type of role.",
      "Run the AI Resume Analyzer against the listing and fix what it flags, like ATS problems and weak bullet points.",
      "Practice a voice interview for that exact listing.",
      "Apply: review what the company will receive, pick the right resume, and send.",
    ],
    chips: ["Multiple resumes", "AI Resume Analyzer", "AI Interview Coach", "Smart apply"],
  },
  {
    who: "A recruiter",
    title: "Filling an internship slot",
    color: COLORS.accent,
    bg: "#F8ECF1",
    steps: [
      "Post the listing with a salary range and clear requirements.",
      "Open each application to see exactly what the student shared, and check an AI fit score when you want one.",
      "Shortlist the strongest candidates.",
      "Invite them to an interview with a date, time and meeting link. They get a notification.",
    ],
    chips: ["Application review", "AI fit score", "Interview invites"],
  },
  {
    who: "A platform admin",
    title: "Keeping the platform trusted",
    color: COLORS.primaryLight,
    bg: "#EEF1FC",
    steps: [
      "Approve recruiters before they can sign in.",
      "Moderate listings by flagging, closing or reactivating them.",
      "Watch growth, the application funnel, and skills demand versus supply on the analytics page.",
      "Decide who can use the AI tools, and how much.",
    ],
    chips: ["Recruiter approval", "Moderation", "Analytics", "AI access control"],
  },
];

export default function UseCases() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-295 mx-auto px-5 md:px-8">
        <SectionHead
          kicker="See it in action"
          title="Three ways UniHirex gets used"
          desc="Example walkthroughs of how each role moves through the platform."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {CASES.map((c) => (
            <div key={c.who} className="rounded-2xl border border-[#ECEEF3] p-7 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[12px] font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                  style={{ ...fontBody, background: c.bg, color: c.color }}
                >
                  {c.who}
                </span>
                <span className="text-[11.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                  Example scenario
                </span>
              </div>
              <h3 className="text-[19px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
                {c.title}
              </h3>
              <ol className="flex flex-col gap-3 mb-6">
                {c.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed" style={{ ...fontBody, color: COLORS.textMuted }}>
                    <span
                      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold mt-0.5"
                      style={{ background: c.bg, color: c.color }}
                    >
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2 mt-auto">
                {c.chips.map((chip) => (
                  <span
                    key={chip}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-full"
                    style={{ ...fontBody, background: "#F1F5F9", color: COLORS.textDark }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}