import React from "react";
import { COLORS, fontBody } from "../../../theme";

export default function UserRow({ id, name, email, role, status, joinedOn, onToggleStatus }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F1F3F9] last:border-0">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0"
          style={{ background: role === "recruiter" ? COLORS.accent : COLORS.primary }}
        >
          {name[0].toUpperCase()}
        </div>
        <div>
          <p className="text-[14.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
            {name}
          </p>
          <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            {email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full capitalize whitespace-nowrap"
          style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
        >
          {role}
        </span>
        <span
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
          style={{
            ...fontBody,
            background: status === "Active" ? "#E7F7EE" : "#FBEAEA",
            color: status === "Active" ? "#15803D" : "#B91C1C",
          }}
        >
          {status}
        </span>
        <p className="text-[12.5px] w-22.5" style={{ ...fontBody, color: COLORS.textMuted }}>
          {joinedOn}
        </p>
        <button
          onClick={() => onToggleStatus(id)}
          className="text-[13px] font-semibold whitespace-nowrap"
          style={{ ...fontBody, color: status === "Active" ? "#B91C1C" : COLORS.primary }}
        >
          {status === "Active" ? "Suspend" : "Activate"}
        </button>
      </div>
    </div>
  );
}