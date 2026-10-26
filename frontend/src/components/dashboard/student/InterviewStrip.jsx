import React, { useState, useEffect } from "react";
import { COLORS, fontBody } from "../../../theme";
import { toLink } from "../../../utils/links";
import LinkifiedText from "../../LinkifiedText";

const JOIN_WINDOW_MS = 24 * 60 * 60 * 1000; // joining stays open until 24 hours after the interview time

const formatPkt = (ms) =>
  new Date(ms).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });

const pad = (n) => String(n).padStart(2, "0");
const calendarStamp = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

// Opens a pre-filled Google Calendar event. The invitation has no end time, so it assumes one hour.
function calendarUrl(jobTitle, company, invite) {
  const start = new Date(invite.dateTime);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Interview: ${jobTitle || "Job interview"}${company ? ` at ${company}` : ""}`,
    dates: `${calendarStamp(start)}/${calendarStamp(end)}`,
    details: invite.message || "",
    location: invite.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function InterviewStrip({ jobTitle, company, invite }) {
  // Re-checked every minute, so a join button disables itself while the page is open
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const start = new Date(invite.dateTime).getTime();
  const closesAt = start + JOIN_WINDOW_MS;
  const started = now >= start;
  const closed = now > closesAt;
  const link = toLink(invite.location);
  const online = !!link;

  let chip;
  if (online) {
    chip = closed
      ? { label: "Joining closed", bg: "#F1F5F9", color: COLORS.textMuted }
      : started
      ? { label: "Join window open", bg: "#FFF6E5", color: "#B45309" }
      : { label: "Upcoming", bg: "#E7F7EE", color: "#15803D" };
  } else {
    chip = closed || started
      ? { label: "Past", bg: "#F1F5F9", color: COLORS.textMuted }
      : { label: "Upcoming", bg: "#E7F7EE", color: "#15803D" };
  }

  return (
    <div className="basis-full rounded-xl px-4 py-3" style={{ background: closed ? "#F8FAFC" : "#EEF1FC" }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <p className="text-[13px] font-semibold" style={{ ...fontBody, color: closed ? COLORS.textMuted : COLORS.primary }}>
          📅 Interview: {formatPkt(start)} (PKT)
        </p>
        <span
          className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ ...fontBody, background: chip.bg, color: chip.color }}
        >
          {chip.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {online ? (
          closed ? (
            <button
              disabled
              title="Joining closed 24 hours after the interview time"
              className="text-[13px] font-semibold px-3 py-1.5 rounded-lg text-white cursor-not-allowed"
              style={{ ...fontBody, background: "#CBD5E1" }}
            >
              Join meeting
            </button>
          ) : (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold px-3 py-1.5 rounded-lg text-white"
              style={{ ...fontBody, background: COLORS.accent }}
            >
              Join meeting ↗
            </a>
          )
        ) : (
          <span className="text-[13px]" style={{ ...fontBody, color: COLORS.textDark }}>
            📍 {invite.location}
          </span>
        )}

        {!closed && (
          <a
            href={calendarUrl(jobTitle, company, invite)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold"
            style={{ ...fontBody, color: COLORS.primary }}
          >
            Add to Google Calendar ↗
          </a>
        )}
      </div>

      {online && (
        <p className="text-[12px] mt-2" style={{ ...fontBody, color: COLORS.textMuted }}>
          {closed
            ? "The 24-hour joining window for this interview has ended."
            : `Joining closes 24 hours after the interview time (${formatPkt(closesAt)} PKT).`}
        </p>
      )}

      {invite.message && (
        <div className="mt-3 pt-3 border-t border-[#DCE2F3]">
          <p className="text-[12px] font-semibold mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
            Message from the recruiter
          </p>
          <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap" style={{ ...fontBody, color: COLORS.textDark }}>
            <LinkifiedText text={invite.message} />
          </p>
        </div>
      )}
    </div>
  );
}