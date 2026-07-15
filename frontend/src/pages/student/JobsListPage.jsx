import React, { useState, useMemo } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import JobFilters from "../../components/dashboard/student/JobFilters";
import JobCard from "../../components/dashboard/student/JobCard";
import { mockJobs } from "../../data/mockJobs";

export default function JobsListPage({ mode = "jobs" }) {
  const [filters, setFilters] = useState({ search: "", category: "", type: "", experienceLevel: "", location: "" });
  const [savedIds, setSavedIds] = useState([]);

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const baseList = useMemo(() => {
    if (mode === "internships") return mockJobs.filter((j) => j.type === "Internship");
    return mockJobs;
  }, [mode]);

  const filtered = useMemo(() => {
    return baseList.filter((job) => {
      const matchesSearch =
        !filters.search ||
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || job.category === filters.category;
      const matchesType = !filters.type || job.type === filters.type;
      const matchesLevel = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel;
      const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
      return matchesSearch && matchesCategory && matchesType && matchesLevel && matchesLocation;
    });
  }, [baseList, filters]);

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        {mode === "internships" ? "Browse Internships" : "Browse Jobs"}
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {filtered.length} {mode === "internships" ? "internships" : "jobs"} found
      </p>

      <JobFilters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            {...job}
            saved={savedIds.includes(job.id)}
            onToggleSave={toggleSave}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-[14px] text-center py-12" style={{ ...fontBody, color: COLORS.textMuted }}>
          No results match your filters.
        </p>
      )}
    </div>
  );
}