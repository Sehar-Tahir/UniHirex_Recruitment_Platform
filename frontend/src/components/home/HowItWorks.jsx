import React from "react";
import { COLORS } from "../../theme";
import SectionHead from "./SectionHead";
import Step from "./Step";

const STEPS = [
  {
    title: "Build your profile",
    desc: "Add education, skills, certifications, and projects, your professional story in one place.",
    accent: "blue",
  },
  {
    // title: "Get discovered",
    // desc: "Recruiters search by skill, university, and CGPA to find candidates like you.",
    title: "Upload Resume",
    desc: "Upload your resume to get discovered by recruiters searching for candidates like you.",
    accent: "burgundy",
  },
  {
    title: "Apply with one click",
    desc: "Browse jobs and internships, filter by location or salary, and apply straight from your profile.",
    accent: "blue",
  },
  {
    title: "Track and get hired",
    desc: "Follow every application's status and respond to interview invites the moment they arrive.",
    accent: "filled",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="relative py-20 md:py-24 overflow-hidden"
      style={{
        background: COLORS.surfaceMuted,
        backgroundImage: `radial-gradient(#D7DEF5 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      <div className="max-w-295 mx-auto px-5 md:px-8">
        <SectionHead
          kicker="The journey"
          title="From profile to placement!"
          desc="UniHirex is built around the order students actually move through when applying for jobs and internships. Here's how it works."
        />
        <div className="relative grid md:grid-cols-4 gap-10 md:gap-0">
          <div
            className="hidden md:block absolute top-5.5 left-15 right-15 h-0.5 z-0 overflow-hidden"
            style={{ background: "#E7EAF3" }}
          >
            <div
              className="h-full w-1/4 animate-[flowRight_3s_linear_infinite]"
              style={{ background: `linear-gradient(to right, transparent, ${COLORS.primary}, transparent)` }}
            />
          </div>
          <style>{`
            @keyframes flowRight {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-\\[flowRight_3s_linear_infinite\\] { animation: none; }
            }
          `}</style>
          {STEPS.map((s, i) => (
            <Step key={s.title} number={i + 1} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
