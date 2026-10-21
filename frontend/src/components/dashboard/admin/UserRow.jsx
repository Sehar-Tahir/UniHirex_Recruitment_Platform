import React from "react";
import { COLORS, fontBody } from "../../../theme";

const STATUS_STYLES = {
  Active: { bg: "#E7F7EE", color: "#15803D" },
  Pending: { bg: "#FFF6E5", color: "#B45309" },
  Suspended: { bg: "#FBEAEA", color: "#B91C1C" },
};

export default function UserRow({
  id,
  name,
  email,
  role,
  status,
  createdAt,
  onToggleStatus,
  onApprove,
  onManageAi,
  onDelete,
}) {
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.Suspended;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-4 border-b border-[#F1F3F9] last:border-0">
      <div className="min-w-0">
        <p className="text-[14.5px] font-semibold truncate" style={{ ...fontBody, color: COLORS.textDark }}>
          {name}
        </p>
        <p className="text-[13px] truncate" style={{ ...fontBody, color: COLORS.textMuted }}>
          {email}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3 md:shrink-0">
        <span
          className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap"
          style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
        >
          {role}
        </span>

        {createdAt && (
          <span className="text-[12px] whitespace-nowrap hidden md:inline" style={{ ...fontBody, color: COLORS.textMuted }}>
            Joined {new Date(createdAt).toLocaleDateString()}
          </span>
        )}

        <span
          className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ ...fontBody, background: statusStyle.bg, color: statusStyle.color }}
        >
          {status}
        </span>

        {role === "student" && (
          <button
            onClick={onManageAi}
            className="text-[12.5px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border"
            style={{ ...fontBody, color: COLORS.accent, borderColor: "#EFD7E2" }}
          >
            AI Access
          </button>
        )}

        {status === "Pending" ? (
          <button
            onClick={() => onApprove(id)}
            className="text-[12.5px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border"
            style={{ ...fontBody, color: "#15803D", borderColor: "#CFE9DA" }}
          >
            Approve
          </button>
        ) : (
          <button
            onClick={() => onToggleStatus(id)}
            className="text-[12.5px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border"
            style={{
              ...fontBody,
              color: status === "Active" ? "#B91C1C" : COLORS.primary,
              borderColor: status === "Active" ? "#F3D2D2" : "#D7DEF5",
            }}
          >
            {status === "Active" ? "Suspend" : "Activate"}
          </button>
        )}

        {(role === "student" || role === "recruiter") && (
          <button
            onClick={onDelete}
            className="text-[12.5px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full"
            style={{ ...fontBody, color: "#fff", background: "#B91C1C" }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}