import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import Logo from "../home/Logo";
import NodeGraph from "../home/NodeGraph";
import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{ background: "#0A0E27" }}
      >
        <NodeGraph className="absolute inset-0 w-full h-full opacity-60" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 30% 20%, rgba(35,64,184,0.35), transparent 55%)" }}
        />
        <div className="relative z-10">
          <Link to="/">
          <Logo dark />
        </Link>
        </div>

        <div style={fontBody}>
          <h2 className="text-[28px] font-semibold mb-3" style={fontHead}>
            Where talent meets opportunity
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed max-w-95">
            Join thousands of students and recruiters connecting on UniHirex.
            Build your profile, upload resume, and land your next opportunity.
          </p>
        </div>

        <p className="text-white/60 text-[13px]" style={fontBody}>
          © {new Date().getFullYear()} UniHirex. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 bg-white">
        <div className="w-full max-w-105">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/">
          <Logo />
        </Link>
          </div>

          <h1 className="text-[26px] font-bold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-[15px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}