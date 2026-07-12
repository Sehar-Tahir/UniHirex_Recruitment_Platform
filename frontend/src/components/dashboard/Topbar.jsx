import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="h-18 flex items-center justify-between px-8 border-b sticky top-0 bg-white z-10"
      style={{ borderColor: "#EEF1F8" }}
    >
      <div />

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[14px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
            {user?.name || "Guest"}
          </p>
          <p className="text-[12.5px] capitalize" style={{ ...fontBody, color: COLORS.textMuted }}>
            {user?.role}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
          style={{ background: COLORS.primary }}
        >
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <button
          onClick={handleLogout}
          className="text-[13.5px] font-semibold px-3 py-2 rounded-lg"
          style={{ ...fontBody, color: COLORS.accent }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}