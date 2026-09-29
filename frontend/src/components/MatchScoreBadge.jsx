import React from "react";
import { COLORS, fontBody } from "../theme";

export default function MatchScoreBadge({ loading, score, explanation }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: "#F1F5F9" }}>
        <div
          className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: COLORS.textMuted, borderTopColor: "transparent" }}
        />
        <span className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          Calculating AI match...
        </span>
      </div>
    );
  }

  if (score === null || score === undefined) return null;

  const color = score >= 70 ? "#15803D" : score >= 40 ? "#B45309" : "#B91C1C";
  const bg = score >= 70 ? "#E7F7EE" : score >= 40 ? "#FFF6E5" : "#FBEAEA";

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: bg }}>
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0"
        style={{ background: color, color: "#fff" }}
      >
        {score}%
      </div>
      <div>
        <p className="text-[13px] font-semibold mb-0.5" style={{ ...fontBody, color }}>
          AI Match Score
        </p>
        <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textDark }}>
          {explanation}
        </p>
      </div>
    </div>
  );
}