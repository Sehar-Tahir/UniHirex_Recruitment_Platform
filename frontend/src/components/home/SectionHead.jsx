import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";

export default function SectionHead({ kicker, title, desc }) {
  return (
    <div className="max-w-160 mx-auto mb-14 text-center">
      <span
        className="inline-flex items-center gap-2 font-medium text-[12px] tracking-wider uppercase mb-3"
        style={{ ...fontBody, color: COLORS.accent }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.accent }} />
        {kicker}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold mb-3.5 leading-snug" style={{ ...fontHead, color: COLORS.textDark }}>
        {title}
      </h2>
      {desc && (
        <p className="text-base leading-relaxed" style={{ ...fontBody, color: COLORS.textMuted }}>
          {desc}
        </p>
      )}
    </div>
  );
}
