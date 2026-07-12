import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";

export default function SectionHead({ kicker, title, desc }) {
  return (
    <div className="max-w-160 mx-auto mb-14 text-center">
      <span
        className="font-bold text-[13px] tracking-wider uppercase block mb-3"
        style={{ ...fontBody, color: COLORS.accent }}
      >
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
