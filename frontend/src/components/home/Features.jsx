import React from "react";
import { COLORS } from "../../theme";
import SectionHead from "./SectionHead";
import FeatureTile from "./FeatureTile";
import { icons } from "./icons";

const TILES = [
  {
    icon: icons.resume,
    title: "Complete student profiles",
    desc: "Education, skills, projects, certifications, and resume, one living profile recruiters can actually evaluate.",
    theme: "blue",
  },
  {
    icon: icons.search,
    title: "Smart job & internship search",
    desc: "Filter by category, type, salary, experience level, and location to find the right fit fast.",
    theme: "burgundy",
  },
  {
    icon: icons.discover,
    title: "Recruiter candidate search",
    desc: "Companies search verified student profiles by skill, department, or CGPA, no application required first.",
    theme: "blueSoft",
  },
  {
    icon: icons.briefcase,
    title: "Post & manage listings",
    desc: "Recruiters publish jobs and internships, then review, shortlist, or close listings from one dashboard.",
    theme: "blue",
  },
  {
    icon: icons.grid,
    title: "Application tracking",
    desc: "Students track every application's status; recruiters track every applicant's progress in real time.",
    theme: "burgundy",
  },
  {
    icon: icons.layers,
    title: "Role-based dashboards",
    desc: "Purpose-built experiences for students, recruiters, and admins, including platform-wide moderation tools.",
    theme: "blueSoft",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-24" style={{ background: COLORS.surfaceMuted }}>
      <div className="max-w-295 mx-auto px-5 md:px-8">
        <SectionHead
          kicker="Platform features"
          title="Everything a campus hire needs"
          desc="Every module is designed around one job: getting the right student in front of the right recruiter, faster."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {TILES.map((t) => (
            <FeatureTile key={t.title} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
