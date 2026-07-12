import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";

const STATS = [
  ["10K", "+", "Active students"],
  ["2K", "+", "Hiring companies"],
  ["5K", "+", "Live opportunities"],
  ["98", "%", "Satisfaction rate"],
];

export default function StatsBand() {
  return (
    <section className="py-16" style={{ background: COLORS.textDark }}>
      <div className="max-w-295 mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(([num, suffix, label]) => (
          <div key={label}>
            <div className="text-3xl md:text-[38px] font-bold text-white" style={fontHead}>
              {num}
              <span style={{ color: COLORS.accentLight }}>{suffix}</span>
            </div>
            <div className="text-sm mt-1.5" style={{ ...fontBody, color: "#9AA5BD" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
