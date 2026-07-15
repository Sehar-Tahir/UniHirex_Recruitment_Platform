import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../theme";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p
        className="text-[80px] font-bold leading-none mb-2"
        style={{ ...fontHead, color: COLORS.primary }}
      >
        404
      </p>
      <h1 className="text-[22px] font-bold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
        Page not found
      </h1>
      <p className="text-[14.5px] mb-8 max-w-95" style={{ ...fontBody, color: COLORS.textMuted }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-lg font-semibold text-[14.5px] text-white"
        style={{ ...fontBody, background: COLORS.accent }}
      >
        Back to Home
      </Link>
    </div>
  );
}