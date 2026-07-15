import React from "react";
import { COLORS, fontBody } from "../../theme";

export default function NotificationCard({ id, text, time, read, onMarkRead }) {
  return (
    <div
      className="flex items-start justify-between gap-4 p-4 rounded-xl border mb-3 last:mb-0"
      style={{ borderColor: "#ECEEF3", background: read ? "#fff" : "#FAFBFE" }}
    >
      <div className="flex gap-3">
        <div
          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ background: read ? "#CBD5E1" : COLORS.accent }}
        />
        <div>
          <p className="text-[14px] leading-snug" style={{ ...fontBody, color: COLORS.textDark }}>
            {text}
          </p>
          <p className="text-[12px] mt-1" style={{ ...fontBody, color: COLORS.textMuted }}>
            {time}
          </p>
        </div>
      </div>
      {!read && (
        <button
          onClick={() => onMarkRead(id)}
          className="text-[12.5px] font-semibold whitespace-nowrap"
          style={{ ...fontBody, color: COLORS.primary }}
        >
          Mark read
        </button>
      )}
    </div>
  );
}