import React, { useState, useEffect } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import AdminStatCard from "../../components/dashboard/admin/AdminStatCard";
import ActivityItem from "../../components/dashboard/admin/ActivityItem";
import { getAdminStats } from "../../api/admin";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats(token);
        setStats(data);
      } catch {
        // dashboard fails gracefully — page still renders without stats
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Welcome back, {user?.name || "Admin"} 👋
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Platform overview and activity.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <AdminStatCard label="Total Students" value={loading ? "—" : stats?.totalStudents ?? 0} />
        <AdminStatCard label="Total Recruiters" value={loading ? "—" : stats?.totalRecruiters ?? 0} />
        <AdminStatCard label="Total Listings" value={loading ? "—" : stats?.totalListings ?? 0} />
        <AdminStatCard label="Total Applications" value={loading ? "—" : stats?.totalApplications ?? 0} />
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <h3 className="text-[16px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
          Recent Activity
        </h3>
        {stats?.activity?.length > 0 ? (
          stats.activity.map((a) => <ActivityItem key={a.id} text={a.text} time={timeAgo(a.time)} />)
        ) : (
          !loading && (
            <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
              No recent activity yet.
            </p>
          )
        )}
      </div>
    </div>
  );
}