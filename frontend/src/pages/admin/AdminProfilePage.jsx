import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // TODO: connect to backend update-profile API (Phase 2)
      setEditing(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
  ];

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        My Profile
      </h1>
      <p className="text-[14.5px] mb-8" style={{ ...fontBody, color: COLORS.textMuted }}>
        Your platform administrator account.
      </p>

      <div className="max-w-130 border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
            Account Details
          </h3>
          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={() => { setForm({ name: user?.name || "", email: user?.email || "" }); setEditing(false); }}
                className="text-[13.5px] font-semibold"
                style={{ ...fontBody, color: COLORS.textMuted }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-[13.5px] font-semibold"
                style={{ ...fontBody, color: COLORS.primary }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-[13.5px] font-semibold"
              style={{ ...fontBody, color: COLORS.accent }}
            >
              Edit
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl text-white shrink-0"
            style={{ background: COLORS.primary }}
          >
            {form.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full capitalize"
            style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
          >
            Admin
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.key}>
              <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
                {f.label}
              </p>
              {editing ? (
                <>
                  <input
                    name={f.key}
                    value={form[f.key]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
                    style={{ ...fontBody, borderColor: errors[f.key] ? "#DC2626" : "#D7DEF5" }}
                  />
                  {errors[f.key] && (
                    <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>{errors[f.key]}</p>
                  )}
                </>
              ) : (
                <p className="text-[14.5px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
                  {form[f.key] || "—"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}