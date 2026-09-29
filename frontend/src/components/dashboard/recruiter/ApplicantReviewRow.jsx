import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../../theme";
import { getCandidateMatchScore } from "../../../api/applications";
import { useAuth } from "../../../context/AuthContext";
import MatchScoreBadge from "../../MatchScoreBadge";

const STATUS_STYLES = {
  "Under Review": { bg: "#FFF6E5", color: "#B45309" },
  "Shortlisted": { bg: "#E7F7EE", color: "#15803D" },
  "Rejected": { bg: "#FBEAEA", color: "#B91C1C" },
};

export default function ApplicantReviewRow({ id, studentId, studentName, photoUrl, university, cgpa, appliedOn, status, onUpdateStatus }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const style = STATUS_STYLES[status] || { bg: "#F1F5F9", color: COLORS.textMuted };

  const [matchChecked, setMatchChecked] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [matchExplanation, setMatchExplanation] = useState("");

  const handleCheckMatch = async () => {
    setMatchChecked(true);
    setMatchLoading(true);
    try {
      const result = await getCandidateMatchScore(id, token);
      setMatchScore(result.matchScore);
      setMatchExplanation(result.explanation);
    } catch {
      setMatchExplanation("Unable to compute match score right now.");
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-[#F1F3F9] last:border-0">
      <div className="flex flex-wrap items-center gap-3 justify-between gap-y-2 gap-x-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-[13px] shrink-0 overflow-hidden"
            style={{ background: COLORS.primary }}
          >
            {photoUrl ? (
              <img src={photoUrl} alt={studentName} className="w-full h-full object-cover" />
            ) : (
              studentName?.[0]?.toUpperCase() || "S"
            )}
          </div>
          <div>
            <p className="text-[14.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.textDark }}>
              {studentName}
            </p>
            <p className="text-[13px] mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
              {university || "University not set"} · CGPA {cgpa || "—"} · Applied {appliedOn}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/recruiter/candidates/${studentId}`)}
                className="text-[13px] font-semibold"
                style={{ ...fontBody, color: COLORS.primary }}
              >
                View Profile →
              </button>
              {!matchChecked && (
                <button
                  onClick={handleCheckMatch}
                  className="text-[13px] font-semibold"
                  style={{ ...fontBody, color: COLORS.accent }}
                >
                  ✨ Check AI Match →
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{ ...fontBody, background: style.bg, color: style.color }}
          >
            {status}
          </span>

          {status !== "Shortlisted" && (
            <button
              onClick={() => onUpdateStatus(id, "Shortlisted")}
              className="text-[13px] font-semibold"
              style={{ ...fontBody, color: COLORS.primary }}
            >
              Shortlist
            </button>
          )}
          {status !== "Rejected" && (
            <button
              onClick={() => onUpdateStatus(id, "Rejected")}
              className="text-[13px] font-semibold"
              style={{ ...fontBody, color: "#B91C1C" }}
            >
              Reject
            </button>
          )}
        </div>
      </div>

      {matchChecked && (
        <MatchScoreBadge loading={matchLoading} score={matchScore} explanation={matchExplanation} />
      )}
    </div>
  );
}