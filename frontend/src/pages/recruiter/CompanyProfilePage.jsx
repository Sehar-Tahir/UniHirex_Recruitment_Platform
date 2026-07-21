import React, { useState, useEffect } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import toast from "react-hot-toast";
import CompanyProfileCard from "../../components/dashboard/recruiter/CompanyProfileCard";
import { getMyProfile, updateMyProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export default function CompanyProfilePage() {
  const { token, updateUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(token);
        setCompany({
          name: data.companyName,
          industry: data.industry,
          website: data.website,
          logoUrl: data.logoUrl,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async (updated) => {
    try {
      await updateMyProfile(
        {
          companyName: updated.name,
          industry: updated.industry,
          website: updated.website,
          logoUrl: updated.logoUrl,
        },
        token
      );
      setCompany(updated);
      updateUser({ companyName: updated.name, logoUrl: updated.logoUrl });
      toast.success("Company profile updated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  if (loading) {
    return <p style={{ ...fontBody, color: COLORS.textMuted }}>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Company Profile
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        This information is shown to students on your job listings.
      </p>

      {error && (
        <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="max-w-160">
        {company && <CompanyProfileCard company={company} onSave={handleSave} />}
      </div>
    </div>
  );
}