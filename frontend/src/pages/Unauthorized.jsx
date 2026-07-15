import React from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ background: "#FBEAEA" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M4.9 4.9l14.2 14.2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-[22px] font-bold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
        Access denied
      </h1>
      <p className="text-[14.5px] mb-8 max-w-95" style={{ ...fontBody, color: COLORS.textMuted }}>
        You don't have permission to view this page{user?.role ? ` as a ${user.role}` : ""}.
      </p>
      <Link
        to={user?.role ? `/${user.role}/dashboard` : "/login"}
        className="px-6 py-3 rounded-lg font-semibold text-[14.5px] text-white"
        style={{ ...fontBody, background: COLORS.accent }}
      >
        {user?.role ? "Back to Dashboard" : "Back to Login"}
      </Link>
    </div>
  );
}