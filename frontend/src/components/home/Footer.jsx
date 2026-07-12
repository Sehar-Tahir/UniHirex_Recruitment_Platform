import React from "react";
import { fontHead, fontBody } from "../../theme";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      ["How it works", "#how"],
      ["For students", "#students"],
      ["For recruiters", "#recruiters"],
      ["Features", "#features"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#"],
      ["Careers", "#"],
      ["Contact", "#"],
      ["Blog", "#"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy policy", "#"],
      ["Terms of service", "#"],
      ["Cookie policy", "#"],
    ],
  },
];

const SOCIALS = [
  {
    name: "linkedin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.34 18.34V9.83H5.67v8.51zM7 8.62a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18.34v-4.7c0-2.52-1.35-3.69-3.15-3.69a2.72 2.72 0 0 0-2.46 1.35h-.04V9.83H10v8.51h2.67v-4.21c0-1.11.21-2.19 1.59-2.19s1.41 1.27 1.41 2.26v4.14z" />
      </svg>
    ),
  },
  {
    name: "twitter",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 5.92a8.2 8.2 0 0 1-2.36.65 4.07 4.07 0 0 0 1.8-2.27 8.2 8.2 0 0 1-2.6 1 4.1 4.1 0 0 0-7 3.74A11.65 11.65 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.27 5.47A4.07 4.07 0 0 1 2.8 9.6v.05a4.1 4.1 0 0 0 3.29 4 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.22 8.22 0 0 1 2 18.4a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.53A8.18 8.18 0 0 0 22 5.92z" />
      </svg>
    ),
  },
  {
    name: "instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "github",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.36 1.08 2.94.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="pt-16 pb-7" style={{ background: "#15192B", color: "#9AA5BD" }}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 mb-12">
          <div>
            <div className="mb-3.5">
              <Logo dark />
            </div>
            <p className="text-sm leading-relaxed max-w-[280px]" style={fontBody}>
              Connecting university students with recruiters, internships, and career opportunities — one profile
              at a time.
            </p>
            <div className="flex gap-2.5 mt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h5 className="text-white text-sm font-semibold mb-4" style={fontHead}>
                {col.title}
              </h5>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label} className="text-sm" style={fontBody}>
                    <a href={href} className="hover:text-white transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex justify-between flex-wrap gap-2.5 text-[13px]" style={fontBody}>
          <span>© {new Date().getFullYear()} UniHirex. All rights reserved.</span>
          <span>Made for the next generation of campus talent.</span>
        </div>
      </div>
    </footer>
  );
}
