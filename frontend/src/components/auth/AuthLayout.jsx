import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import Logo from "../home/Logo";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 text-white"
        style={{ background: `linear-gradient(160deg, ${COLORS.primary}, ${COLORS.accent})` }}
      >
        <Logo dark />

        <div style={fontBody}>
          <h2 className="text-[28px] font-semibold mb-3" style={fontHead}>
            Where talent meets opportunity
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed max-w-95">
            Join thousands of students and recruiters connecting on UniHirex —
            build your profile, get discovered, and land your next opportunity.
          </p>
        </div>

        <p className="text-white/60 text-[13px]" style={fontBody}>
          © {new Date().getFullYear()} UniHirex. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-105">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
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