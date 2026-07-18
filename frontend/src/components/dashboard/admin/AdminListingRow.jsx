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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-4 border-b border-[#F1F3F9] last:border-0">
      <div className="min-w-0">
        <p className="text-[14.5px] font-semibold truncate" style={{ ...fontBody, color: COLORS.textDark }}>
          {title}
        </p>
        <p className="text-[13px] truncate" style={{ ...fontBody, color: COLORS.textMuted }}>
          {company} · {type} · Posted {postedOn}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3 md:shrink-0">
        <span
          className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ ...fontBody, background: style.bg, color: style.color }}
        >
          {status}
        </span>

        {status !== "Flagged" && (
          <button
            onClick={() => onSetStatus(id, "Flagged")}
            className="text-[12.5px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border"
            style={{ ...fontBody, color: "#B45309", borderColor: "#F5E1BB" }}
          >
            Flag
          </button>
        )}
        {status !== "Closed" && (
          <button
            onClick={() => onSetStatus(id, "Closed")}
            className="text-[12.5px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border"
            style={{ ...fontBody, color: "#B91C1C", borderColor: "#F3D2D2" }}
          >
            Close
          </button>
        )}
        {status !== "Active" && (
          <button
            onClick={() => onSetStatus(id, "Active")}
            className="text-[12.5px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border"
            style={{ ...fontBody, color: COLORS.primary, borderColor: "#D7DEF5" }}
          >
            Reactivate
          </button>
        )}
      </div>
    </div>
  );
}