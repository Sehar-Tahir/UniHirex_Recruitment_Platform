import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { mockCandidates } from "../../data/mockRecruiterData";
import { useSavedCandidates } from "../../hooks/useSavedCandidates";

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedCandidates();

  const candidate = mockCandidates.find((c) => c.id === Number(id));

  if (!candidate) {
    return (
      <p className="text-[14px]" style={{ ...fontBody, color: COLORS.textMuted }}>
        Candidate not found.
      </p>
    );
  }

  return (
    <div className="max-w-180">
      <button
        onClick={() => navigate(-1)}
        className="text-[13.5px] font-semibold mb-6"
        style={{ ...fontBody, color: COLORS.primary }}
      >
        ← Back
      </button>

      <div className="border border-[#ECEEF3] rounded-2xl p-7 bg-white">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-2xl text-white shrink-0"
            style={{ background: COLORS.primary }}
          >
            {candidate.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-[20px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
              {candidate.name}
            </h1>
            <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
              {candidate.department} · {candidate.university} · {candidate.semester} Semester
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>Email</p>
            <p className="text-[14px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>{candidate.email}</p>
          </div>
          <div>
            <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>CGPA</p>
            <p className="text-[14px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>{candidate.cgpa}</p>
          </div>
        </div>

        <h3 className="text-[15px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>Skills</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {candidate.skills.map((s) => (
            <span key={s} className="text-[13px] font-medium px-3 py-1.5 rounded-full" style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}>
              {s}
            </span>
          ))}
        </div>

        <h3 className="text-[15px] font-semibold mb-3" style={{ ...fontHead, color: COLORS.textDark }}>Projects</h3>
        <div className="flex flex-col gap-3 mb-7">
          {candidate.projects.map((p) => (
            <div key={p.id} className="p-4 rounded-xl border border-[#ECEEF3]">
              <p className="text-[14px] font-semibold mb-1" style={{ ...fontBody, color: COLORS.textDark }}>{p.title}</p>
              <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>{p.description}</p>
            </div>
          ))}
        </div>

        {/* <button
          className="px-6 py-3 rounded-lg font-semibold text-[14.5px] text-white"
          style={{ ...fontBody, background: COLORS.accent }}
        >
          Shortlist Candidate
        </button> */}

        <button
          onClick={() => toggleSave(candidate.id)}
          className="px-6 py-3 rounded-lg font-semibold text-[14.5px] text-white"
          style={{ ...fontBody, background: isSaved(candidate.id) ? "#94A3B8" : COLORS.accent }}
        >
          {isSaved(candidate.id) ? "★ Saved" : "☆ Save Candidate"}
        </button>
      </div>
    </div>
  );
}