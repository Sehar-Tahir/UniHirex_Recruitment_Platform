import React from "react";
import { COLORS, fontBody } from "../../theme";

export default function TestimonialCard({ quote, name, role, avatarGradient }) {
  return (
    <div className="rounded-2xl p-7" style={{ background: COLORS.light }}>
      <div className="text-sm mb-3.5 tracking-widest" style={{ color: "#F5A623" }}>
        ★★★★★
      </div>
      <p className="text-[14.5px] leading-relaxed mb-5" style={{ ...fontBody, color: COLORS.ink }}>
        {quote}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-[42px] h-[42px] rounded-full flex-shrink-0" style={{ background: avatarGradient }} />
        <div>
          <div className="font-semibold text-sm" style={{ ...fontBody, color: COLORS.ink }}>
            {name}
          </div>
          <div className="text-[12.5px]" style={{ ...fontBody, color: COLORS.gray }}>
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}
