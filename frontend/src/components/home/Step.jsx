import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";

export default function Step({ number, title, desc, accent }) {
  const circleStyle =
    accent === "filled"
      ? { background: COLORS.accent, borderColor: COLORS.accent, color: "#fff" }
      : accent === "burgundy"
      ? { borderColor: COLORS.accent, color: COLORS.accent }
      : { borderColor: COLORS.primary, color: COLORS.primary };

  return (
    <div className="relative z-10 px-4 text-left group cursor-default">
      <div
        className="w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center font-bold text-xl mb-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_-6px_var(--glow)]"
        style={{ ...fontHead, ...circleStyle, "--glow": accent === "burgundy" || accent === "filled" ? "rgba(122,18,69,0.35)" : "rgba(35,64,184,0.35)" }}
      >
        {number}
      </div>
      <h4 className="text-[17px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
        {title}
      </h4>
      <p className="text-[14.5px] leading-relaxed" style={{ ...fontBody, color: COLORS.textMuted }}>
        {desc}
      </p>
    </div>
  );
}