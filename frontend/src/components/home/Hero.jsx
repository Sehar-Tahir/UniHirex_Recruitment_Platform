

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import NodeGraph from "./NodeGraph";
import LiveCounter from "./LiveCounter";

// const STATS = [
//   { value: 342, suffix: "+", label: "Students Registered" },
//   { value: 48, suffix: "+", label: "Companies hiring" },
//   { value: 76, suffix: "", label: "Live listings" },
//   { value: 98, suffix: "%", label: "Satisfaction" },
// ];



export default function Hero() {

  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    activeJobs: 0,
    applications: 0,
  });
  useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stats`);

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  fetchStats();
}, []);

const STATS = [
  {
    value: stats.students,
    suffix: "+",
    label: "Students Registered",
  },
  {
    value: stats.companies,
    suffix: "+",
    label: "Companies",
  },
  {
    value: stats.activeJobs,
    suffix: "+",
    label: "Active Jobs",
  },
  {
    value: stats.applications,
    suffix: "+",
    label: "Applications",
  },
];

  return (
    <header
      className="relative overflow-hidden text-white"
      style={{ background: "#0A0E27" }}
    >
      <NodeGraph className="absolute inset-0 w-full h-full opacity-70" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(35,64,184,0.35), transparent 55%)",
        }}
      />

      <div className="max-w-295 mx-auto px-5 md:px-8 relative z-10 pt-20 md:pt-20 pb-20 text-center">
        {/* <div
          className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide mb-8"
          style={fontMono}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: COLORS.primaryLight }} />
          LIVE MATCHING ENGINE — {" "}
          <span style={{ color: COLORS.accentLight }}>76 open roles</span>
        </div> */}

        <h1
          className="text-[38px] md:text-[64px] font-bold leading-[1.08] mb-6 max-w-4xl mx-auto"
          style={fontHead}
        >
          Where Talent
          <br />
          Meets <span style={{ color: COLORS.primaryLight }}>Opportunity.</span>
        </h1>

        <p className="text-[16px] md:text-[18px] leading-relaxed max-w-xl mx-auto mb-8 text-white/70" style={fontBody}>
          UniHirex connects university students directly with recruiters,
          real profiles, real listings, matched in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-[10px] font-semibold text-[15px] text-white transition-transform duration-200 hover:-translate-y-0.5"
            style={{ ...fontBody, background: COLORS.accent, boxShadow: "0 8px 24px -8px rgba(122,18,69,0.6)" }}
          >
            I'm a Student →
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-[10px] font-semibold text-[15px] border border-white/25 bg-white/5 hover:bg-white/10 transition-colors duration-200"
            style={fontBody}
          >
            I'm Hiring →
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 border-t border-white/10 pt-6 max-w-2xl mx-auto">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[26px] font-semibold" style={fontBody}>
                <LiveCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[12.5px] text-white/50 mt-1" style={fontBody}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
