import React, { useState } from "react";
import { COLORS, fontBody } from "../../theme";
import Logo from "./Logo";
import Button from "./Button";

const LINKS = [
  { label: "How it works", href: "#how" },
  { label: "For students", href: "#students" },
  { label: "For recruiters", href: "#recruiters" },
  { label: "Features", href: "#features" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#EEF0F4]">
      <div className="max-w-[1180px] mx-auto px-5 md:px-8 h-[76px] flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex gap-9 font-medium text-[15px]" style={{ ...fontBody, color: COLORS.ink }}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="relative py-1.5 group">
              {l.label}
              <span
                className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-200 group-hover:w-full"
                style={{ background: COLORS.burgundy }}
              />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="font-semibold text-[15px]" style={{ color: COLORS.blue }}>
            Sign in
          </a>
          <Button variant="primary">Get started</Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={COLORS.ink} strokeWidth="2">
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
              style={{ color: COLORS.ink }}
            >
              {l.label}
            </a>
          ))}
          <a href="#" className="font-semibold text-[15px]" style={{ color: COLORS.blue }}>
            Sign in
          </a>
          <Button variant="primary" className="w-fit">
            Get started
          </Button>
        </div>
      )}
    </nav>
  );
}
