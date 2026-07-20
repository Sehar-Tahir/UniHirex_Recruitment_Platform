import React, { useState, useEffect } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/recruiter/StatCard";
import ApplicantMiniRow from "../../components/dashboard/recruiter/ApplicantMiniRow";
import { getRecruiterStats } from "../../api/jobs";

export default function RecruiterDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getRecruiterStats(token);
        setStats(data);
      } catch {
        // dashboard fails gracefully - page still renders without stats
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Welcome back, {user?.name || "Recruiter"} 👋
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Here's how your listings are performing.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Active Listings" value={loading ? "—" : stats?.activeListings ?? 0} />
        <StatCard label="Total Applicants" value={loading ? "—" : stats?.totalApplicants ?? 0} />
        <StatCard label="Shortlisted" value={loading ? "—" : stats?.shortlisted ?? 0} accent />
        <StatCard label="New This Week" value={loading ? "—" : stats?.newThisWeek ?? 0} />
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <h3 className="text-[16px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
          Recent Applicants
        </h3>
        {stats?.recentApplicants?.length > 0 ? (
          stats.recentApplicants.map((a) => (
            <ApplicantMiniRow
              key={a._id}
              studentName={a.student?.name}
              jobTitle={a.job?.title}
              appliedOn={new Date(a.createdAt).toLocaleDateString()}
              status={a.status}
            />
          ))
        ) : (
          !loading && (
            <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
              No applicants yet.
            </p>
          )
        )}
      </div>
    </div>
  );
}