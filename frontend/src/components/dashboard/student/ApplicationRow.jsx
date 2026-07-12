import React from "react";
import { COLORS, fontBody } from "../../../theme";

const STATUS_STYLES = {
  "Under Review": { bg: "#FFF6E5", color: "#B45309" },
  "Shortlisted": { bg: "#E7F7EE", color: "#15803D" },
  "Rejected": { bg: "#FBEAEA", color: "#B91C1C" },
};

export default function ApplicationRow({ title, company, status, appliedOn }) {
  const style = STATUS_STYLES[status] || { bg: "#F1F5F9", color: COLORS.textMuted };

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#F1F3F9] last:border-0">
      <div>
        <p className="text-[14.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
          {title}
        </p>
        <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          {company} · Applied {appliedOn}
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