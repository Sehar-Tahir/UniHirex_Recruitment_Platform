import React from "react";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

export default function About() {
  return (
    <StaticPageLayout
      title="About UniHirex"
      subtitle="Connecting university students with opportunities."
    >
      <p className="mb-5">
        UniHirex is a university recruitment platform built to close the gap between students
        looking for internships and entry-level roles, and the recruiters trying to reach them.
        Students often struggle to find opportunities, build professional visibility, and get
        discovered while companies struggle to reach qualified student talent efficiently.
        UniHirex solves this by giving both sides one shared, purpose-built platform.
      </p>
      <p className="mb-5">
        Students build a living profile education, skills, certifications, projects and
        apply directly to jobs and internships. Recruiters post listings, search verified student
        profiles by skill or university, and manage their entire hiring pipeline from one dashboard.
      </p>
      <h3 className="text-xl font-semibold mt-8 mb-3" style={{ ...fontHead, color: COLORS.textDark }}>
        Where it started
      </h3>
      <p className="mb-5">
        UniHirex began as a Final Year Project at the Islamia University of Bahawalpur (IUB),
        built end-to-end as a full MERN stack application from brand and design system through
        role-based dashboards for students, recruiters, and administrators.
      </p>
    </StaticPageLayout>
  );
}