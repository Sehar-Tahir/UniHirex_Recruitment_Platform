import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import Button from "./Button";
import CheckIcon from "./CheckIcon";

export default function AudienceCard({ id, badge, title, desc, items, ctaLabel, ctaVariant, ctaTo, theme }) {
  const isStudent = theme === "student";
  return (
    <div
      id={id}
      className="rounded-[20px] p-8 md:p-10 relative overflow-hidden border"
      style={{
        background: isStudent ? "linear-gradient(160deg, #EEF1FC, #FFFFFF)" : "linear-gradient(160deg, #F8ECF1, #FFFFFF)",
        borderColor: isStudent ? "#DCE3F7" : "#EFD7E2",
      }}
    >
      <span
        className="inline-block text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded-full mb-5 text-white"
        style={{ ...fontBody, background: isStudent ? COLORS.primary : COLORS.accent }}
      >
        {badge}
      </span>
      <h3 className="text-2xl font-semibold mb-3" style={{ ...fontHead, color: COLORS.textDark }}>
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {desc}
      </p>
      <ul className="mb-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[14.5px] font-medium mb-3"
            style={{ ...fontBody, color: COLORS.textDark }}
          >
            <CheckIcon color={isStudent ? COLORS.primary : COLORS.accent} />
            {item}
          </li>
        ))}
      </ul>
      <Button variant={ctaVariant} to={ctaTo} className="mt-2">
        {ctaLabel}
      </Button>
    </div>
  );
}
