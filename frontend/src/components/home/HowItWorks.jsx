
import React from "react";
import { COLORS } from "../../theme";
import SectionHead from "./SectionHead";
import Step from "./Step";

const STEPS = [
  {
    title: "Build your profile",
    desc: "Add your education, skills, certifications and projects with GitHub and live links, then save up to 5 named resumes.",
    accent: "blue",
  },
  {
    title: "Sharpen it with AI",
    desc: "Get your resume scored, fix ATS problems, and practice voice interviews with an AI coach.",
    accent: "burgundy",
  },
  {
    title: "Apply with confidence",
    desc: "See your job fit score, review exactly what the company will receive, choose your resume, then apply.",
    accent: "blue",
  },
  {
    title: "Track and get hired",
    desc: "Follow every application's status and get notified when you're shortlisted or invited to interview.",
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
          title="From profile to placement"
          desc="UniHirex follows the order students actually move through when they go for a job or internship."
        />
        <div className="relative grid md:grid-cols-4 gap-10 md:gap-0">
          <div
            className="hidden md:block absolute top-5.5 left-15 right-15 h-0.5 z-0 overflow-hidden"
            style={{ background: "#E7EAF3" }}
          >
            <div
              className="h-full w-1/4 flow-bar"
              style={{ background: `linear-gradient(to right, transparent, ${COLORS.primary}, transparent)` }}
            />
          </div>
          <style>{`
            .flow-bar { animation: flowRight 3s linear infinite; }
            @keyframes flowRight {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .flow-bar { animation: none; }
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