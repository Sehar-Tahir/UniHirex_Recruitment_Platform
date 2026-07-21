import React, { useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import toast from "react-hot-toast";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import { forgotPassword } from "../../api/auth";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email");

    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox">
        <div className="text-center py-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#EEF1FC" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
              <path d="M4 6h16v12H4z" strokeLinejoin="round" />
              <path d="M4 6l8 7 8-7" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[15px] mb-1" style={{ ...fontBody, color: COLORS.textDark }}>
            If an account exists for
          </p>
          <p className="text-[15px] font-semibold mb-6" style={{ ...fontBody, color: COLORS.primary }}>
            {email}
          </p>
          <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            a reset link has been sent.{" "}
            <button
              onClick={() => setSent(false)}
              className="font-semibold"
              style={{ color: COLORS.primary }}
            >
              Try another email
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@university.edu.pk"
          error={error}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white mt-2 disabled:opacity-60"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-[14px] mt-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        Remembered your password?{" "}
        <Link to="/login" className="font-semibold" style={{ color: COLORS.primary }}>
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}