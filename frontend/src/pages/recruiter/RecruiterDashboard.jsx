import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/recruiter/StatCard";
import ApplicantMiniRow from "../../components/dashboard/recruiter/ApplicantMiniRow";
import { mockRecruiterStats, mockRecentApplicants } from "../../data/mockRecruiterData";

export default function RecruiterDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Welcome back, {user?.name || "Recruiter"} 👋
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Here's how your listings are performing.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Active Listings" value={mockRecruiterStats.activeListings} />
        <StatCard label="Total Applicants" value={mockRecruiterStats.totalApplicants} />
        <StatCard label="Shortlisted" value={mockRecruiterStats.shortlisted} accent />
        <StatCard label="New This Week" value={mockRecruiterStats.newThisWeek} />
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <h3 className="text-[16px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
          Recent Applicants
        </h3>
        {mockRecentApplicants.map((a) => (
          <ApplicantMiniRow key={a.id} {...a} />
        ))}
      </div>
    </div>
  );
}