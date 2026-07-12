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
  ],
  recruiter: [
    { to: "/recruiter/dashboard", label: "Dashboard" },
    { to: "/recruiter/company", label: "Company Profile" },
    { to: "/recruiter/listings", label: "Manage Listings" },
    { to: "/recruiter/candidates", label: "Search Candidates" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/jobs", label: "Manage Jobs" },
  ],
};

export default function Sidebar({ role }) {
  const links = NAV_LINKS[role] || [];

  return (
    <aside
      className="w-65 h-screen sticky top-0 flex flex-col px-5 py-6 border-r"
      style={{ borderColor: "#EEF1F8" }}
    >
      <div className="flex items-center gap-2.5 font-bold text-lg mb-10 px-2" style={{ ...fontBody, color: COLORS.primary }}>
        <LogoMark size={30} />
        UniHirex
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
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
  );
}