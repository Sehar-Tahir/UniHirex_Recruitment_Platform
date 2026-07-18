import React, { useState, useEffect } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import ProfileHeaderCard from "../../components/dashboard/student/ProfileHeaderCard";
import SkillsCard from "../../components/dashboard/student/SkillsCard";
import ProjectsCard from "../../components/dashboard/student/ProjectsCard";
import CertificationsCard from "../../components/dashboard/student/CertificationsCard";
import ResumeCard from "../../components/dashboard/student/ResumeCard";
import { getMyProfile, updateMyProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export default function StudentProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const saveUpdate = async (updates) => {
    try {
      const updated = await updateMyProfile(updates, token);
      setProfile(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateField = (key) => (value) => saveUpdate({ [key]: value });

  if (loading) {
    return <p style={{ ...fontBody, color: COLORS.textMuted }}>Loading...</p>;
  }

  if (!profile) {
    return (
      <p style={{ color: "#DC2626" }}>
        {error || "Failed to load profile."}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        My Profile
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Keep your profile updated to get better job matches.
      </p>

      {error && (
        <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="flex flex-col gap-6">
        <ProfileHeaderCard profile={profile} onSave={saveUpdate} />
        <SkillsCard skills={profile.skills || []} onChange={updateField("skills")} />
        <ProjectsCard projects={profile.projects || []} onChange={updateField("projects")} />
        <CertificationsCard certifications={profile.certifications || []} onChange={updateField("certifications")} />
        <ResumeCard resumeUrl={profile.resumeUrl} onChange={updateField("resumeUrl")} />
      </div>
    </div>
  );
}