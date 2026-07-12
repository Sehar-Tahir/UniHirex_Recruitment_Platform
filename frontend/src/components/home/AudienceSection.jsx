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
          desc="Whether you're applying or hiring, UniHirex gives you exactly what the job requires — nothing extra to dig through."
        />
        <div className="grid md:grid-cols-2 gap-7">
          <AudienceCard
            theme="student"
            badge="For students"
            title="Turn your degree into momentum"
            desc="A living profile that grows with you — skills, certifications, and real projects, ready the moment a recruiter looks."
            items={[
              "Upload your resume, photo, and academic record",
              "Browse and filter jobs by location, type, and salary",
              "Track every application from one dashboard",
            ]}
            ctaLabel="Create student profile"
            ctaVariant="outline"
          />
          <AudienceCard
            id="recruiters"
            theme="recruiter"
            badge="For recruiters"
            title="Hire from the next graduating class"
            desc="Search verified student profiles by skill and university, then manage shortlists and listings from one place."
            items={[
              "Post jobs and internships in minutes",
              "Search candidates by skill, CGPA, or department",
              "Shortlist and manage applications in one pipeline",
            ]}
            ctaLabel="Post your first job"
            ctaVariant="primary"
          />
        </div>
      </div>
    </section>
  );
}
