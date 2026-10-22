
import React from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import LiveCounter from "./LiveCounter";
import { usePublicStats } from "../../hooks/usePublicStats";

const ITEMS = [
  { key: "students", label: "Students on UniHirex" },
  { key: "recruiters", label: "Approved recruiters" },
  { key: "openListings", label: "Open listings" },
  { key: "applications", label: "Applications sent" },
  { key: "interviews", label: "Mock interviews completed" },
  { key: "analyses", label: "Resumes analyzed" },
];

export default function StatsBand() {
  const { status, data } = usePublicStats();

  // If the numbers can't be loaded, hide the band rather than show anything wrong
  if (status === "error") return null;

  // Once loaded, only show stats above zero. While loading, show placeholders.
  const visible = status === "ready" ? ITEMS.filter((i) => data[i.key] > 0) : ITEMS.slice(0, 4);
  if (status === "ready" && visible.length < 2) return null;

  return (
    <section className="py-16" style={{ background: COLORS.textDark }}>
      <div className="max-w-295 mx-auto px-5 md:px-8">
        <div className="text-center mb-10">
          <span className="text-[12px] font-medium tracking-wider uppercase" style={{ ...fontBody, color: COLORS.primaryLight }}>
            Live from the platform
          </span>
          <h2 className="text-2xl md:text-[30px] font-bold text-white mt-2" style={fontHead}>
            UniHirex at a glance
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-x-14 gap-y-10 text-center">
          {visible.map((item) => (
            <div key={item.key} className="min-w-35">
              <div className="text-3xl md:text-[38px] font-bold text-white" style={fontHead}>
                <LiveCounter value={status === "ready" ? data[item.key] : null} />
              </div>
              <div className="text-sm mt-1.5" style={{ ...fontBody, color: "#9AA5BD" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] mt-10" style={{ ...fontBody, color: "#6F7A94" }}>
          Real numbers from the platform, refreshed every few minutes.
        </p>
      </div>
    </section>
  );
}