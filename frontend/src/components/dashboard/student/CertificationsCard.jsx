import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function CertificationsCard({ certifications, onChange }) {
  const [form, setForm] = useState({ name: "", issuer: "", year: "" });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onChange([...certifications, { id: Date.now(), ...form }]);
    setForm({ name: "", issuer: "", year: "" });
  };

  const handleRemove = (id) => {
    onChange(certifications.filter((c) => c.id !== id));
  };

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
      <h3 className="text-[16px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
        Certifications
      </h3>

      <div className="flex flex-col gap-3 mb-5">
        {certifications.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-[#ECEEF3]">
            <div>
              <p className="text-[14px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
                {c.name}
              </p>
              <p className="text-[12.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                {c.issuer} · {c.year}
              </p>
            </div>
            <button
              onClick={() => handleRemove(c.id)}
              className="text-[13px]"
              style={{ ...fontBody, color: "#B91C1C" }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          placeholder="Certificate name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
          style={{ ...fontBody, borderColor: "#D7DEF5" }}
        />
        <input
          placeholder="Issuer"
          value={form.issuer}
          onChange={(e) => setForm({ ...form, issuer: e.target.value })}
          className="px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
          style={{ ...fontBody, borderColor: "#D7DEF5" }}
        />
        <input
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          className="px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
          style={{ ...fontBody, borderColor: "#D7DEF5" }}
        />
      </div>
      <button
        onClick={handleAdd}
        className="mt-3 px-4 py-2 rounded-lg font-semibold text-[13.5px] text-white"
        style={{ ...fontBody, background: COLORS.accent }}
      >
        + Add Certification
      </button>
    </div>
  );
}