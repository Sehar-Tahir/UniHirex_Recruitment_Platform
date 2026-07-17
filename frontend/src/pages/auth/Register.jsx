import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import RoleToggle from "../../components/auth/RoleToggle";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrors({});
  };
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", companyName: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    else if (role === "student" && !form.email.toLowerCase().endsWith("@iub.edu.pk")) {
      errs.email = "Registration is currently limited to IUB students, use your @iub.edu.pk email";
    }
    if (role === "recruiter" && !form.companyName.trim()) errs.companyName = "Company name is required";
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
      // TODO: connect to backend register API (Phase 2)
      console.log("Registering", { role, ...form });
      navigate(role === "recruiter" ? "/pending-verification" : "/verify-email");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your journey with UniHirex today"
    >
      <RoleToggle role={role} setRole={handleRoleChange} />

      {role === "student" && (
        <div
          className="text-[13px] font-medium px-4 py-2.5 rounded-lg mb-5"
          style={{ background: "#EEF1FC", color: COLORS.primary }}
        >
          Currently open to IUB students only, use your @iub.edu.pk email.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {role === "recruiter" && (
          <FormInput
            label="Company name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="e.g. Techverse Solutions"
            error={errors.companyName}
          />
        )}
        <FormInput
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={role === "recruiter" ? "e.g. Ayesha Malik" : "e.g. Sehar Tahir"}
          error={errors.name}
        />
        <FormInput
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder={role === "recruiter" ? "you@company.com" : "you@iub.edu.pk"}
          error={errors.email}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          error={errors.password}
        />
        <FormInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
        />


        {role === "recruiter" && (
          <p className="text-[12.5px] mb-4 leading-relaxed" style={{ ...fontBody, color: COLORS.textMuted }}>
            Recruiter accounts are manually reviewed to confirm company authenticity before you can post listings.
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white mt-2"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          Create account as {role === "student" ? "Student" : "Recruiter"}
        </button>
      </form>

      <p className="text-center text-[14px] mt-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        Already have an account?{" "}
        <Link to="/login" className="font-semibold" style={{ color: COLORS.primary }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}