import React from "react";
import { COLORS, fontBody } from "../theme";
import { safeUrl } from "../utils/links";

const linkStyle = { ...fontBody, color: COLORS.primary };

export function ProfileLinkButtons({ portfolioUrl, socialLinks }) {
  const items = [
    ["Portfolio", safeUrl(portfolioUrl)],
    ["LinkedIn", safeUrl(socialLinks?.linkedin)],
    ["GitHub", safeUrl(socialLinks?.github)],
  ].filter(([, url]) => url);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {items.map(([label, url]) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full border"
          style={{ ...linkStyle, borderColor: "#D7DEF5" }}
        >
          {label} ↗
        </a>
      ))}
    </div>
  );
}

export function ProjectLinks({ project }) {
  const github = safeUrl(project.link);
  const live = safeUrl(project.liveLink);
  if (!github && !live) return null;

  return (
    <div className="flex gap-4 mt-2">
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" className="text-[12.5px] font-semibold" style={linkStyle}>
          GitHub ↗
        </a>
      )}
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" className="text-[12.5px] font-semibold" style={linkStyle}>
          Live demo ↗
        </a>
      )}
    </div>
  );
}