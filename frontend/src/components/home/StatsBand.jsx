import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import LiveCounter from "./LiveCounter";

const STATS = [
  { value: 700, suffix: "+", label: "Active students" },
  { value: 48, suffix: "+", label: "Hiring companies" },
  { value: 200, suffix: "+", label: "Live opportunities" },
  { value: 98, suffix: "%", label: "Satisfaction rate" },
];

export default function StatsBand() {
  return (
    <section className="py-16" style={{ background: COLORS.textDark }}>
      <div className="max-w-295 mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-3xl md:text-[38px] font-bold text-white" style={fontHead}>
              <LiveCounter target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm mt-1.5" style={{ ...fontBody, color: "#9AA5BD" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
