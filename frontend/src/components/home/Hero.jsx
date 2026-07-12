import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import Button from "./Button";
import FloatingCard from "./FloatingCard";

const STATS = [
  ["10K+", "Students"],
  ["2K+", "Companies"],
  ["5K+", "Opportunities"],
  ["98%", "Satisfaction"],
];

export default function Hero() {
  return (
    <header
      className="relative overflow-hidden text-white pb-16"
      style={{
        background: `linear-gradient(135deg, ${COLORS.blue} 0%, #2A3FB0 45%, ${COLORS.burgundy} 100%)`,
        clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10), transparent 45%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.08), transparent 40%)",
        }}
      />
      <div className="max-w-[1180px] mx-auto px-5 md:px-8 relative z-10">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 items-center pt-16 md:pt-20">
          <div>
            <div
              className="inline-flex items-center gap-2 bg-white/15 border border-white/30 px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide mb-6"
              style={fontBody}
            >
              <span className="w-[7px] h-[7px] rounded-full" style={{ background: "#FFD166" }} />
              Built for university talent
            </div>
            <h1 className="text-4xl md:text-[50px] font-bold leading-[1.1] mb-5" style={fontHead}>
              Find Opportunities.
              <br />
              Build Your <span style={{ color: "#FFD166" }}>Future.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-[480px] mb-8 text-white/90" style={fontBody}>
              UniHirex connects university students with recruiters, internships, and entry-level roles — one
              profile, every opportunity, zero guesswork.
            </p>
            <div className="flex flex-wrap gap-3.5 mb-10">
              <Button variant="primary">Create your profile</Button>
              <Button variant="ghost">Post a job →</Button>
            </div>
            <div className="flex flex-wrap gap-8">
              {STATS.map(([num, label]) => (
                <div key={label}>
                  <strong className="block text-2xl font-bold" style={fontHead}>
                    {num}
                  </strong>
                  <span className="text-[13px] text-white/75" style={fontBody}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[340px] md:h-[430px] mt-6 md:mt-0">
            <FloatingCard
              avatarGradient={`linear-gradient(135deg, ${COLORS.blueSoft}, ${COLORS.blue})`}
              name="Ayesha Khan"
              role="BSCS · IUB"
              extra={
                <div className="h-1.5 bg-[#E7EAF3] rounded-full overflow-hidden mt-2.5">
                  <div className="h-full rounded-full" style={{ width: "82%", background: COLORS.burgundy }} />
                </div>
              }
              tagBg="#EEF1FC"
              tagColor={COLORS.blue}
              tagText="Profile 82% complete"
              floatClass="animate-[float1_6s_ease-in-out_infinite]"
              position={{ top: 0, left: "5%" }}
            />
            <FloatingCard
              avatarGradient={`linear-gradient(135deg, ${COLORS.burgundySoft}, ${COLORS.burgundy})`}
              name="Frontend Intern"
              role="Go Automation · Remote"
              tagBg="#F8ECF1"
              tagColor={COLORS.burgundy}
              tagText="New match"
              floatClass="animate-[float2_7s_ease-in-out_infinite]"
              position={{ top: "34%", right: 0 }}
            />
            <FloatingCard
              avatarGradient={`linear-gradient(135deg, ${COLORS.blueSoft}, ${COLORS.blue})`}
              name="Application shortlisted"
              role="CRM Automation Associate"
              tagBg="#EEF1FC"
              tagColor={COLORS.blue}
              tagText="Interview invite sent"
              floatClass="animate-[float3_6.5s_ease-in-out_infinite]"
              position={{ bottom: 0, left: "12%" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes float3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-"] { animation: none !important; }
        }
      `}</style>
    </header>
  );
}
