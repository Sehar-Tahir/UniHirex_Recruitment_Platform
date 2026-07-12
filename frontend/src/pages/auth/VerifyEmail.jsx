import React, { useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";

export default function VerifyEmail() {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    // TODO: connect to backend resend-verification API (Phase 2)
    console.log("Resending verification email");
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <AuthLayout title="Verify your email">
      <div className="text-center py-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "#FBEAF0" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2">
            <path d="M4 6h16v12H4z" strokeLinejoin="round" />
            <path d="M4 6l8 7 8-7" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-[15px] mb-6 leading-relaxed" style={{ ...fontBody, color: COLORS.textDark }}>
          We've sent a verification link to your email. Click the link to activate
          your UniHirex account.
        </p>

        <button
          onClick={handleResend}
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white mb-4"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          {resent ? "Verification email resent!" : "Resend verification email"}
        </button>

        <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          Wrong email?{" "}
          <Link to="/register" className="font-semibold" style={{ color: COLORS.primary }}>
            Go back
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}