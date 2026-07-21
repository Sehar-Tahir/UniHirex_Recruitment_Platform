
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { getMyNotifications } from "../../api/notifications";

function getPageTitle(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] || "Dashboard";
  if (/^[0-9a-f-]{6,}$/i.test(last) || last === segments[0]) {
    return "Dashboard";
  }
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Topbar({ onMenuClick }) {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const data = await getMyNotifications(token);
        setUnreadCount(data.filter((n) => !n.read).length);
      } catch {
        // silently ignore — badge is a nice-to-have
      }
    };
    fetchUnread();
  }, [token, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="h-18 flex items-center justify-between px-5 md:px-8 border-b sticky top-0 bg-white z-10"
      style={{ borderColor: "#EEF1F8" }}
    >
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden" aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.textDark} strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="text-[18px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to={`/${user?.role}/notifications`}
          className="relative w-9.5 h-9.5 rounded-full flex items-center justify-center transition-colors hover:bg-[#F7F8FC]"
          aria-label="Notifications"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: COLORS.accent }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className="text-[13px] font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-[#FBEAEA]"
          style={{ ...fontBody, color: COLORS.accent }}
        >
          Logout
        </button>

        <div className="w-px h-7 bg-[#EEF1F8]" />

         <Link
          to={user?.role === "student" ? "/student/profile" : user?.role === "recruiter" ? "/recruiter/company" : "/admin/profile"}
          className="flex items-center gap-2.5"
        >
          <div
            className="w-9.5 h-9.5 rounded-full flex items-center justify-center font-semibold text-white text-[13.5px] shrink-0 overflow-hidden"
            style={{ background: COLORS.primary }}
          >
            {user?.role === "recruiter" && user?.logoUrl ? (
              <img src={user.logoUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : user?.role !== "recruiter" && user?.photoUrl ? (
              <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13.5px] font-semibold leading-tight" style={{ ...fontBody, color: COLORS.textDark }}>
              {user?.name || "Guest"}
            </p>
            <p className="text-[12px] capitalize leading-tight" style={{ ...fontBody, color: COLORS.textMuted }}>
              {user?.role}
            </p>
          </div>
        </Link>

        {/* <button
          onClick={handleLogout}
          className="text-[13px] font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-[#FBEAEA]"
          style={{ ...fontBody, color: COLORS.accent }}
        >
          Logout
        </button> */}
      </div>
    </header>
  );
}