import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import ProfileCompletionCard from "../../components/dashboard/student/ProfileCompletionCard";
import JobCard from "../../components/dashboard/student/JobCard";
import ApplicationRow from "../../components/dashboard/student/ApplicationRow";
import NotificationItem from "../../components/dashboard/student/NotificationItem";
import {
  mockProfile,
  mockRecommendedJobs,
  mockRecommendedInternships,
  mockRecentApplications,
  mockNotifications,
} from "../../data/mockStudentData";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Welcome back, {user?.name || "Student"} 👋
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Here's what's happening with your job search today.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ProfileCompletionCard completion={mockProfile.completion} missing={mockProfile.missing} />

        <div className="lg:col-span-2 border border-[#ECEEF3] rounded-2xl p-6 bg-white">
          <h3 className="text-[16px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
            Notifications
          </h3>
          {mockNotifications.map((n) => (
            <NotificationItem key={n.id} {...n} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-[16px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
          Recommended Jobs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockRecommendedJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-[16px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
          Recommended Internships
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockRecommendedInternships.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <h3 className="text-[16px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
          Recent Applications
        </h3>
        {mockRecentApplications.map((app) => (
          <ApplicationRow key={app.id} {...app} />
        ))}
      </div>
    </div>
  );
}