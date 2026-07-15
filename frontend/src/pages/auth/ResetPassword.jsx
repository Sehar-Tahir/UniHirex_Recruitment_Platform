import React, { useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
// import { COLORS, fontHead, fontBody } from "../../theme";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";

export default function ResetPassword() {
  const { token } = useParams();
//   const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords don't match";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // TODO: connect to backend reset-password API using `token` (Phase 2)
      console.log("Resetting password with token:", token);
      setDone(true);
    }
  };

  if (done) {
    return (
      <AuthLayout title="Password reset successful">
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
            Your password has been reset. You can now sign in with your new password.
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
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before"
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          label="New password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          error={errors.password}
        />
        <FormInput
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your new password"
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white mt-2"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}