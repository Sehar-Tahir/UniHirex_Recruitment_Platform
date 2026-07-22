import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setLoginError("");
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });

      if (data.role === "admin") {
        setLoginError("Invalid email or password");
        setLoading(false);
        return;
      }

      login(
        { id: data.id, name: data.name, email: data.email, role: data.role, status: data.status },
        data.token
      );
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your dashboard">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
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
          disabled={loading}
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white disabled:opacity-60"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-[14px] mt-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold" style={{ color: COLORS.primary }}>
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}