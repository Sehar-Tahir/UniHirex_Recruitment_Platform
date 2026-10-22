import React from "react";
import { COLORS, fontBody } from "../../theme";

export default function TestimonialCard({ quote, name, role }) {
  return (
    <div className="rounded-2xl p-7" style={{ background: COLORS.surfaceMuted }}>
      <p className="text-[14.5px] leading-relaxed mb-5" style={{ ...fontBody, color: COLORS.textDark }}>
        “{quote}”
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10.5 h-10.5 rounded-full shrink-0 flex items-center justify-center font-semibold text-white"
          style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary})` }}
        >
          {name?.[0]?.toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ ...fontBody, color: COLORS.textDark }}>
            {name}
          </div>
          <div className="text-[12.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}