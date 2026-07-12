import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import ProfileHeaderCard from "../../components/dashboard/student/ProfileHeaderCard";
import SkillsCard from "../../components/dashboard/student/SkillsCard";
import ProjectsCard from "../../components/dashboard/student/ProjectsCard";
import CertificationsCard from "../../components/dashboard/student/CertificationsCard";
import ResumeCard from "../../components/dashboard/student/ResumeCard";
import { mockStudentProfile } from "../../data/mockStudentProfile";

export default function StudentProfile() {
  const [profile, setProfile] = useState(mockStudentProfile);

  const updateField = (key) => (value) => setProfile({ ...profile, [key]: value });

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        My Profile
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Keep your profile updated to get better job matches.
      </p>

      <div className="flex flex-col gap-6">
        <ProfileHeaderCard profile={profile} onSave={(updated) => setProfile({ ...profile, ...updated })} />
        <SkillsCard skills={profile.skills} onChange={updateField("skills")} />
        <ProjectsCard projects={profile.projects} onChange={updateField("projects")} />
        <CertificationsCard certifications={profile.certifications} onChange={updateField("certifications")} />
        <ResumeCard resumeUrl={profile.resumeUrl} onChange={updateField("resumeUrl")} />
      </div>
    </div>
  );
}