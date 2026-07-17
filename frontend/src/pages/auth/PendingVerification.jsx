import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";

export default function PendingVerification() {
  return (
    <AuthLayout title="Account under review">
      <div className="text-center py-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "#FFF6E5" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-[15px] mb-2 leading-relaxed" style={{ ...fontBody, color: COLORS.textDark }}>
          Thanks for registering! Our team reviews every recruiter account to confirm
          company authenticity before granting access to post listings.
        </p>
        <p className="text-[14px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
          You'll get an email once your account is verified, usually within 1–2 business days.
        </p>
        <Link
          to="/login"
          className="inline-block w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}