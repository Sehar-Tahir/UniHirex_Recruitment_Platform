import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import AdminStatCard from "../../components/dashboard/admin/AdminStatCard";
import ActivityItem from "../../components/dashboard/admin/ActivityItem";
import { mockAdminStats, mockRecentActivity } from "../../data/mockAdminData";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Welcome back, {user?.name || "Admin"} 👋
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Platform overview and activity.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <AdminStatCard label="Total Students" value={mockAdminStats.totalStudents} />
        <AdminStatCard label="Total Recruiters" value={mockAdminStats.totalRecruiters} />
        <AdminStatCard label="Total Listings" value={mockAdminStats.totalListings} />
        <AdminStatCard label="Total Applications" value={mockAdminStats.totalApplications} />
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <h3 className="text-[16px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
          Recent Activity
        </h3>
        {mockRecentActivity.map((a) => (
          <ActivityItem key={a.id} {...a} />
        ))}
      </div>
    </div>
  );
}