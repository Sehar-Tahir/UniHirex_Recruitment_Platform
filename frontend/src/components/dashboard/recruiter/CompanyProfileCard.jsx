import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function CompanyProfileCard({ company, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(company);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: upload to Cloudinary in Phase 2, for now just preview locally
    const previewUrl = URL.createObjectURL(file);
    setForm({ ...form, logoUrl: previewUrl });
  };

  const handleSave = () => {
    onSave(form);
    setEditing(false);
  };

  const fields = [
    { key: "name", label: "Company Name" },
    { key: "industry", label: "Industry" },
    { key: "website", label: "Website" },
  ];

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          Company Details
        </h3>
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={() => { setForm(company); setEditing(false); }}
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

      <div className="flex items-center gap-5 mb-6">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden font-semibold text-2xl text-white shrink-0"
          style={{ background: COLORS.primary }}
        >
          {form.logoUrl ? (
            <img src={form.logoUrl} alt="Company logo" className="w-full h-full object-cover" />
          ) : (
            form.name?.[0]?.toUpperCase() || "C"
          )}
        </div>
        {editing && (
          <label
            className="text-[13.5px] font-semibold cursor-pointer"
            style={{ ...fontBody, color: COLORS.primary }}
          >
            Change logo
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
              {f.label}
            </p>
            {editing ? (
              <input
                name={f.key}
                value={form[f.key]}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
                style={{ ...fontBody, borderColor: "#D7DEF5" }}
              />
            ) : (
              <p className="text-[14.5px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
                {form[f.key]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}