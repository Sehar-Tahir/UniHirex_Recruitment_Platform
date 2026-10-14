import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getMyResumeAnalyses } from "../../api/resumeAnalysis";
import { useAuth } from "../../context/AuthContext";
import { scoreColor } from "../../utils/scoreColor";
import Pagination from "../../components/Pagination";
import { Card } from "../../components/resume/ResumeReport";

export default function ResumeHistory() {
  const { token } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [recentScores, setRecentScores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const result = await getMyResumeAnalyses(page, token);
        setAnalyses(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
        setRecentScores(result.recentScores || []);
      } catch {
        // fails gracefully — the page just shows the empty state
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page, token]);

  const change =
    recentScores.length >= 2 ? recentScores[recentScores.length - 1].score - recentScores[0].score : null;

  return (
    <div className="max-w-170">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          Resume History
        </h1>
        <Link
          to="/student/resume-analyzer"
          className="px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          + New Analysis
        </Link>
      </div>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Loading..." : `${total} saved analys${total === 1 ? "is" : "es"}`}
      </p>

      {recentScores.length >= 2 && (
        <Card title="Your Progress">
          <p className="text-[13px] mb-4" style={{ ...fontBody, color: change >= 0 ? "#15803D" : "#B91C1C" }}>
            {change >= 0 ? "+" : ""}{change} points across your last {recentScores.length} analyses. Each new resume
            file you upload counts as a new version.
          </p>
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
                  {r.version ? `v${r.version} · ` : ""}
                  {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {analyses.length > 0 ? (
          analyses.map((a) => (
            <div
              key={a._id}
              className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-[#F1F3F9] last:border-0"
            >
              <div>
                <p className="text-[14.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.textDark }}>
                  {a.targetRole || "General review"}
                  {a.version ? (
                    <span className="ml-2 text-[11.5px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
                      v{a.version}
                    </span>
                  ) : null}
                </p>
                <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                  {new Date(a.createdAt).toLocaleDateString()}
                  {a.hadJobDescription ? " · Matched to a job description" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[15px] font-bold" style={{ ...fontHead, color: scoreColor(a.overallScore) }}>
                  {a.overallScore}%
                </span>
                <Link
                  to={`/student/resume-analysis/${a._id}`}
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
                You haven't analyzed a resume yet.
              </p>
              <Link
                to="/student/resume-analyzer"
                className="inline-block px-5 py-2.5 rounded-lg font-semibold text-[13.5px] text-white"
                style={{ ...fontBody, background: COLORS.accent }}
              >
                Analyze your resume
              </Link>
            </div>
          )
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}