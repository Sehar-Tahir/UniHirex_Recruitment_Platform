import React, { useState, useEffect, useMemo } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import ApplicationRow from "../../components/dashboard/student/ApplicationRow";
import { getMyApplications } from "../../api/applications";
import { useAuth } from "../../context/AuthContext";

const TABS = ["All", "Under Review", "Shortlisted", "Rejected"];

export default function MyApplicationsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications(token);
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return applications;
    return applications.filter((a) => a.status === activeTab);
  }, [applications, activeTab]);

  const countFor = (status) =>
    status === "All" ? applications.length : applications.filter((a) => a.status === status).length;

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        My Applications
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        Track the status of every job and internship you've applied to.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[12.5px] md:text-[13.5px] font-semibold transition-colors whitespace-nowrap"
              style={{
                ...fontBody,
                background: active ? COLORS.primary : "#F1F5F9",
                color: active ? "#fff" : COLORS.textMuted,
              }}
            >
              {tab} ({countFor(tab)})
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {loading ? (
          <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
            Loading...
          </p>
        ) : filtered.length > 0 ? (
          filtered.map((app) => (
            <ApplicationRow
              key={app._id}
              title={app.job?.title}
              company={app.job?.company}
              status={app.status}
              appliedOn={new Date(app.createdAt).toLocaleDateString()}
            />
          ))
        ) : (
          <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
            No applications with this status yet.
          </p>
        )}
      </div>
    </div>
  );
}