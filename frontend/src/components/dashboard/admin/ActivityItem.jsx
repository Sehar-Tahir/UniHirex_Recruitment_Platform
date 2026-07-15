import React from "react";
import { COLORS, fontBody } from "../../../theme";

export default function ActivityItem({ text, time }) {
  return (
    <div className="flex gap-3 py-3 border-b border-[#F1F3F9] last:border-0">
      <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: COLORS.accent }} />
      <div>
        <p className="text-[13.5px] leading-snug" style={{ ...fontBody, color: COLORS.textDark }}>
          {text}
        </p>
        <p className="text-[12px] mt-0.5" style={{ ...fontBody, color: COLORS.textMuted }}>
          {time}
        </p>
      </div>
    </div>
  );
}