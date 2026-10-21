import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

const LAST_UPDATED = "October 2026";

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p className="mb-3">{children}</p>;
}

function Bullets({ items }) {
  return (
    <ul className="list-disc pl-6 mb-3 flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const linkStyle = { color: COLORS.primary, textDecoration: "underline" };

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout title="Privacy Policy" subtitle={`Last updated ${LAST_UPDATED}`}>
      <P>
        UniHirex is a university recruitment platform that connects students with recruiters. It is currently run as a
        final year project. This policy explains what information we collect, how it is used, who it is shared with,
        and the choices you have. It describes how UniHirex works today, and we will update it when that changes.
      </P>

      <Section title="Information we collect">
        <P>We collect only what is needed to run the platform:</P>
        <Bullets
          items={[
            "Account details: your name, email address, role (student or recruiter) and password. Passwords are stored only as a one-way hash, so nobody, including us, can read them.",
            "Student profile: phone number, university, department, semester, CGPA, skills, projects and their links, certifications, portfolio and social links, profile photo, and the resumes you upload.",
            "Recruiter profile: company name, industry, website and company logo.",
            "Activity on the platform: jobs you save, applications you send, listings you post, and your notifications.",
            "AI feature data, described in the section on AI features below.",
            "Technical data: a sign-in token stored in your browser so you stay logged in, and standard server logs kept by our hosting providers.",
          ]}
        />
      </Section>

      <Section title="How we use your information">
        <Bullets
          items={[
            "To create and run your account, including sending you an email to verify your address or reset your password.",
            "To show student profiles to recruiters and company listings to students.",
            "To match you with opportunities and notify you, for example when a new job matches your skills or an application's status changes.",
            "To provide the AI features described below.",
            "To keep the platform safe, including admin review of recruiter accounts and job listings.",
          ]}
        />
        <P>We do not sell your personal information, and UniHirex does not show advertising.</P>
      </Section>

      <Section title="Who can see your information">
        <Bullets
          items={[
            "Recruiters: UniHirex exists to connect students with employers, so recruiters who have been approved by an admin can search and view student profiles. This includes your name, email address, photo, university, department, semester, CGPA, skills, projects and their links, portfolio and social links, and your default resume. They can see this even if you have not applied to their listing. We do not show your phone number in candidate search or on candidate profiles.",
            "When you apply: the recruiter who posted that listing can see your application and its status.",
            "Students can see job listings and the company details that recruiters add.",
            "Admins: platform administrators can see account information in order to moderate the platform and help users.",
          ]}
        />
        <P>
          If you do not want recruiters to be able to view your profile, you can ask us to delete your account (see
          "Your choices" below).
        </P>
      </Section>

      <Section title="AI features and Google Gemini">
        <P>
          UniHirex uses Google's Gemini AI to power several features. When you use them, the information described below
          is sent to Google for processing:
        </P>
        <Bullets
          items={[
            "Job fit scores: your skills and the requirements of a job are sent to Gemini to estimate how well they match. For students this happens automatically when you open a job's details page. Recruiters can request the same kind of score for an applicant.",
            "AI Resume Analyzer: the resume you choose (the PDF or DOCX file, or its text) and any target role or job description you type in are sent to Gemini to produce your report.",
            "AI Interview Coach: your voice is streamed from your browser to Google's Gemini Live service in real time, and Gemini replies with a spoken voice. Your spoken conversation is also converted to text.",
            "Interview reports: the text transcript of your interview is sent to Gemini to generate your score and feedback.",
          ]}
        />
        <P>
          What UniHirex keeps: your resume analysis reports, and the text transcript, scores and feedback for your
          interviews. UniHirex does not record or store your interview audio. We also keep simple counts of how many
          times you have used each AI feature, because each student has a usage limit.
        </P>
        <P>
          Google processes this information under its own terms and privacy notices, not ours, and we cannot control how
          it is handled on Google's side. UniHirex currently uses Google's free (unpaid) Gemini API. Under Google's
          terms for unpaid use, Google may use submitted content to improve its products, and it may be reviewed by
          people. You can read Google's terms at{" "}
          <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            ai.google.dev/gemini-api/terms
          </a>
          . Please do not include sensitive information, such as ID numbers, financial details or health information, in
          resumes you analyze or in your interview answers.
        </P>
        <P>
          AI results are automated estimates and can be wrong. Scores shown to recruiters are a guide only and should not
          be the only basis for any hiring decision. Using the AI Resume Analyzer and the AI Interview Coach is optional.
        </P>
      </Section>

      <Section title="Services we use">
        <Bullets
          items={[
            "MongoDB Atlas, which stores our database.",
            "Cloudinary, which stores uploaded files: profile photos, company logos and resumes. Files are kept at unlisted links that are hard to guess, but they are not password-protected, so anyone who has the exact link can open the file.",
            "Google, for the Gemini AI features described above and for sending our emails.",
            "Vercel, which hosts the website and its server.",
          ]}
        />
        <P>These providers process data on our behalf to run UniHirex, and they have their own privacy policies.</P>
      </Section>

      <Section title="Security">
        <P>
          Passwords are stored as hashes, connections to UniHirex use HTTPS, recruiter accounts must be approved by an
          admin before they can sign in, and access to features is limited by role. No online service can be completely
          secure, so we cannot guarantee absolute security.
        </P>
      </Section>

      <Section title="How long we keep your information, and deleting your account">
        <P>
          We keep your information while your account exists. An administrator can permanently delete an account at your
          request. When an account is deleted we remove its profile, applications, AI interviews and resume analyses, and
          notifications, and we delete its uploaded files from our file storage where possible. When a recruiter account
          is deleted, its job listings and the applications made to them are removed as well, and the affected students
          are notified. Copies that other providers, such as Google, may have received through the AI features are
          covered by their own policies. Deletion cannot be undone.
        </P>
      </Section>

      <Section title="Your choices">
        <Bullets
          items={[
            "Edit your profile, skills, projects and links at any time.",
            "Add, replace or delete your resumes from your profile.",
            "Delete any resume analysis you no longer want to keep.",
            "Choose not to use the AI features.",
            <>
              Ask us to delete your account by contacting us through the{" "}
              <Link to="/contact" style={linkStyle}>
                Contact page
              </Link>
              .
            </>,
          ]}
        />
      </Section>

      <Section title="Children">
        <P>UniHirex is built for university students and recruiters and is not intended for children.</P>
      </Section>

      <Section title="Changes to this policy">
        <P>
          We may update this policy as UniHirex changes. The date at the top shows when it was last updated.
        </P>
      </Section>

      <Section title="Contact">
        <P>
          Questions about this policy or your data? Reach us through the{" "}
          <Link to="/contact" style={linkStyle}>
            Contact page
          </Link>
          .
        </P>
      </Section>
    </StaticPageLayout>
  );
}