import React from "react";
import { COLORS } from "../theme";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

export default function LinkifiedText({ text }) {
  // Splitting on a pattern with a capture group puts the matched links at the odd positions
  const parts = String(text || "").split(URL_PATTERN);

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <React.Fragment key={i}>{part}</React.Fragment>;

        const trailing = part.match(/[.,;:!?)]+$/)?.[0] || "";
        const url = trailing ? part.slice(0, -trailing.length) : part;

        return (
          <React.Fragment key={i}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: COLORS.primary, textDecoration: "underline", wordBreak: "break-all" }}
            >
              {url}
            </a>
            {trailing}
          </React.Fragment>
        );
      })}
    </>
  );
}