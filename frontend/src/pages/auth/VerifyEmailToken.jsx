import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";
import { verifyEmail } from "../../api/auth";

export default function VerifyEmailToken() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const runVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    };
    runVerification();
  }, [token]);

  if (status === "verifying") {
    return (
      <AuthLayout title="Verifying your email...">
        <p className="text-[14.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          Please wait a moment.
        </p>
      </AuthLayout>
    );
  }

  if (status === "success") {
    return (
      <AuthLayout title="Email verified!">
        <div className="text-center py-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#E7F7EE" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[15px] mb-6" style={{ ...fontBody, color: COLORS.textDark }}>
            Your email has been verified successfully. You can now sign in.
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

  return (
    <AuthLayout title="Verification failed">
      <div className="text-center py-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "#FBEAEA" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M4.9 4.9l14.2 14.2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
          {message || "This link is invalid or has expired."}
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