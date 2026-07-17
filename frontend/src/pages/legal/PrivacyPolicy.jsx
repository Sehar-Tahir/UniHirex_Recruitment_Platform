import React from "react";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

const SECTIONS = [
  {
    heading: "Information we collect",
    body: "When you create an account, we collect information you provide directly such as your name, email, education, skills, and resume to build your profile and connect you with relevant opportunities.",
  },
  {
    heading: "How we use your information",
    body: "Your information is used to display your profile to recruiters (if you're a student) or candidates (if you're a recruiter), to match you with relevant listings, and to send you notifications about your applications.",
  },
  {
    heading: "Data storage",
    body: "As UniHirex is currently in active development, this policy will be expanded with full details on data storage and security practices ahead of any public launch.",
  },
  {
    heading: "Your choices",
    body: "You can update or delete your profile information at any time from your dashboard.",
  },
];

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle={`Last updated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
    >
      <p className="mb-6">
        This is a placeholder privacy policy for UniHirex, a project currently in development.
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