import React, { useState, useEffect } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import ApplicationRow from "../../components/dashboard/student/ApplicationRow";
import { getMyApplications } from "../../api/applications";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../../components/Pagination";

const TABS = ["All", "Under Review", "Shortlisted", "Rejected"];

export default function MyApplicationsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const result = await getMyApplications({ status: activeTab, page }, token);
        setApplications(result.data);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token, activeTab, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

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
              {tab}
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
        ) : applications.length > 0 ? (
          applications.map((app) => (
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}