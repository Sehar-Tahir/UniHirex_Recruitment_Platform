import React, { useState } from "react";
import toast from "react-hot-toast";
import { COLORS, fontBody } from "../theme";
import { requestAiAccess } from "../api/users";
import { useAuth } from "../context/AuthContext";

const NAMES = {
  interviews: { one: "interview", many: "interviews" },
  resumeAnalyses: { one: "resume analysis", many: "resume analyses" },
};

export default function AiQuotaBanner({ feature, quota }) {
  const { token } = useAuth();
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  if (!quota) return null;

  const { limit, remaining } = quota[feature];
  const name = NAMES[feature];
  const noun = (n) => (n === 1 ? name.one : name.many);
  const exhausted = remaining <= 0;

  const message =
    limit === 0
      ? `This feature isn't enabled for your account. Ask an admin for access.`
      : exhausted
      ? `You've used all ${limit} of your ${noun(limit)}.`
      : `You have ${remaining} of ${limit} ${noun(limit)} left.`;

  const handleRequest = async () => {
    setRequesting(true);
    try {
      await requestAiAccess(feature, token);
      setRequested(true);
      toast.success("Request sent to the admin.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div
      className="rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center justify-between gap-3"
      style={{ background: exhausted ? "#FFF6E5" : "#EEF1FC" }}
    >
      <p className="text-[13.5px]" style={{ ...fontBody, color: exhausted ? "#B45309" : COLORS.primary }}>
        {message}
      </p>
      {exhausted && (
        <button
          onClick={handleRequest}
          disabled={requesting || requested}
          className="text-[13px] font-semibold disabled:opacity-60"
          style={{ ...fontBody, color: COLORS.accent }}
        >
          {requested ? "Request sent ✓" : requesting ? "Sending..." : "Request more access"}
        </button>
      )}
    </div>
  );
}