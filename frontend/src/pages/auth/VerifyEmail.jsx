import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";
import { resendVerification } from "../../api/auth";

export default function VerifyEmail() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setResending(true);
    try {
      await resendVerification(email);
      toast.success("If an account exists, a verification email has been sent.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResending(false);
    }
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
          {location.state?.email ? (
            <>We've sent a verification link to <strong>{email}</strong>.Check Your Spam Folder as well. Click the link to activate your UniHirex account.</>
          ) : (
            "Enter your email below to receive a verification link."
          )}
        </p>

        {!location.state?.email && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@iub.edu.pk"
            className="w-full px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none mb-4"
            style={{ ...fontBody, borderColor: "#D7DEF5" }}
          />
        )}

        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white mb-4 disabled:opacity-60"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          {resending ? "Resending..." : "Resend verification email"}
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