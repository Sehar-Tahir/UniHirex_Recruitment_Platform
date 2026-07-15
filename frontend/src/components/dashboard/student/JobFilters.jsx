import React from "react";
import { COLORS, fontBody } from "../../../theme";
import { CATEGORIES, TYPES, EXPERIENCE_LEVELS } from "../../../data/mockJobs";

export default function JobFilters({ filters, setFilters }) {
  const handleChange = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });

  const selectStyle = {
    ...fontBody,
    borderColor: "#D7DEF5",
    color: COLORS.textDark,
  };

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-5 bg-white mb-6 flex flex-wrap gap-3 items-center">
      <input
        placeholder="Search by title or company..."
        value={filters.search}
        onChange={handleChange("search")}
        className="flex-1 min-w-55 px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none"
        style={selectStyle}
      />

      <select value={filters.category} onChange={handleChange("category")} className="px-3 py-2.5 rounded-lg border-[1.5px] text-[13.5px] outline-none" style={selectStyle}>
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={filters.type} onChange={handleChange("type")} className="px-3 py-2.5 rounded-lg border-[1.5px] text-[13.5px] outline-none" style={selectStyle}>
        <option value="">All Types</option>
        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select value={filters.experienceLevel} onChange={handleChange("experienceLevel")} className="px-3 py-2.5 rounded-lg border-[1.5px] text-[13.5px] outline-none" style={selectStyle}>
        <option value="">All Levels</option>
        {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>

      <input
        placeholder="Location"
        value={filters.location}
        onChange={handleChange("location")}
        className="w-40 px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none"
        style={selectStyle}
      />
    </div>
  );
}