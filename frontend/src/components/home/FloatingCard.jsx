import React from "react";
import { COLORS, fontBody } from "../../theme";

export default function FloatingCard({ avatarGradient, name, role, extra, tagBg, tagColor, tagText, floatClass, position }) {
  return (
    <div
      className={`absolute bg-white rounded-2xl px-5 py-4 shadow-[0_24px_48px_-16px_rgba(10,16,40,0.35)] w-57.5 sm:w-60 ${floatClass}`}
      style={{ ...position, ...fontBody }}
    >
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-full shrink-0" style={{ background: avatarGradient }} />
        <div>
          <div className="font-semibold text-sm" style={{ color: COLORS.textDark }}>
            {name}
          </div>
          <div className="text-xs" style={{ color: COLORS.textMuted }}>
            {role}
          </div>
        </div>
      </div>
      {extra}
      <span
        className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mt-2"
        style={{ background: tagBg, color: tagColor }}
      >
        {tagText}
      </span>
    </div>
  );
}
