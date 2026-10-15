import React from "react";
import { COLORS, fontHead, fontBody } from "../../../../theme";

export function Section({ title, subtitle, state, children }) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-[18px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            {subtitle}
          </p>
        )}
      </div>

      {state.loading ? (
        <div className="h-40 rounded-2xl bg-[#F1F5F9] animate-pulse" />
      ) : state.error ? (
        <div className="rounded-2xl border border-[#F3D2D2] bg-[#FBEAEA] p-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13.5px]" style={{ ...fontBody, color: "#B91C1C" }}>
            {state.error}
          </p>
          <button onClick={state.retry} className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
            Retry
          </button>
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export function KpiCard({ label, total, current, previous, isAllTime }) {
  let change = null;
  if (!isAllTime && previous !== null && previous !== undefined) {
    if (previous === 0) change = current > 0 ? { text: "new", up: true } : { text: "no change", up: null };
    else {
      const pct = Math.round(((current - previous) / previous) * 100);
      change = { text: `${pct > 0 ? "▲" : pct < 0 ? "▼" : ""} ${Math.abs(pct)}%`.trim(), up: pct > 0 ? true : pct < 0 ? false : null };
    }
  }

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-5 bg-white">
      <p className="text-[13px] font-medium mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>
        {label}
      </p>
      <p className="text-[28px] font-bold leading-none mb-2" style={{ ...fontHead, color: COLORS.primary }}>
        {current.toLocaleString()}
      </p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          {total.toLocaleString()} total
        </span>
        {change && (
          <span
            className="text-[12px] font-semibold"
            style={{ ...fontBody, color: change.up === true ? "#15803D" : change.up === false ? "#B91C1C" : COLORS.textMuted }}
          >
            {change.text}
          </span>
        )}
      </div>
    </div>
  );
}

export function ChartCard({ title, subtitle, children }) {
  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
      <h3 className="text-[15px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-[12.5px] mb-3" style={{ ...fontBody, color: COLORS.textMuted }}>
          {subtitle}
        </p>
      )}
      <div className={subtitle ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

export function Tile({ label, value, note, tone }) {
  const tones = {
    warn: { bg: "#FFF6E5", color: "#B45309" },
    bad: { bg: "#FBEAEA", color: "#B91C1C" },
    good: { bg: "#E7F7EE", color: "#15803D" },
  };
  const style = tones[tone] || { bg: "#fff", color: COLORS.primary };

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-4" style={{ background: style.bg }}>
      <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
        {label}
      </p>
      <p className="text-[24px] font-bold leading-tight" style={{ ...fontHead, color: style.color }}>
        {value ?? "—"}
      </p>
      {note && (
        <p className="text-[12px] mt-1" style={{ ...fontBody, color: COLORS.textMuted }}>
          {note}
        </p>
      )}
    </div>
  );
}

export function FunnelRow({ label, value, percent, color, note }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
          {label}
        </span>
        <span className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          <strong style={{ color: COLORS.textDark }}>{value.toLocaleString()}</strong>
          {note ? ` · ${note}` : ""}
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value > 0 ? Math.max(percent, 2) : 0}%`, background: color }} />
      </div>
    </div>
  );
}