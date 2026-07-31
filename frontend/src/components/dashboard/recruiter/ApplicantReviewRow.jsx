import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../../theme";

const STATUS_STYLES = {
  "Under Review": { bg: "#FFF6E5", color: "#B45309" },
  "Shortlisted": { bg: "#E7F7EE", color: "#15803D" },
  "Rejected": { bg: "#FBEAEA", color: "#B91C1C" },
};

export default function ApplicantReviewRow({ id, studentId, studentName, photoUrl, university, cgpa, appliedOn, status, onUpdateStatus }) {
  const navigate = useNavigate();
  const style = STATUS_STYLES[status] || { bg: "#F1F5F9", color: COLORS.textMuted };

  return (
    <div className="flex flex-wrap items-center gap-3 justify-between gap-y-2 gap-x-4 py-4 border-b border-[#F1F3F9] last:border-0">
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
        <button
          onClick={() => navigate(`/recruiter/candidates/${studentId}`)}
          className="text-[13px] font-semibold"
          style={{ ...fontBody, color: COLORS.primary }}
        >
          View Profile →
        </button>
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
  );
}