import React from "react";
import { COLORS, fontBody } from "../../theme";

export default function TestimonialCard({ quote, name, role, avatarGradient }) {
  return (
    <div className="rounded-2xl p-7" style={{ background: COLORS.surfaceMuted }}>
      <div className="text-sm mb-3.5 tracking-widest" style={{ color: "#F5A623" }}>
        ★★★★★
      </div>
      <p className="text-[14.5px] leading-relaxed mb-5" style={{ ...fontBody, color: COLORS.textDark }}>
        {quote}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10.5 h-10.5 rounded-full shrink-0" style={{ background: avatarGradient }} />
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
