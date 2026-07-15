import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { useSavedCandidates } from "../../../hooks/useSavedCandidates";

export default function CandidateCard({ id, name, university, department, skills, cgpa }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedCandidates();
  const saved = isSaved(id);

  return (
    <div
      onClick={() => navigate(`/recruiter/candidates/${id}`)}
      className="border border-[#ECEEF3] rounded-2xl p-5 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-14px_rgba(35,64,184,0.18)] cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white shrink-0"
            style={{ background: COLORS.primary }}
          >
            {name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h4 className="text-[14.5px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
              {name}
            </h4>
            <p className="text-[12.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
              {department} · {university}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSave(id); }}
          className="text-[18px] shrink-0"
          style={{ color: saved ? COLORS.accent : "#CBD5E1" }}
          title={saved ? "Unsave" : "Save candidate"}
        >
          ★
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {skills.map((s) => (
          <span
            key={s}
            className="text-[11.5px] font-medium px-2.5 py-1 rounded-full"
            style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          CGPA: <strong style={{ color: COLORS.textDark }}>{cgpa}</strong>
        </span>
        <span className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
          View Profile →
        </span>
      </div>
    </div>
  );
}