import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import NodeGraph from "./NodeGraph";
import { icons } from "./icons";

const HIGHLIGHTS = [
  { icon: icons.mic, label: "AI Interview Coach", note: "Practice out loud, get a scored report" },
  { icon: icons.resume, label: "AI Resume Analyzer", note: "Score, ATS check and rewrites" },
  { icon: icons.sparkle, label: "AI Job Fit Score", note: "Know your match before you apply" },
  { icon: icons.shield, label: "Smart Applications", note: "You choose what recruiters see" },
];

export default function Hero() {
  return (
    <header className="relative overflow-hidden text-white" style={{ background: "#0A0E27" }}>
      <NodeGraph className="absolute inset-0 w-full h-full opacity-70" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(35,64,184,0.35), transparent 55%)" }}
      />

      <div className="max-w-295 mx-auto px-5 md:px-8 relative z-10 pt-16 md:pt-20 pb-16 md:pb-20 text-center">
        <a
          href="/register"
          className="inline-flex items-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full text-[12.5px] font-medium mb-8 transition-colors"
          style={fontBody}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: COLORS.primaryLight }} />
          New: AI Interview Coach and Resume Analyzer
          <span aria-hidden="true">→</span>
        </a>

        <h1
          className="text-[38px] md:text-[64px] font-bold leading-[1.08] mb-6 max-w-4xl mx-auto"
          style={fontHead}
        >
          Where Talent
          <br />
          Meets <span style={{ color: COLORS.primaryLight }}>Opportunity.</span>
        </h1>

        <p className="text-[16px] md:text-[18px] leading-relaxed max-w-xl mx-auto mb-8 text-white/70" style={fontBody}>
          UniHirex connects university students with recruiters. Build one profile, sharpen it with AI, and apply with
          confidence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-[10px] font-semibold text-[15px] text-white transition-transform duration-200 hover:-translate-y-0.5"
            style={{ ...fontBody, background: COLORS.accent, boxShadow: "0 8px 24px -8px rgba(122,18,69,0.6)" }}
          >
            I'm a Student →
          </Link>
          <Link
            to="/register?role=recruiter"
            className="w-full sm:w-auto px-8 py-4 rounded-[10px] font-semibold text-[15px] border border-white/25 bg-white/5 hover:bg-white/10 transition-colors duration-200"
            style={fontBody}
          >
            I'm Hiring →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-white/10 pt-8 max-w-4xl mx-auto text-left">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label}>
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-2.5 text-white/90">
                {h.icon}
              </div>
              <div className="text-[14px] font-semibold" style={fontBody}>
                {h.label}
              </div>
              <div className="text-[12.5px] text-white/55 mt-0.5 leading-snug" style={fontBody}>
                {h.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}