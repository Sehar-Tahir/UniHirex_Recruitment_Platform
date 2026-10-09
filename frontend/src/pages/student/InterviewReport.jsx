import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getInterviewReport } from "../../api/interviews";
import { useAuth } from "../../context/AuthContext";

function ScoreBar({ label, value }) {
  const color = value >= 70 ? "#15803D" : value >= 40 ? "#B45309" : "#B91C1C";
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-[13px]" style={{ ...fontBody, color: COLORS.textDark }}>{label}</span>
        <span className="text-[13px] font-semibold" style={{ ...fontBody, color }}>{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function InterviewReport() {
  const { id } = useParams();
  const { token } = useAuth();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getInterviewReport(id, token);
        setInterview(data);
      } catch {
        setInterview(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, token]);

  if (loading) return <p style={{ ...fontBody, color: COLORS.textMuted }}>Loading report...</p>;
  if (!interview) return <p style={{ color: "#DC2626" }}>Report not found.</p>;

  return (
    <div className="max-w-170">
      <Link to="/student/interview-coach" className="text-[13.5px] font-semibold mb-6 inline-block" style={{ ...fontBody, color: COLORS.primary }}>
        ← Back to Interview Coach
      </Link>

      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Interview Report
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        {interview.role} · {interview.level} · {interview.type}
      </p>

      <div className="border border-[#ECEEF3] rounded-2xl p-7 bg-white mb-6 text-center">
        <p className="text-[13px] font-medium mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>Overall Score</p>
        <p className="text-[42px] font-bold" style={{ ...fontHead, color: COLORS.primary }}>
          {interview.overallScore ?? "—"}<span className="text-[20px]">/100</span>
        </p>
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-7 bg-white mb-6">
        <h3 className="text-[15px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>Category Breakdown</h3>
        <ScoreBar label="Technical Knowledge" value={interview.technicalScore ?? 0} />
        <ScoreBar label="Communication" value={interview.communicationScore ?? 0} />
        <ScoreBar label="Relevance" value={interview.relevanceScore ?? 0} />
        <ScoreBar label="Completeness" value={interview.completenessScore ?? 0} />
        <ScoreBar label="Confidence Indicator" value={interview.confidenceScore ?? 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
          <h3 className="text-[14px] font-semibold mb-3" style={{ ...fontHead, color: "#15803D" }}>Strengths</h3>
          <ul className="list-disc pl-5">
            {(interview.strengths || []).map((s, i) => (
              <li key={i} className="text-[13.5px] mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
          <h3 className="text-[14px] font-semibold mb-3" style={{ ...fontHead, color: "#B45309" }}>Areas to Improve</h3>
          <ul className="list-disc pl-5">
            {(interview.improvements || []).map((s, i) => (
              <li key={i} className="text-[13.5px] mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-6">
        <h3 className="text-[14px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>AI Recommendation</h3>
        <p className="text-[13.5px] leading-relaxed" style={{ ...fontBody, color: COLORS.textMuted }}>
          {interview.recommendation}
        </p>
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <h3 className="text-[15px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>Question by Question</h3>
        {interview.questions.map((q, i) => (
          <div key={i} className="mb-5 pb-5 border-b border-[#F1F3F9] last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-start justify-between mb-1.5">
              <p className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
                Q{i + 1}: {q.question}
              </p>
              {q.score !== undefined && (
                <span className="text-[12px] font-bold shrink-0 ml-3" style={{ ...fontBody, color: COLORS.primary }}>
                  {q.score}/10
                </span>
              )}
            </div>
            <p className="text-[13px] mb-1.5" style={{ ...fontBody, color: COLORS.textMuted }}>{q.answer}</p>
            {q.feedback && (
              <p className="text-[12.5px] italic" style={{ ...fontBody, color: COLORS.accent }}>{q.feedback}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}