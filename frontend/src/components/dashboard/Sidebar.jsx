import React from "react";
import { NavLink } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import { LogoMark } from "../home/Logo";

const NAV_LINKS = {
  student: [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/profile", label: "My Profile" },
    { to: "/student/jobs", label: "Browse Jobs" },
    { to: "/student/internships", label: "Internships" },
    { to: "/student/applications", label: "My Applications" },
    { to: "/student/notifications", label: "Notifications" },
  ],
  recruiter: [
    { to: "/recruiter/dashboard", label: "Dashboard" },
    { to: "/recruiter/company", label: "Company Profile" },
    { to: "/recruiter/post-listing", label: "Post a Listing" },
    { to: "/recruiter/listings", label: "Manage Listings" },
    { to: "/recruiter/candidates", label: "Search Candidates" },
    { to: "/recruiter/notifications", label: "Notifications" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/jobs", label: "Manage Jobs" },
    { to: "/admin/notifications", label: "Notifications" },
  ],
};

export default function Sidebar({ role, open, onClose }) {
  const links = NAV_LINKS[role] || [];

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`w-65 h-screen fixed lg:sticky top-0 flex flex-col px-5 py-6 border-r bg-white z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ borderColor: "#EEF1F8" }}
      >
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-2.5 font-bold text-lg" style={{ ...fontBody, color: COLORS.primary }}>
            <LogoMark size={30} />
            UniHirex
          </div>
          <button onClick={onClose} className="lg:hidden" aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2">
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
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-[10px] text-[14.5px] font-medium transition-colors ${
                  isActive ? "" : "hover:bg-[#F7F8FC]"
                }`
              }
              style={({ isActive }) => ({
                ...fontBody,
                background: isActive ? "#EEF1FC" : "transparent",
                color: isActive ? COLORS.primary : COLORS.textDark,
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}