import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { checkLink, safeUrl } from "../../../utils/links";

const FIELDS = [
  { key: "portfolioUrl", label: "Portfolio website", placeholder: "https://yourname.com", host: undefined },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/your-name", host: "linkedin.com" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/your-username", host: "github.com" },
];

const buildForm = (profile) => ({
  portfolioUrl: profile.portfolioUrl || "",
  linkedin: profile.socialLinks?.linkedin || "",
  github: profile.socialLinks?.github || "",
});

export default function LinksCard({ profile, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => buildForm(profile));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setForm(buildForm(profile));
    setErrors({});
    setEditing(true);
  };

  const handleSave = async () => {
    const errs = {};
    const clean = {};
    FIELDS.forEach((f) => {
      const result = checkLink(form[f.key], { host: f.host, label: `${f.label} link` });
      if (result.error) errs[f.key] = result.error;
      else clean[f.key] = result.value;
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    const ok = await onSave({
      portfolioUrl: clean.portfolioUrl,
      socialLinks: { linkedin: clean.linkedin, github: clean.github },
    });
    setSaving(false);
    if (ok) setEditing(false);
  };

  const current = buildForm(profile);

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          Portfolio & Social Links
        </h3>
        {editing ? (
          <div className="flex gap-3">
            <button onClick={() => setEditing(false)} className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.textMuted }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-[13.5px] font-semibold disabled:opacity-50"
              style={{ ...fontBody, color: COLORS.primary }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <button onClick={startEditing} className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
            Edit
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {FIELDS.map((f) => {
          const saved = current[f.key];
          const link = safeUrl(saved);
          return (
            <div key={f.key}>
              <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
                {f.label}
              </p>
              {editing ? (
                <>
                  <input
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    maxLength={300}
                    className="w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
                    style={{ ...fontBody, borderColor: errors[f.key] ? "#DC2626" : "#D7DEF5" }}
                  />
                  {errors[f.key] && (
                    <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>
                      {errors[f.key]}
                    </p>
                  )}
                </>
              ) : link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-semibold break-all"
                  style={{ ...fontBody, color: COLORS.primary }}
                >
                  {saved.replace(/^https?:\/\//i, "").replace(/\/$/, "")} ↗
                </a>
              ) : (
                <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                  Not added
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}