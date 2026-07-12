import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";

const THEMES = {
  blue: { bg: "#EEF1FC", color: COLORS.blue },
  burgundy: { bg: "#F8ECF1", color: COLORS.burgundy },
  blueSoft: { bg: "#EEF1FC", color: COLORS.blueSoft },
};

export default function FeatureTile({ icon, title, desc, theme }) {
  const t = THEMES[theme];
  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgba(35,64,184,0.18)] hover:border-[#DCE3F7]">
      <div
        className="w-[46px] h-[46px] rounded-xl flex items-center justify-center mb-5"
        style={{ background: t.bg, color: t.color }}
      >
        {icon}
      </div>
      <h4 className="text-[17px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.ink }}>
        {title}
      </h4>
      <p className="text-[14.5px] leading-relaxed" style={{ ...fontBody, color: COLORS.gray }}>
        {desc}
      </p>
    </div>
  );
}
