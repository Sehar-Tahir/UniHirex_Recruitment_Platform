import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function CreateAdminModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "w-full px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none";
  const fieldStyle = { ...fontBody, borderColor: "#D7DEF5" };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-105"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
          Create New Admin
        </h3>
        <p className="text-[13.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
          This account will have full platform access immediately.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className={fieldClass}
              style={{ ...fieldStyle, borderColor: errors.name ? "#DC2626" : "#D7DEF5" }}
            />
            {errors.name && <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>{errors.name}</p>}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className={fieldClass}
              style={{ ...fieldStyle, borderColor: errors.email ? "#DC2626" : "#D7DEF5" }}
            />
            {errors.email && <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>{errors.email}</p>}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={fieldClass}
              style={{ ...fieldStyle, borderColor: errors.password ? "#DC2626" : "#D7DEF5" }}
            />
            {errors.password && <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>{errors.password}</p>}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg font-semibold text-[14px]"
              style={{ ...fontBody, color: COLORS.textMuted, background: "#F1F5F9" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg font-semibold text-[14px] text-white disabled:opacity-60"
              style={{ ...fontBody, background: COLORS.accent }}
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}