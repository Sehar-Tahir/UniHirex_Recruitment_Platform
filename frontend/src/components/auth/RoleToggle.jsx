import React from "react";
import { COLORS, fontBody } from "../../theme";

export default function RoleToggle({ role, setRole }) {
  const options = [
    { key: "student", label: "Student" },
    { key: "recruiter", label: "Recruiter" },
  ];

  return (
    <div className="flex mb-6 rounded-[10px] p-1 bg-[#F1F5F9]">
      {options.map((opt) => {
        const active = role === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => setRole(opt.key)}
            className="flex-1 py-2.5 rounded-lg text-[14px] font-semibold transition-all duration-150"
            style={{
              ...fontBody,
              background: active ? "#fff" : "transparent",
              color: active ? COLORS.primary : COLORS.textMuted,
              boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}