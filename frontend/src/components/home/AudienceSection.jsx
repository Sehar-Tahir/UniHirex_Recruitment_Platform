
import React from "react";
import SectionHead from "./SectionHead";
import AudienceCard from "./AudienceCard";

export default function AudienceSection() {
  return (
    <section id="students" className="py-20 md:py-24">
      <div className="max-w-295 mx-auto px-5 md:px-8">
        <SectionHead
          kicker="Built for both sides"
          title="One platform, two clear paths"
          desc="Whether you're applying or hiring, UniHirex gives you exactly what the job requires nothing extra to dig through."
        />
        <div className="grid md:grid-cols-2 gap-7">
          <AudienceCard
            theme="student"
            badge="For students"
            title="Turn your degree into momentum"
            desc="One profile that holds your skills, projects, links and resumes, plus AI tools that get you ready before you apply."
            items={[
              "Build a profile with projects, GitHub and live links, and up to 5 resumes",
              "Practice voice interviews and get your resume scored by AI",
              "Apply with full control over what the company sees",
              "Track every application and interview invitation",
            ]}
            ctaLabel="Create student profile"
            ctaVariant="outline"
            ctaTo="/register"
          />
          <AudienceCard
            id="recruiters"
            theme="recruiter"
            badge="For recruiters"
            title="Hire from the next graduating class"
            desc="Search student profiles, review exactly what each applicant shared, and move good candidates forward quickly."
            items={[
              "Post jobs and internships in minutes",
              "Search students by skill, CGPA, or department",
              "Review each application with an AI fit score on request",
              "Shortlist and invite to interview from one page",
            ]}
            ctaLabel="Post your first job"
            ctaVariant="primary"
            ctaTo="/register?role=recruiter"
          />
        </div>
      </div>
    </section>
  );
}
