import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../hooks/useUsers";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { findByEmail } = useUsers();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setLoginError("");
    if (Object.keys(errs).length > 0) return;

    // TODO: replace with real backend login API (Phase 2) — will return role + JWT from the actual account
    const isIUBEmail = form.email.toLowerCase().endsWith("@iub.edu.pk");
    const role = isIUBEmail ? "student" : "recruiter";

    if (role === "recruiter") {
      const existing = findByEmail(form.email);
      if (existing?.status === "Pending") {
        setLoginError("Your recruiter account is still pending admin approval.");
        return;
      }
      if (existing?.status === "Suspended") {
        setLoginError("This account has been suspended. Contact support for help.");
        return;
      }
    }

    const dummyUser = { name: form.email.split("@")[0], email: form.email, role };
    login(dummyUser);
    navigate(`/${role}/dashboard`);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard"
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@university.edu.pk"
          error={errors.email}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
        />

    

        {loginError && (
          <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
            {loginError}
          </p>
        )}

        <div className="flex justify-end mb-6">
          <Link to="/forget-password" className="text-[14px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          Sign in
        </button>
      </form>

      {/* <p className="text-center text-[14px] mt-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold" style={{ color: COLORS.primary }}>
          Create one
        </Link>
      </p> */}
<p className="text-center text-[14px] mt-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold" style={{ color: COLORS.primary }}>
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}