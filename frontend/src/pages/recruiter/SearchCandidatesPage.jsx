import React, { useState, useEffect, useMemo } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import CandidateCard from "../../components/dashboard/recruiter/CandidateCard";
import { getCandidates } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export default function SearchCandidatesPage() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCandidates({ search, skill: skillFilter }, token);
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCandidates, 350);
    return () => clearTimeout(debounce);
  }, [search, skillFilter, token]);

  const allSkills = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => (c.skills || []).forEach((s) => set.add(s)));
    return Array.from(set);
  }, [candidates]);

  const inputStyle = { ...fontBody, borderColor: "#D7DEF5", color: COLORS.textDark };

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
        Search Candidates
      </h1>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Searching..." : `${candidates.length} candidate${candidates.length === 1 ? "" : "s"} found`}
      </p>

      <div className="border border-[#ECEEF3] rounded-2xl p-5 bg-white mb-6 flex flex-wrap gap-3">
        <input
          placeholder="Search by name or university..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-55 px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none"
          style={inputStyle}
        />
        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border-[1.5px] text-[13.5px] outline-none"
          style={inputStyle}
        >
          <option value="">All Skills</option>
          {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && (
        <p className="text-[13.5px] mb-4" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {candidates.map((c) => (
          <CandidateCard
            key={c._id}
            id={c._id}
            name={c.name}
            university={c.university}
            department={c.department}
            skills={c.skills || []}
            cgpa={c.cgpa}
          />
        ))}
      </div>

      {!loading && !error && candidates.length === 0 && (
        <p className="text-[14px] text-center py-12" style={{ ...fontBody, color: COLORS.textMuted }}>
          No candidates match your filters.
        </p>
      )}
    </div>
  );
}