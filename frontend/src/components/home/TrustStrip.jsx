

import React from "react";
import { COLORS, fontBody } from "../../theme";

const ITEMS = [
  "AI Interview Coach",
  "AI Resume Analyzer",
  "AI Job Fit Score",
  "Multiple resumes",
  "Resume Analysis",
  "Interview Practice",
  "Smart applications",
  "Interview invitations",
  "Candidate search",
  "Application tracking",
];

export default function TrustStrip() {
  const loopItems = [...ITEMS, ...ITEMS];

  return (
    <div className="border-b border-[#EEF0F4] py-7 overflow-hidden">
      <div className="max-w-295 mx-auto px-5 md:px-8 flex items-center gap-8">
        <span
          className="text-[12px] font-medium tracking-wider uppercase whitespace-nowrap shrink-0"
          style={{ ...fontBody, color: COLORS.textMuted }}
        >
          Inside UniHirex
        </span>

        <div
          className="relative flex-1 overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
        >
          <div className="flex gap-12 w-max marquee-track">
            {loopItems.map((item, i) => (
              <span
                key={i}
                className="font-semibold text-[15px] opacity-60 whitespace-nowrap"
                style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.textDark }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-track { animation: marquee 32s linear infinite; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}