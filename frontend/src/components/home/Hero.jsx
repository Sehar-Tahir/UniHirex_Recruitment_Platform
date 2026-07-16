// import React from "react";
// import { COLORS, fontHead, fontBody } from "../../theme";
// import Button from "./Button";
// import FloatingCard from "./FloatingCard";

// const STATS = [
//   ["10K+", "Students"],
//   ["2K+", "Companies"],
//   ["5K+", "Opportunities"],
//   ["98%", "Satisfaction"],
// ];

// export default function Hero() {
//   return (
//     <header
//       className="relative overflow-hidden text-white pb-16"
//       style={{
//         background: `linear-gradient(135deg, ${COLORS.primary} 0%, #2A3FB0 45%, ${COLORS.accent} 100%)`,
//         clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
//       }}
//     >
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10), transparent 45%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.08), transparent 40%)",
//         }}
//       />
//       <div className="max-w-295 mx-auto px-5 md:px-8 relative z-10">
//         <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 items-center pt-16 md:pt-20">
//           <div>
//             {/* <div
//               className="inline-flex items-center gap-2 bg-white/15 border border-white/30 px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide mb-6"
//               style={fontBody}
//             >
//               <span className="w-1.75 h-1.75 rounded-full" style={{ background: "#FFD166" }} />
//               Built for university talent
//             </div> */}
//             <h1 className="text-4xl md:text-[50px] font-bold leading-[1.1] mb-5" style={fontHead}>
//               Find Opportunities.
//               <br />
//               Build Your <span style={{ color: "#FFD166" }}>Future.</span>
//             </h1>
//             <p className="text-lg leading-relaxed max-w-120 mb-8 text-white/90" style={fontBody}>
//               UniHirex connects university students with recruiters, internships, and entry-level roles — one
//               profile, every opportunity, zero guesswork.
//             </p>
//             <div className="flex flex-wrap gap-3.5 mb-10">
//               <Button variant="primary">Create your profile</Button>
//               <Button variant="ghost">Post a job →</Button>
//             </div>
//             <div className="flex flex-wrap gap-8">
//               {STATS.map(([num, label]) => (
//                 <div key={label}>
//                   <strong className="block text-2xl font-bold" style={fontHead}>
//                     {num}
//                   </strong>
//                   <span className="text-[13px] text-white/75" style={fontBody}>
//                     {label}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="relative h-85 md:h-107.5 mt-6 md:mt-0">
//             <FloatingCard
//               avatarGradient={`linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary})`}
//               name="Ayesha Khan"
//               role="BSCS · IUB"
//               extra={
//                 <div className="h-1.5 bg-[#E7EAF3] rounded-full overflow-hidden mt-2.5">
//                   <div className="h-full rounded-full" style={{ width: "82%", background: COLORS.accent }} />
//                 </div>
//               }
//               tagBg="#EEF1FC"
//               tagColor={COLORS.primary}
//               tagText="Profile 82% complete"
//               floatClass="animate-[float1_6s_ease-in-out_infinite]"
//               position={{ top: 0, left: "5%" }}
//             />
//             <FloatingCard
//               avatarGradient={`linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.accent})`}
//               name="Frontend Intern"
//               role="Go Automation · Remote"
//               tagBg="#F8ECF1"
//               tagColor={COLORS.accent}
//               tagText="New match"
//               floatClass="animate-[float2_7s_ease-in-out_infinite]"
//               position={{ top: "34%", right: 0 }}
//             />
//             <FloatingCard
//               avatarGradient={`linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary})`}
//               name="Application shortlisted"
//               role="CRM Automation Associate"
//               tagBg="#EEF1FC"
//               tagColor={COLORS.primary}
//               tagText="Interview invite sent"
//               floatClass="animate-[float3_6.5s_ease-in-out_infinite]"
//               position={{ bottom: 0, left: "12%" }}
//             />
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
//         @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
//         @keyframes float3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
//         @media (prefers-reduced-motion: reduce) {
//           [class*="animate-"] { animation: none !important; }
//         }
//       `}</style>
//     </header>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody, fontMono } from "../../theme";
import NodeGraph from "./NodeGraph";
import LiveCounter from "./LiveCounter";

const STATS = [
  { value: 342, suffix: "+", label: "Students matched" },
  { value: 48, suffix: "+", label: "Companies hiring" },
  { value: 76, suffix: "", label: "Live listings" },
  { value: 98, suffix: "%", label: "Match satisfaction" },
];

export default function Hero() {
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
              <div className="text-[26px] font-semibold" style={fontMono}>
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
