import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getMyInterviews } from "../../api/interviews";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../../components/Pagination";

function scoreColor(score) {
  return score >= 70 ? "#15803D" : score >= 40 ? "#B45309" : "#B91C1C";
}

export default function InterviewHistory() {
  const { token } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [recentScores, setRecentScores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const result = await getMyInterviews(page, token);
        setInterviews(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
        setRecentScores(result.recentScores || []);
      } catch {
        // fails gracefully — page just shows the empty state
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page, token]);

  const change =
    recentScores.length >= 2
      ? recentScores[recentScores.length - 1].score - recentScores[0].score
      : null;

  return (
    <div className="max-w-170">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          Interview History
        </h1>
        <Link
          to="/student/interview-coach"
          className="px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          + New Interview
        </Link>
      </div>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Loading..." : `${total} completed interview${total === 1 ? "" : "s"}`}
      </p>

      {recentScores.length >= 2 && (
        <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
              Your Progress
            </h3>
            <span
              className="text-[13px] font-semibold"
              style={{ ...fontBody, color: change >= 0 ? "#15803D" : "#B91C1C" }}
            >
              {change >= 0 ? "+" : ""}{change} points over your last {recentScores.length} interviews
            </span>
          </div>
          <div className="flex items-end gap-3 h-28">
            {recentScores.map((r, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[12px] font-semibold mb-1" style={{ ...fontBody, color: scoreColor(r.score) }}>
                  {r.score}
                </span>
                <div
                  className="w-full rounded-t-md"
                  style={{ height: `${Math.max(r.score, 4)}%`, background: scoreColor(r.score), opacity: 0.85 }}
                />
                <span className="text-[11px] mt-1" style={{ ...fontBody, color: COLORS.textMuted }}>
                  {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {interviews.length > 0 ? (
          interviews.map((i) => (
            <div
              key={i._id}
              className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-[#F1F3F9] last:border-0"
            >
              <div>
                <p className="text-[14.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.textDark }}>
                  {i.role}
                </p>
                <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                  {i.level} · {i.type} · {new Date(i.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {i.overallScore != null && (
                  <span className="text-[15px] font-bold" style={{ ...fontHead, color: scoreColor(i.overallScore) }}>
                    {i.overallScore}%
                  </span>
                )}
                <Link
                  to={`/student/interview-report/${i._id}`}
                  className="text-[13px] font-semibold"
                  style={{ ...fontBody, color: COLORS.primary }}
                >
                  View Report →
                </Link>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="text-center py-10">
              <p className="text-[14px] mb-4" style={{ ...fontBody, color: COLORS.textMuted }}>
                You haven't completed any interviews yet.
              </p>
              <Link
                to="/student/interview-coach"
                className="inline-block px-5 py-2.5 rounded-lg font-semibold text-[13.5px] text-white"
                style={{ ...fontBody, background: COLORS.accent }}
              >
                Start your first interview
              </Link>
            </div>
          )
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}