import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { COLORS, fontHead, fontBody } from "../../theme";

export default function StaticPageLayout({ title, subtitle, children }) {
  return (
    <div style={{ ...fontBody, color: COLORS.textDark }}>
      <Navbar />
      <div className="max-w-175 mx-auto px-5 md:px-8 py-20 md:py-24">
        <h1 className="text-3xl md:text-[40px] font-bold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-[15px] mb-10" style={{ color: COLORS.textMuted }}>
            {subtitle}
          </p>
        )}
        <div className="prose-content text-[15px] leading-relaxed" style={{ color: COLORS.textDark }}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}