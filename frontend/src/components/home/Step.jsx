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
    <div className="relative z-10 px-4 text-left">
      <div
        className="w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center font-bold text-xl mb-5"
        style={{ ...fontHead, ...circleStyle }}
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
