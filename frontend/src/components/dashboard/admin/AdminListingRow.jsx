import React from "react";
import { COLORS, fontBody } from "../../../theme";

const STATUS_STYLES = {
  Active: { bg: "#E7F7EE", color: "#15803D" },
  Flagged: { bg: "#FFF6E5", color: "#B45309" },
  Closed: { bg: "#F1F5F9", color: COLORS.textMuted },
};

export default function AdminListingRow({ id, title, company, type, status, postedOn, onSetStatus }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Closed;

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 py-4 border-b border-[#F1F3F9] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-[14.5px] font-semibold truncate" style={{ ...fontBody, color: COLORS.textDark }}>
          {title}
        </p>
        <p className="text-[13px] truncate" style={{ ...fontBody, color: COLORS.textMuted }}>
          {company} · {type} · Posted {postedOn}
        </p>
      </div>

      <span
        className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap mx-4"
        style={{ ...fontBody, background: style.bg, color: style.color }}
      >
        {status}
      </span>

      <div className="flex gap-3 whitespace-nowrap">
        {status !== "Flagged" && (
          <button
            onClick={() => onSetStatus(id, "Flagged")}
            className="text-[13px] font-semibold"
            style={{ ...fontBody, color: "#B45309" }}
          >
            Flag
          </button>
        )}
        {status !== "Closed" && (
          <button
            onClick={() => onSetStatus(id, "Closed")}
            className="text-[13px] font-semibold"
            style={{ ...fontBody, color: "#B91C1C" }}
          >
            Close
          </button>
        )}
        {status !== "Active" && (
          <button
            onClick={() => onSetStatus(id, "Active")}
            className="text-[13px] font-semibold"
            style={{ ...fontBody, color: COLORS.primary }}
          >
            Reactivate
          </button>
        )}
      </div>
    </div>
  );
}