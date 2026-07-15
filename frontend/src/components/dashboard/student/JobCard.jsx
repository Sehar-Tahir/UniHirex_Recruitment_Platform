import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function JobCard({ id, title, company, location, type, saved, onToggleSave }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => id && navigate(`/student/jobs/${id}`)}
      className="border border-[#ECEEF3] rounded-2xl p-5 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-14px_rgba(35,64,184,0.18)] cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-[15px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          {title}
        </h4>
        <div className="flex items-center gap-2">
          <span
            className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
            style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
          >
            {type}
          </span>
          {onToggleSave && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(id); }}
              className="text-[16px]"
              style={{ color: saved ? COLORS.accent : "#CBD5E1" }}
              title={saved ? "Unsave" : "Save job"}
            >
              ★
            </button>
          )}
        </div>
      </div>
      <p className="text-[14px] mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
        {company}
      </p>
      <p className="text-[13px] mb-4" style={{ ...fontBody, color: COLORS.textMuted }}>
        {location}
      </p>
      <span className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
        View details →
      </span>
    </div>
  );
}