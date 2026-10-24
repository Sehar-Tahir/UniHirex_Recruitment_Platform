import React from "react";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

const SECTIONS = [
{
heading: "1. Using UniHirex",
body: "UniHirex is a recruitment platform designed to connect university students with internships, entry-level jobs, and career opportunities. By accessing or using the platform, you agree to use it responsibly and in accordance with these terms.",
},
{
heading: "2. Account Responsibilities",
body: "You are responsible for providing accurate information when creating your account and for maintaining the confidentiality of your login credentials. You should notify the UniHirex team if you suspect unauthorized access to your account.",
},
{
heading: "3. User Information and Content",
body: "Information submitted to UniHirex, including profiles, education details, skills, resumes, job listings, and applications, should be accurate and up to date. You must have the right to share any content you upload and must not impersonate another person or organization.",
},
{
heading: "4. Job Listings and Recruitment",
body: "Recruiters should publish genuine opportunities and provide clear, accurate job descriptions. Students should submit applications honestly and ensure that the information they provide reflects their qualifications and experience.",
},
{
heading: "5. Acceptable Use",
body: "You must not use UniHirex to distribute misleading information, harass other users, attempt unauthorized access, interfere with platform operations, or engage in fraudulent or unlawful activities.",
},
{
heading: "6. Platform Availability",
body: "UniHirex is currently in active development. Features, services, and platform availability may change as development progresses. We aim to improve the platform but cannot guarantee uninterrupted or error-free operation.",
},
{
heading: "7. Account Restrictions and Termination",
body: "Access to an account may be restricted or suspended if activity violates these terms or threatens the security, reliability, or legitimate use of the platform.",
},
{
heading: "8. Changes to These Terms",
body: "These terms may be revised as UniHirex develops. Updated terms will be published on this page along with a revised update date. Continued use of the platform after changes take effect may be subject to the updated terms.",
},
{
heading: "9. Contact Us",
body: "If you have questions about these terms, please contact the UniHirex team through the Contact page.",
},
];

export default function TermsOfService() {
const lastUpdated = new Date().toLocaleDateString("en-US", {
month: "long",
year: "numeric",
});

return (
<StaticPageLayout
title="Terms of Service"
subtitle={`Last updated ${lastUpdated}`}
> <div className="space-y-6"> <p className="leading-7">
Welcome to UniHirex. These terms describe the general rules for using
our platform, which is being developed to connect university students
with recruiters and career opportunities. Please read them carefully
before using the platform. </p>


    <div className="rounded-xl border border-[#E7EAF3] bg-[#F8FAFF] p-4 sm:p-5">
      <p
        className="text-sm leading-6"
        style={{ ...fontHead, color: COLORS.textDark }}
      >
        Development Notice
      </p>
      <p
        className="mt-2 text-sm leading-6"
        style={{ color: COLORS.textMuted }}
      >
        UniHirex is currently in active development. These terms are a
        preliminary draft and should be reviewed and finalized before
        being treated as the platform's official legal terms.
      </p>
    </div>

    {SECTIONS.map((section) => (
      <section key={section.heading}>
        <h3
          className="mb-2 text-lg font-semibold"
          style={{ ...fontHead, color: COLORS.textDark }}
        >
          {section.heading}
        </h3>
        <p className="leading-7">{section.body}</p>
      </section>
    ))}
  </div>
</StaticPageLayout>


);
}
