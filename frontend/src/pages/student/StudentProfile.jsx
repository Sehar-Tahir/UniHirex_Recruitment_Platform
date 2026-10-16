import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../theme";
import ProfileHeaderCard from "../../components/dashboard/student/ProfileHeaderCard";
import LinksCard from "../../components/dashboard/student/LinksCard";
import SkillsCard from "../../components/dashboard/student/SkillsCard";
import ProjectsCard from "../../components/dashboard/student/ProjectsCard";
import CertificationsCard from "../../components/dashboard/student/CertificationsCard";
import ResumeCard from "../../components/dashboard/student/ResumeCard";
import { getMyProfile, updateMyProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export default function StudentProfile() {
  const { token, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getMyProfile(token)
      .then(setProfile)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Returns true if the save worked, false if it failed
  const saveUpdate = async (updates) => {
    try {
      const updated = await updateMyProfile(updates, token);
      setProfile(updated);
      updateUser({ name: updated.name, photoUrl: updated.photoUrl });
      toast.success("Profile updated successfully!");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const updateField = (key) => (value) => saveUpdate({ [key]: value });

  if (loading) {
    return <p style={{ ...fontBody, color: COLORS.textMuted }}>Loading...</p>;
  }

  if (!profile) {
    return <p style={{ color: "#DC2626" }}>{loadError || "Failed to load profile."}</p>;
  }

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        My Profile
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Keep your profile updated to get better job matches.
      </p>

      <ProfileHeaderCard profile={profile} onSave={saveUpdate} />
      <LinksCard profile={profile} onSave={saveUpdate} />
      <SkillsCard skills={profile.skills || []} onChange={updateField("skills")} />
      <ProjectsCard projects={profile.projects || []} onChange={updateField("projects")} />
      <CertificationsCard certifications={profile.certifications || []} onChange={updateField("certifications")} />
      <ResumeCard resumeUrl={profile.resumeUrl} onChange={updateField("resumeUrl")} />
    </div>
  );
}