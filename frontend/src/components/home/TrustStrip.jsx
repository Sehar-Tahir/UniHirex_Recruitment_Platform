import React from "react";
import { COLORS, fontBody } from "../../theme";

const COMPANIES = ["NovaTech", "BrightPath", "Vector Labs", "Northbridge", "Skyline Co.", "ByteForge", "PixelWorks"];

export default function TrustStrip() {
  const loopItems = [...COMPANIES, ...COMPANIES];

  return (
    <div className="border-b border-[#EEF0F4] py-7 overflow-hidden">
      <div className="max-w-295 mx-auto px-5 md:px-8 flex items-center gap-8">
        <span
          className="text-[12px] font-medium tracking-wider uppercase whitespace-nowrap shrink-0"
          style={{ ...fontBody, color: COLORS.textMuted }}
        >
          Live on the platform
        </span>

        <div className="relative flex-1 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div className="flex gap-12 w-max animate-[marquee_22s_linear_infinite]">
            {loopItems.map((c, i) => (
              <span
                key={i}
                className="font-bold text-base opacity-50 whitespace-nowrap"
                style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.textDark }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[marquee_22s_linear_infinite\\] { animation: none; }
        }
      `}</style>
    </div>
  );
}