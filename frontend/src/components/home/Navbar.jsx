import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COLORS, fontBody } from "../../theme";
import Logo from "./Logo";
import Button from "./Button";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { label: "How it works", href: "#how" },
  { label: "For students", href: "#students" },
  { label: "For recruiters", href: "#recruiters" },
  // { label: "Features", href: "#features" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#EEF0F4]">
      <div className="max-w-295 mx-auto px-5 md:px-8 h-19 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden md:flex gap-9 font-medium text-[15px]" style={{ ...fontBody, color: COLORS.textDark }}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="relative py-1.5 group">
              {l.label}
              <span
                className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full"
                style={{ background: COLORS.accent }}
              />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                Hi, {user?.name}
              </span>
              <Button variant="primary" to={`/${user?.role}/dashboard`}>Go to Dashboard</Button>
              <button onClick={handleLogout} className="font-semibold text-[14px]" style={{ ...fontBody, color: COLORS.accent }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-semibold text-[15px]" style={{ color: COLORS.primary }}>
                Sign in
              </Link>
              <Button variant="primary" to="/register">Get started</Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={COLORS.textDark} strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4 bg-white border-t border-[#EEF0F4]" style={fontBody}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-medium text-[15px]"
              style={{ color: COLORS.textDark }}
            >
              {l.label}
            </a>
          ))}
          {isAuthenticated ? (
            <>
              <Button variant="primary" className="w-fit" to={`/${user?.role}/dashboard`} onClick={() => setOpen(false)}>
                Go to Dashboard
              </Button>
              <button onClick={handleLogout} className="font-semibold text-[15px] text-left" style={{ color: COLORS.accent }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="font-semibold text-[15px]" style={{ color: COLORS.primary }}>
                Sign in
              </Link>
              <Button variant="primary" className="w-fit" to="/register" onClick={() => setOpen(false)}>
                Get started
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
