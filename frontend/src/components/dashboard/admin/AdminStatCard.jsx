import React from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function AdminStatCard({ label, value }) {
  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-5 bg-white">
      <p className="text-[13px] font-medium mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>
        {label}
      </p>
      <p className="text-[26px] font-bold" style={{ ...fontHead, color: COLORS.primary }}>
        {value}
      </p>
    </div>
  );
}