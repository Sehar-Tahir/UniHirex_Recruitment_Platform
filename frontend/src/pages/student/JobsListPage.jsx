import React, { useState, useEffect } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import JobFilters from "../../components/dashboard/student/JobFilters";
import JobCard from "../../components/dashboard/student/JobCard";
import { getJobs } from "../../api/jobs";

export default function JobsListPage({ mode = "jobs" }) {
  const [filters, setFilters] = useState({ search: "", category: "", type: "", experienceLevel: "", location: "" });
  const [savedIds, setSavedIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSave = (id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const effectiveFilters = { ...filters };
        if (mode === "internships") effectiveFilters.type = "Internship";
        const data = await getJobs(effectiveFilters);
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchJobs, 350);
    return () => clearTimeout(debounce);
  }, [filters, mode]);

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        {mode === "internships" ? "Browse Internships" : "Browse Jobs"}
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Searching..." : `${jobs.length} ${mode === "internships" ? "internships" : "jobs"} found`}
      </p>

      <JobFilters filters={filters} setFilters={setFilters} />

      {error && (
        <p className="text-[14px] text-center py-8" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            id={job._id}
            title={job.title}
            company={job.company}
            location={job.location}
            type={job.type}
            saved={savedIds.includes(job._id)}
            onToggleSave={toggleSave}
          />
        ))}
      </div>

      {!loading && !error && jobs.length === 0 && (
        <p className="text-[14px] text-center py-12" style={{ ...fontBody, color: COLORS.textMuted }}>
          No results match your filters.
        </p>
      )}
    </div>
  );
}