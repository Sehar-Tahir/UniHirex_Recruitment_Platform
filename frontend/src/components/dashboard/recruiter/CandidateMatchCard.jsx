import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { getCandidateMatchScore } from "../../../api/applications";
import { useAuth } from "../../../context/AuthContext";
import MatchScoreBadge from "../../MatchScoreBadge";

export default function CandidateMatchCard({ applicationId }) {
  const { token } = useAuth();
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [score, setScore] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setStatus("loading");
    setError("");
    try {
      const result = await getCandidateMatchScore(applicationId, token);
      setScore(result.matchScore);
      setExplanation(result.explanation);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
            AI fit score
          </h3>
          <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            Compares this applicant's skills with the listing's requirements. It's a guide only. The decision is yours.
          </p>
        </div>
        {(status === "idle" || status === "error") && (
          <button
            onClick={handleCheck}
            className="px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white whitespace-nowrap"
            style={{ ...fontBody, background: COLORS.accent }}
          >
            ✨ Check AI Match
          </button>
        )}
      </div>

      {(status === "loading" || status === "done") && (
        <div className="mt-4">
          <MatchScoreBadge loading={status === "loading"} score={score} explanation={explanation} />
        </div>
      )}

      {status === "error" && (
        <p className="text-[13px] mt-3" style={{ ...fontBody, color: "#B91C1C" }}>
          {error || "Couldn't compute the match right now."}
        </p>
      )}
    </div>
  );
}