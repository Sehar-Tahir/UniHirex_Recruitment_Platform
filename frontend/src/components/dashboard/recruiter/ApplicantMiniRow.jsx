import React from "react";
import { COLORS, fontBody } from "../../../theme";

const STATUS_STYLES = {
  "Under Review": { bg: "#FFF6E5", color: "#B45309" },
  "Shortlisted": { bg: "#E7F7EE", color: "#15803D" },
  "Rejected": { bg: "#FBEAEA", color: "#B91C1C" },
};

export default function ApplicantMiniRow({ studentName, jobTitle, appliedOn, status }) {
  const style = STATUS_STYLES[status] || { bg: "#F1F5F9", color: COLORS.textMuted };

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 py-3.5 border-b border-[#F1F3F9] last:border-0">
      <div>
        <p className="text-[14.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
          {studentName}
        </p>
        <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          Applied to {jobTitle} · {appliedOn}
        </p>
      </div>
      <span
        className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
        style={{ ...fontBody, background: style.bg, color: style.color }}
      >
        {status}
      </span>
    </div>
  );
}