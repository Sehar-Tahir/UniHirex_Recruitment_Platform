import React, { useState, useEffect } from "react";
import { COLORS, fontBody } from "../../../theme";
import { TYPES, EXPERIENCE_LEVELS } from "../../../data/mockJobs";
import { getJobCategories } from "../../../api/jobs";

export default function JobFilters({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getJobCategories().then(setCategories).catch(() => {});
  }, []);

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

      <div className="flex flex-col gap-2">
        <select
          value={categories.includes(filters.category) || filters.category === "" ? filters.category : "__custom__"}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setFilters({ ...filters, category: " " }); // non-empty so the text input shows, trimmed before search anyway
            } else {
              setFilters({ ...filters, category: e.target.value });
            }
          }}
          className="px-3 py-2.5 rounded-lg border-[1.5px] text-[13.5px] outline-none"
          style={selectStyle}
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          <option value="__custom__">Search a specific category...</option>
        </select>
        {!categories.includes(filters.category) && filters.category !== "" && (
          <input
            value={filters.category.trim()}
            onChange={handleChange("category")}
            placeholder="Type a category"
            className="px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none"
            style={selectStyle}
          />
        )}
      </div>

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

      <input
        type="number"
        placeholder="Minimum salary (PKR)"
        value={filters.minSalary}
        onChange={handleChange("minSalary")}
        className="w-45 px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none"
        style={selectStyle}
      />
    </div>
  );
}