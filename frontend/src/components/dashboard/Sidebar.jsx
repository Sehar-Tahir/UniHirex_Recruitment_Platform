import React from "react";
import { Link, NavLink } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import { LogoMark } from "../home/Logo";

const ICONS = {
  dashboard: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  fileCheck: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 15l2 2 4-4" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></>,
  plusCircle: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  usersSearch: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" /><circle cx="17.5" cy="15.5" r="2.5" /><path d="M21 19l-1.5-1.5" /></>,
  users: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2 20c0-3 2.5-5 6-5s6 2 6 5M14 15c3 0 5 2 5 5" /></>,
};

const NAV_LINKS = {
  student: [
    { to: "/student/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/student/profile", label: "My Profile", icon: "profile" },
    { to: "/student/jobs", label: "Browse Jobs", icon: "briefcase" },
    { to: "/student/internships", label: "Internships", icon: "bookmark" },
    { to: "/student/applications", label: "My Applications", icon: "fileCheck" },
    { to: "/student/notifications", label: "Notifications", icon: "bell" },
  ],
  recruiter: [
    { to: "/recruiter/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/recruiter/company", label: "Company Profile", icon: "building" },
    { to: "/recruiter/post-listing", label: "Post a Listing", icon: "plusCircle" },
    { to: "/recruiter/listings", label: "Manage Listings", icon: "list" },
    { to: "/recruiter/candidates", label: "Search Candidates", icon: "usersSearch" },
    { to: "/recruiter/notifications", label: "Notifications", icon: "bell" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/admin/users", label: "Manage Users", icon: "users" },
    { to: "/admin/jobs", label: "Manage Jobs", icon: "briefcase" },
    { to: "/admin/notifications", label: "Notifications", icon: "bell" },
  ],
};

export default function Sidebar({ role, open, onClose }) {
  const links = NAV_LINKS[role] || [];

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
      )}

      <aside
        className={`w-65 h-dvh fixed top-0 left-0 flex flex-col px-4 py-6 z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "#0A0E27" }}
      >
        <div className="flex items-center justify-between mb-10 px-3">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-white" style={fontBody}>
            <LogoMark size={30} dark />
            UniHirex
          </Link>
          <button onClick={onClose} className="lg:hidden" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[14px] font-medium transition-colors"
            style={({ isActive }) => ({
              ...fontBody,
              background: isActive ? "rgba(91,114,216,0.18)" : "transparent",
              color: isActive ? "#8DA0EE" : "rgba(255,255,255,0.55)",
            })}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              {ICONS[link.icon]}
            </svg>
            {link.label}
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  );
}