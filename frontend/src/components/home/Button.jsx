import React from "react";
import { COLORS, fontBody } from "../../theme";

export default function Button({ children, variant = "primary", href = "#", className = "" }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] font-semibold text-[15px] transition-all duration-200 active:translate-y-px";

  const variants = {
    primary:
      "text-white shadow-[0_8px_20px_-8px_rgba(122,18,69,0.55)] hover:shadow-[0_10px_24px_-6px_rgba(122,18,69,0.6)]",
    ghost: "text-white border-[1.5px] border-white/50 bg-white/10 hover:bg-white/20",
    outline: "border-[1.5px] border-[#D7DEF5] hover:border-current hover:bg-[#EEF1FC]",
    white: "shadow-lg",
  };

  const style =
    variant === "primary"
      ? { background: COLORS.accent }
      : variant === "outline"
      ? { color: COLORS.primary }
      : variant === "white"
      ? { background: "#fff", color: COLORS.accent }
      : {};

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} style={{ ...fontBody, ...style }}>
      {children}
    </a>
  );
}
