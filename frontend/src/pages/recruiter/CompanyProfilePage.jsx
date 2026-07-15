import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import CompanyProfileCard from "../../components/dashboard/recruiter/CompanyProfileCard";
import { mockCompany } from "../../data/mockRecruiterData";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState(mockCompany);

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Company Profile
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        This information is shown to students on your job listings.
      </p>

      <div className="max-w-[640px]">
        <CompanyProfileCard company={company} onSave={(updated) => setCompany({ ...company, ...updated })} />
      </div>
    </div>
  );
}