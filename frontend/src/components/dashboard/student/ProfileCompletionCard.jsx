import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function ProfileCompletionCard({ completion, missing }) {
  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          Profile Completion
        </h3>
        <span className="text-[15px] font-bold" style={{ ...fontBody, color: COLORS.primary }}>
          {completion}%
        </span>
      </div>

      <div className="w-full h-2.5 rounded-full bg-[#EEF1F8] overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${completion}%`, background: COLORS.primary }}
        />
      </div>

      {missing?.length > 0 && (
        <p className="text-[13.5px] mb-3" style={{ ...fontBody, color: COLORS.textMuted }}>
          Missing: {missing.join(", ")}
        </p>
      )}

      <Link
        to="/student/profile"
        className="inline-block text-[13.5px] font-semibold"
        style={{ ...fontBody, color: COLORS.accent }}
      >
        Complete your profile →
      </Link>
    </div>
  );
}