import React from "react";
import { COLORS, fontHead } from "../../theme";

export function LogoMark({ size = 34, dark = false }) {
  const tieColor = dark ? COLORS.burgundySoft : COLORS.burgundy;
  const barColor = dark ? COLORS.blueSoft : COLORS.blue;
  const stemColor = dark ? "#fff" : COLORS.ink;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 14 L13 9 L20 14 L13 19 Z" fill={tieColor} />
      <rect x="11.5" y="13" width="3" height="11" fill={stemColor} />
      <path d="M18 9 L22 9 L24 31 L20 36 L16 31 Z" fill={tieColor} />
      <rect x="6" y="13" width="6" height="20" fill={barColor} />
      <rect x="24" y="9" width="6" height="24" fill={barColor} />
      <rect x="24" y="19" width="10" height="6" fill={barColor} />
    </svg>
  );
}

export default function Logo({ dark = false }) {
  return (
    <div
      className="flex items-center gap-2.5 font-bold text-xl"
      style={{ ...fontHead, color: dark ? "#fff" : COLORS.blue }}
    >
      <LogoMark dark={dark} />
      UniHirex
    </div>
  );
}
