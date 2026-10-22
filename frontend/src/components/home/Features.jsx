
import React from "react";
import { COLORS } from "../../theme";
import SectionHead from "./SectionHead";
import FeatureTile from "./FeatureTile";
import { icons } from "./icons";

const TILES = [
  {
    icon: icons.resume,
    title: "Complete student profiles",
    desc: "Education, skills, projects with GitHub and live links, certifications, and portfolio and social links in one profile recruiters can evaluate.",
    theme: "blue",
  },
  {
    icon: icons.layers,
    title: "Up to 5 named resumes",
    desc: "Keep a resume for each kind of role, such as Full Stack or DevOps, and choose the right one for every application.",
    theme: "burgundy",
  },
  {
    icon: icons.search,
    title: "Smart job and internship search",
    desc: "Filter by category (or type your own), job type, experience level, location, and minimum salary.",
    theme: "blueSoft",
  },
  {
    icon: icons.shield,
    title: "Apply with full control",
    desc: "Review exactly what the company will receive, edit it, and choose your resume, projects, and whether to share your phone number.",
    theme: "blue",
  },
  {
    icon: icons.discover,
    title: "Candidate search and review",
    desc: "Recruiters search student profiles by skill, department or CGPA, and open each application to see what the student shared.",
    theme: "burgundy",
  },
  {
    icon: icons.calendar,
    title: "Interview invitations",
    desc: "Shortlist an applicant, then invite them with a date, time and meeting link. They're notified in the app.",
    theme: "blueSoft",
  },
  {
    icon: icons.bell,
    title: "Notifications that matter",
    desc: "Status changes, matching jobs, interview invites and new applicants, with an unread badge so nothing slips by.",
    theme: "blue",
  },
  {
    icon: icons.briefcase,
    title: "Role-based dashboards",
    desc: "Purpose-built spaces for students, recruiters and admins. Recruiters are approved by an admin before they can sign in.",
    theme: "burgundy",
  },
  {
    icon: icons.chart,
    title: "Admin analytics and moderation",
    desc: "Admins see growth, the application funnel, and skills demand versus supply, moderate listings, and control AI access.",
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