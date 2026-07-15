import React, { useState, useMemo } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import ApplicationRow from "../../components/dashboard/student/ApplicationRow";
import { mockApplications } from "../../data/mockApplications";

const TABS = ["All", "Under Review", "Shortlisted", "Rejected"];

export default function MyApplicationsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = useMemo(() => {
    if (activeTab === "All") return mockApplications;
    return mockApplications.filter((a) => a.status === activeTab);
  }, [activeTab]);

  const countFor = (status) =>
    status === "All" ? mockApplications.length : mockApplications.filter((a) => a.status === status).length;

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        My Applications
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        Track the status of every job and internship you've applied to.
      </p>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-[13.5px] font-semibold transition-colors"
              style={{
                ...fontBody,
                background: active ? COLORS.primary : "#F1F5F9",
                color: active ? "#fff" : COLORS.textMuted,
              }}
            >
              {tab} ({countFor(tab)})
            </button>
          );
        })}
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
        {filtered.length > 0 ? (
          filtered.map((app) => <ApplicationRow key={app.id} {...app} />)
        ) : (
          <p className="text-[14px] text-center py-8" style={{ ...fontBody, color: COLORS.textMuted }}>
            No applications with this status yet.
          </p>
        )}
      </div>
    </div>
  );
}