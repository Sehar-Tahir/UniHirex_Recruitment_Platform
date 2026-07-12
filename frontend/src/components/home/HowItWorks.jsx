import React from "react";
import { COLORS } from "../../theme";
import SectionHead from "./SectionHead";
import Step from "./Step";

const STEPS = [
  {
    title: "Build your profile",
    desc: "Add education, skills, certifications, and projects — your professional story in one place.",
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
    <section id="how" className="py-20 md:py-24" style={{ background: COLORS.light }}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-8">
        <SectionHead
          kicker="The journey"
          title="From profile to placement!"
          desc="UniHirex is built around the order students actually move through — no detours, no dead ends."
        />
        <div className="relative grid md:grid-cols-4 gap-10 md:gap-0">
          <div
            className="hidden md:block absolute top-7 left-[60px] right-[60px] h-0.5 z-0"
            style={{
              background:
                "repeating-linear-gradient(to right, #C7CEE6 0, #C7CEE6 8px, transparent 8px, transparent 16px)",
            }}
          />
          {STEPS.map((s, i) => (
            <Step key={s.title} number={i + 1} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
