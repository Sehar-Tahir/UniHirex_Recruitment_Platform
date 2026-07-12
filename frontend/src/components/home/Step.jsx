import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";

export default function Step({ number, title, desc, accent }) {
  const circleStyle =
    accent === "filled"
      ? { background: COLORS.burgundy, borderColor: COLORS.burgundy, color: "#fff" }
      : accent === "burgundy"
      ? { borderColor: COLORS.burgundy, color: COLORS.burgundy }
      : { borderColor: COLORS.blue, color: COLORS.blue };

  return (
    <div className="relative z-10 px-4 text-left">
      <div
        className="w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center font-bold text-xl mb-5"
        style={{ ...fontHead, ...circleStyle }}
      >
        {number}
      </div>
      <h4 className="text-[17px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.ink }}>
        {title}
      </h4>
      <p className="text-[14.5px] leading-relaxed" style={{ ...fontBody, color: COLORS.gray }}>
        {desc}
      </p>
    </div>
  );
}
