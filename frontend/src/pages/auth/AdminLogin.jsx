import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
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
    setError("");
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });

      if (data.role !== "admin") {
        setError("Invalid admin credentials");
        setLoading(false);
        return;
      }

      login(
        { id: data.id, name: data.name, email: data.email, role: data.role, status: data.status },
        data.token
      );
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Sign In" subtitle="Restricted access, platform administrators only">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Admin email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="admin@unihirex.com"
          error={errors.email}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter admin password"
          error={errors.password}
        />

        {error && (
          <p className="text-[13.5px] mb-4 -mt-2" style={{ color: "#DC2626" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-[10px] font-semibold text-[15px] text-white mt-2 disabled:opacity-60"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          {loading ? "Signing in..." : "Sign in as Admin"}
        </button>
      </form>
    </AuthLayout>
  );
}