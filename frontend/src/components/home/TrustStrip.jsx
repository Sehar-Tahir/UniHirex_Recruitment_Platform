import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";

const COMPANIES = ["NovaTech", "BrightPath", "Vector Labs", "Northbridge", "Skyline Co."];

export default function TrustStrip() {
  return (
    <div className="border-b border-[#EEF0F4] py-8">
      <div className="max-w-[1180px] mx-auto px-5 md:px-8 flex items-center justify-between flex-wrap gap-5">
        <span
          className="text-[13px] font-semibold tracking-wide uppercase"
          style={{ ...fontBody, color: COLORS.gray }}
        >
          Trusted by recruiters from
        </span>
        <div
          className="flex gap-8 items-center flex-wrap opacity-55 font-bold text-base"
          style={{ ...fontHead, color: COLORS.ink }}
        >
          {COMPANIES.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
