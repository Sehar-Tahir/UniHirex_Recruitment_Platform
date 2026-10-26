import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../../theme";
import Avatar from "../../Avatar";

export default function ApplicantReviewRow({ id, studentName, photoUrl, university, cgpa, appliedOn }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-[#F1F3F9] last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar name={studentName} photoUrl={photoUrl} sizeClass="w-10 h-10" textClass="text-[13px]" />
        <div className="min-w-0">
          <p className="text-[14.5px] font-semibold truncate" style={{ ...fontBody, color: COLORS.textDark }}>
            {studentName}
          </p>
          <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            {university || "University not set"} · CGPA {cgpa || "—"} · Applied {appliedOn}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/recruiter/applications/${id}`)}
        className="px-4 py-2 rounded-lg font-semibold text-[13px] border-2 whitespace-nowrap"
        style={{ ...fontBody, color: COLORS.primary, borderColor: COLORS.primary }}
      >
        View Application →
      </button>
    </div>
  );
}