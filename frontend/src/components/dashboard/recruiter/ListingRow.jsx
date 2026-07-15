import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../../theme";

export default function ListingRow({ id, title, type, applicants, status, postedOn, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F1F3F9] last:border-0">
      <div>
        <p className="text-[14.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.textDark }}>
          {title}
        </p>
        <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          {type} · Posted {postedOn}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/recruiter/listings/${id}/applicants`)}
          className="text-[13.5px] font-semibold"
          style={{ ...fontBody, color: COLORS.primary }}
        >
          {applicants} applicant{applicants === 1 ? "" : "s"}
        </button>

        <span
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
          style={{
            ...fontBody,
            background: status === "Active" ? "#E7F7EE" : "#F1F5F9",
            color: status === "Active" ? "#15803D" : COLORS.textMuted,
          }}
        >
          {status}
        </span>

        {status === "Active" && (
          <button
            onClick={() => onClose(id)}
            className="text-[13px] font-semibold"
            style={{ ...fontBody, color: "#B91C1C" }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}