import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { getUserAiQuota, updateUserAiLimits } from "../../../api/admin";
import { useAuth } from "../../../context/AuthContext";

export default function AiAccessModal({ user, onClose }) {
  const { token } = useAuth();
  const [quota, setQuota] = useState(null);
  const [limits, setLimits] = useState({ interviews: "", resumeAnalyses: "" });
  const [resetUsage, setResetUsage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserAiQuota(user._id, token)
      .then((q) => {
        setQuota(q);
        setLimits({ interviews: q.interviews.limit, resumeAnalyses: q.resumeAnalyses.limit });
      })
      .catch((err) => toast.error(err.message));
  }, [user._id, token]);

  const handleSave = async () => {
    const interviews = Number(limits.interviews);
    const resumeAnalyses = Number(limits.resumeAnalyses);
    const bad = (n) => !Number.isInteger(n) || n < 0 || n > 50;
    if (bad(interviews) || bad(resumeAnalyses)) {
      toast.error("Limits must be whole numbers from 0 to 50.");
      return;
    }

    setSaving(true);
    try {
      await updateUserAiLimits(user._id, { interviews, resumeAnalyses, resetUsage }, token);
      toast.success("AI access updated");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    ["interviews", "AI Interviews"],
    ["resumeAnalyses", "Resume Analyses"],
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-full max-w-105" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
          AI Access
        </h3>
        <p className="text-[13.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
          {user.name} · {user.email}
        </p>

        {!quota ? (
          <p className="text-[13.5px] py-6 text-center" style={{ ...fontBody, color: COLORS.textMuted }}>
            Loading...
          </p>
        ) : (
          <>
            {rows.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[14px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
                    {label}
                  </p>
                  <p className="text-[12.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                    Used {quota[key].used} of {quota[key].limit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                    Limit
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={limits[key]}
                    onChange={(e) => setLimits({ ...limits, [key]: e.target.value })}
                    className="w-20 px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none"
                    style={{ ...fontBody, borderColor: "#D7DEF5" }}
                  />
                </div>
              </div>
            ))}

            <label className="flex items-center gap-2.5 text-[13.5px] mb-6" style={{ ...fontBody, color: COLORS.textDark }}>
              <input type="checkbox" checked={resetUsage} onChange={(e) => setResetUsage(e.target.checked)} />
              Also reset their usage counts to 0
            </label>
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg font-semibold text-[14px]"
            style={{ ...fontBody, color: COLORS.textMuted, background: "#F1F5F9" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !quota}
            className="flex-1 py-2.5 rounded-lg font-semibold text-[14px] text-white disabled:opacity-60"
            style={{ ...fontBody, background: COLORS.accent }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}