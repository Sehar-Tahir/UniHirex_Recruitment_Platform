import React, { useState, useEffect } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import ProfileCompletionCard from "../../components/dashboard/student/ProfileCompletionCard";
import JobCard from "../../components/dashboard/student/JobCard";
import ApplicationRow from "../../components/dashboard/student/ApplicationRow";
import NotificationItem from "../../components/dashboard/student/NotificationItem";
import { getMyProfile } from "../../api/users";
import { getRecommendedJobs } from "../../api/jobs";
import { getMyApplications } from "../../api/applications";
import { getMyNotifications } from "../../api/notifications";

export default function StudentDashboard() {
  const { user, token } = useAuth();
 const [profile, setProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileData, jobsData, applicationsData, notificationsData] = await Promise.all([
          getMyProfile(token),
          getRecommendedJobs(),
          getMyApplications(token),
          getMyNotifications(token),
        ]);
        setProfile(profileData);
        setRecommendedJobs(jobsData);
        setRecentApplications(applicationsData.slice(0, 3));
        setNotifications(notificationsData.slice(0, 4));
      } catch {
        // dashboard widgets fail gracefully — page still renders with what succeeded
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Welcome back, {user?.name || "Student"} 👋
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Here's what's happening with your job search today.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {!loading && profile && (
          <ProfileCompletionCard completion={profile.profileCompletion} missing={profile.profileMissing} />
        )}

        <div className="lg:col-span-2 border border-[#ECEEF3] rounded-2xl p-6 bg-white">
          <h3 className="text-[16px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
            Notifications
          </h3>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationItem key={n._id} text={n.text} time={new Date(n.createdAt).toLocaleDateString()} />
            ))
          ) : (
            !loading && (
              <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                No notifications yet.
              </p>
            )
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-[16px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
          Recommended Jobs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedJobs.map((job) => (
            <JobCard key={job._id} id={job._id} title={job.title} company={job.company} location={job.location} type={job.type} />
          ))}
        </div>
        {!loading && recommendedJobs.length === 0 && (
          <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            No open listings right now - check back soon.
          </p>
        )}
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <h3 className="text-[16px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
          Recent Applications
        </h3>
        {recentApplications.length > 0 ? (
          recentApplications.map((app) => (
            <ApplicationRow
              key={app._id}
              title={app.job?.title}
              company={app.job?.company}
              status={app.status}
              appliedOn={new Date(app.createdAt).toLocaleDateString()}
            />
          ))
        ) : (
          !loading && (
            <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
              No applications yet - start browsing jobs to apply.
            </p>
          )
        )}
      </div>
    </div>
  );
}