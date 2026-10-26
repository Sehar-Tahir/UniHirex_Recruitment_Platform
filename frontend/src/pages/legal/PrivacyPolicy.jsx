

import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

const LAST_UPDATED = "October 2026";

function Section({ title, children }) {
return ( <section className="mb-8">
<h3
className="mb-3 text-lg font-semibold"
style={{ ...fontHead, color: COLORS.textDark }}
>
{title} </h3> <div className="space-y-3 text-sm leading-7 sm:text-[15px]">
{children} </div> </section>
);
}

function P({ children }) {
return <p>{children}</p>;
}

function Bullets({ items }) {
return ( <ul className="mb-3 flex flex-col gap-2 pl-5 sm:pl-6">
{items.map((item, index) => ( <li key={index} className="list-disc pl-1">
{item} </li>
))} </ul>
);
}

const linkStyle = {
color: COLORS.primary,
textDecoration: "underline",
textUnderlineOffset: "3px",
};

export default function PrivacyPolicy() {
return (
<StaticPageLayout
title="Privacy Policy"
subtitle={`Last updated ${LAST_UPDATED}`}
> <div className="text-sm leading-7 sm:text-[15px]"> <p className="mb-6">
UniHirex is a university recruitment platform that connects students
with recruiters. It is currently operated as a final-year project.
This policy explains what information we collect, how we use it, who
it may be shared with, and the choices available to you. It describes
our current practices and will be updated as the platform evolves. </p>


    <div className="mb-8 rounded-xl border border-[#E2E8F8] bg-[#F7F9FF] p-4 sm:p-5">
      <h3
        className="mb-2 font-semibold"
        style={{ ...fontHead, color: COLORS.textDark }}
      >
        Your Privacy Matters
      </h3>
      <p style={{ color: COLORS.textMuted }}>
        Please review how your profile is shared with recruiters and how
        information is processed by our AI features before using the
        platform.
      </p>
    </div>

    <Section title="1. Information We Collect">
      <P>We collect information needed to operate and improve UniHirex:</P>
      <Bullets
        items={[
          "Account details: your name, email address, account role (student or recruiter), and password. Passwords are stored as one-way hashes rather than in readable form.",
          "Student profile: phone number, university, department, semester, CGPA, skills, projects and project links, certifications, portfolio and social links, profile photo, and uploaded resumes.",
          "Recruiter profile: company name, industry, website, and company logo.",
          "Platform activity: saved jobs, applications, job listings, and notifications associated with your account.",
          "AI feature data: information processed when you use the AI features described in the AI section below.",
          "Technical data: authentication tokens stored in your browser and standard server logs maintained by our hosting infrastructure.",
        ]}
      />
    </Section>

    <Section title="2. How We Use Your Information">
      <Bullets
        items={[
          "To create and manage accounts, verify email addresses, and support password resets.",
          "To display student profiles to recruiters and company job listings to students.",
          "To help students discover relevant opportunities and receive notifications about jobs or application status changes.",
          "To provide AI-powered job matching, resume analysis, and interview feedback.",
          "To maintain platform security, including reviewing recruiter accounts and job listings.",
        ]}
      />
      <P>
        We do not sell your personal information, and UniHirex does not
        display advertising.
      </P>
    </Section>

    <Section title="3. Who Can See Your Information">
      <Bullets
        items={[
          "Recruiters: approved recruiters can search for and view student profiles, including names, email addresses, photos, university details, department, semester, CGPA, skills, projects and project links, portfolio and social links, and the default resume. This visibility can apply even if you have not applied for a recruiter's listing. Your phone number is not shown in candidate search or on candidate profiles. If you choose to share it when applying, the recruiter responsible for that listing can see it.",
          "When you apply: the recruiter who posted the job can view the application details you submit, including your selected resume, cover note, shared contact information, and application status. A copy of the submitted application is retained, so later profile changes do not automatically change an application already sent.",
          "Students: students can view job listings and company details published by recruiters.",
          "Administrators: authorized platform administrators can access account information when needed to moderate the platform, maintain security, and assist users.",
        ]}
      />
      <P>
        If you do not want recruiters to be able to view your profile, you
        can request account deletion. See the Your Choices section below.
      </P>
    </Section>

    <Section title="4. AI Features and Google Gemini">
      <P>
        UniHirex uses Google's Gemini AI services to power certain
        features. When you choose to use these features, relevant
        information is sent to Google for processing.
      </P>

      <Bullets
        items={[
          "Job fit scores: your skills and a job's requirements are sent to Gemini to estimate how well they match. For students, this may happen automatically when a job details page is opened. Recruiters can request a similar score for applicants.",
          "AI Resume Analyzer: the resume you select, including its file or extracted text, along with any target role or job description you provide, is sent to Gemini to generate an analysis report.",
          "AI Interview Coach: your voice is streamed from your browser to Google's Gemini Live service during the interview. Gemini responds with spoken audio, and the conversation is also converted into text.",
          "Interview reports: the text transcript of an interview is sent to Gemini to generate scores and feedback.",
        ]}
      />

      <P>
        UniHirex stores resume analysis reports and interview transcripts,
        scores, and feedback. According to our current implementation,
        interview audio is not recorded or stored by UniHirex. We also
        maintain usage counts for AI features to enforce student usage
        limits.
      </P>

      <P>
        Google processes information under its own terms and privacy
        practices. UniHirex does not control Google's independent handling
        of information. UniHirex currently uses Google's unpaid Gemini API
        service. Google's terms for unpaid use may permit submitted content
        to be used to improve its products and may allow human review.
        Please review Google's applicable terms before submitting
        information.
      </P>

      <P>
        Google's Gemini API terms are available at{" "}
        <a
          href="https://ai.google.dev/gemini-api/terms"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          ai.google.dev/gemini-api/terms
        </a>
        . Avoid including unnecessary sensitive information, such as
        identity numbers, financial details, or health information, in
        resumes or interview responses submitted for AI processing.
      </P>

      <P>
        AI-generated results are estimates and may be inaccurate or
        incomplete. Recruiters should not rely exclusively on AI scores
        when making hiring decisions. Use of the AI Resume Analyzer and AI
        Interview Coach is optional.
      </P>
    </Section>

    <Section title="5. Third-Party Services">
      <P>
        UniHirex relies on third-party services to operate its platform.
        These currently include:
      </P>

      <Bullets
        items={[
          "MongoDB Atlas: database storage.",
          "Cloudinary: storage for uploaded profile photos, company logos, and resumes. Files may be accessible to anyone who obtains their exact URL if access controls do not restrict them. Unlisted URLs should not be treated as password protection.",
          "Google: Gemini AI processing and email-related services.",
          "Vercel: website hosting and server infrastructure.",
        ]}
      />

      <P>
        These providers may process information as part of delivering
        their services and have their own terms and privacy policies.
        Their handling of information is also subject to the applicable
        agreements and settings for our accounts.
      </P>
    </Section>

    <Section title="6. Security">
      <P>
        We use measures intended to protect information, including
        password hashing, HTTPS connections, role-based access controls,
        and administrator approval for recruiter accounts. However, no
        online service or storage system can be guaranteed completely
        secure.
      </P>
    </Section>

    <Section title="7. Data Retention and Account Deletion">
      <P>
        We generally retain account information while the account remains
        active. You can request account deletion through the Contact page.
        An administrator will handle the request according to the
        platform's available deletion processes.
      </P>

      <P>
        Account deletion is intended to remove the associated profile,
        applications, AI interviews, resume analyses, notifications, and
        uploaded files where supported by our systems. Deleting a
        recruiter account may also remove its job listings and associated
        applications, and affected students may be notified.
      </P>

      <P>
        Information already shared with third-party providers, including
        Google through AI features, may be subject to their separate
        retention and deletion practices. Some information may also remain
        temporarily in backups or logs where applicable. Deletion may be
        irreversible.
      </P>
    </Section>

    <Section title="8. Your Choices">
      <P>You can take the following actions:</P>

      <Bullets
        items={[
          "Edit your profile, skills, projects, and links.",
          "Add, replace, or delete resumes from your profile.",
          "Delete resume analysis reports where the feature supports it.",
          "Choose not to use optional AI features.",
          <>
            Request account deletion by contacting us through the{" "}
            <Link to="/contact" style={linkStyle}>
              Contact page
            </Link>
            .
          </>,
        ]}
      />
    </Section>

    <Section title="9. Children">
      <P>
        UniHirex is designed for university students and recruiters and is
        not intended for children.
      </P>
    </Section>

    <Section title="10. Changes to This Policy">
      <P>
        We may revise this policy as UniHirex develops or our data
        practices change. The date at the top indicates when this policy
        was last updated. Material changes should be reflected in the
        revised policy.
      </P>
    </Section>

    <Section title="11. Contact Us">
      <P>
        If you have questions about this policy or how your information is
        handled, please reach out through the{" "}
        <Link to="/contact" style={linkStyle}>
          Contact page
        </Link>
        .
      </P>
    </Section>
  </div>
</StaticPageLayout>


);
}
