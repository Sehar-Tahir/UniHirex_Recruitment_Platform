import React from "react";
import { COLORS, fontBody } from "../theme";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // For many pages, only show a window around the current page to avoid a huge row of numbers
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg text-[13.5px] font-semibold disabled:opacity-40"
        style={{ ...fontBody, color: COLORS.textMuted }}
      >
        ← Prev
      </button>

      {visiblePages.map((p, i) => {
        const prevPage = visiblePages[i - 1];
        const showEllipsis = prevPage && p - prevPage > 1;
        return (
          <React.Fragment key={p}>
            {showEllipsis && <span className="px-1 text-[13.5px]" style={{ color: COLORS.textMuted }}>…</span>}
            <button
              onClick={() => onPageChange(p)}
              className="w-9 h-9 rounded-lg text-[13.5px] font-semibold"
              style={{
                ...fontBody,
                background: p === page ? COLORS.primary : "transparent",
                color: p === page ? "#fff" : COLORS.textMuted,
              }}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-lg text-[13.5px] font-semibold disabled:opacity-40"
        style={{ ...fontBody, color: COLORS.textMuted }}
      >
        Next →
      </button>
    </div>
  );
}