import React from "react";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

const SECTIONS = [
  {
    heading: "Using UniHirex",
    body: "By creating an account, you agree to provide accurate information and use the platform only for genuine job-seeking or recruiting purposes.",
  },
  {
    heading: "Accounts",
    body: "You're responsible for maintaining the security of your account and any activity that happens under it.",
  },
  {
    heading: "Content",
    body: "Any information you submit your profile details, job listings, applications should be accurate and belong to you or your organization.",
  },
  {
    heading: "Changes to these terms",
    body: "As UniHirex is currently in active development, these terms will be reviewed and finalized ahead of any public launch.",
  },
];

export default function TermsOfService() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle={`Last updated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
    >
      <p className="mb-6">
        This is a placeholder terms of service for UniHirex, a project currently in development.
        It will be reviewed and finalized before any public launch.
      </p>
      {SECTIONS.map((s) => (
        <div key={s.heading} className="mb-6">
          <h3 className="text-lg font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
            {s.heading}
          </h3>
          <p>{s.body}</p>
        </div>
      ))}
    </StaticPageLayout>
  );
}