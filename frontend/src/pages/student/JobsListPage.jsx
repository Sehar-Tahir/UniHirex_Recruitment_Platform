import React, { useState, useEffect } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import toast from "react-hot-toast";
import JobFilters from "../../components/dashboard/student/JobFilters";
import JobCard from "../../components/dashboard/student/JobCard";
import { getJobs } from "../../api/jobs";
import { toggleSavedJob, getMyProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../../components/Pagination";

export default function JobsListPage({ mode = "jobs" }) {
  const { token } = useAuth();
  const [filters, setFilters] = useState({ search: "", category: "", type: "", experienceLevel: "", location: "", minSalary: "", maxSalary: "" });
  const [savedIds, setSavedIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const profile = await getMyProfile(token);
        setSavedIds(profile.savedJobs || []);
      } catch {
        // silently ignore — saved-state is a nice-to-have, not critical path
      }
    };
    fetchSaved();
  }, [token]);

  const toggleSave = async (id) => {
    const wasSaved = savedIds.includes(id);
    setSavedIds((prev) => (wasSaved ? prev.filter((x) => x !== id) : [...prev, id]));
    try {
      await toggleSavedJob(id, token);
      toast.success(wasSaved ? "Removed from saved jobs" : "Job saved");
    } catch {
      // revert on failure
      setSavedIds((prev) => (wasSaved ? [...prev, id] : prev.filter((x) => x !== id)));
      toast.error("Something went wrong, please try again");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const effectiveFilters = { ...filters, page };
        if (mode === "internships") effectiveFilters.type = "Internship";
        const result = await getJobs(effectiveFilters);
        setJobs(result.data);
        setTotalPages(result.totalPages);
        setTotalJobs(result.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchJobs, 350);
    return () => clearTimeout(debounce);
  }, [filters, mode, page]);

  // Reset to page 1 whenever filters change — otherwise you could be stuck on
  // "page 4" of a filtered result set that only has 1 page
  useEffect(() => {
    setPage(1);
  }, [filters, mode]);

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        {mode === "internships" ? "Browse Internships" : "Browse Jobs"}
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Searching..." : `${totalJobs} ${mode === "internships" ? "internships" : "jobs"} found`}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}