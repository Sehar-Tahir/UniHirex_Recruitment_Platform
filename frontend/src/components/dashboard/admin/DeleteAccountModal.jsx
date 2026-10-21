import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { getDeletionSummary, deleteUserAccount } from "../../../api/admin";
import { useAuth } from "../../../context/AuthContext";

const plural = (n, word, many) => `${n} ${n === 1 ? word : many || `${word}s`}`;

export default function DeleteAccountModal({ user, onClose, onDeleted }) {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getDeletionSummary(user._id, token)
      .then(setSummary)
      .catch((err) => setLoadError(err.message));
  }, [user._id, token]);

  const matches = typed.trim().toLowerCase() === user.email.toLowerCase();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteUserAccount(user._id, typed.trim(), token);
      const skipped = result.files?.skipped || 0;
      toast.success(
        skipped > 0
          ? `Account deleted. ${plural(skipped, "file")} couldn't be removed from storage.`
          : "Account deleted"
      );
      onDeleted();
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  };

  const items = !summary
    ? []
    : summary.role === "student"
    ? [
        `Their profile, photo and ${plural(summary.counts.resumes, "resume file")}`,
        plural(summary.counts.applications, "job application"),
        `${plural(summary.counts.interviews, "AI interview")} and ${plural(summary.counts.resumeAnalyses, "resume analysis", "resume analyses")}`,
        "Their notifications",
      ]
    : [
        "Their company profile and logo",
        plural(summary.counts.listings, "job listing"),
        `${plural(summary.counts.applications, "application")} from ${plural(summary.counts.applicants, "student")} to those listings (those students will be notified)`,
        "Their notifications",
      ];

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5"
      onClick={deleting ? undefined : onClose}
    >
      <div className="bg-white rounded-2xl p-7 w-full max-w-115" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-[18px] font-bold mb-1" style={{ ...fontHead, color: "#B91C1C" }}>
          Delete account
        </h3>
        <p className="text-[13.5px] mb-5" style={{ ...fontBody, color: COLORS.textMuted }}>
          {user.name} · {user.email}
        </p>

        {loadError ? (
          <p className="text-[13.5px] mb-5" style={{ color: "#DC2626" }}>
            {loadError}
          </p>
        ) : !summary ? (
          <p className="text-[13.5px] py-6 text-center" style={{ ...fontBody, color: COLORS.textMuted }}>
            Checking what will be deleted...
          </p>
        ) : (
          <>
            <p className="text-[13.5px] mb-2" style={{ ...fontBody, color: COLORS.textDark }}>
              This permanently deletes this account and everything linked to it:
            </p>
            <ul className="list-disc pl-5 mb-4">
              {items.map((item) => (
                <li key={item} className="text-[13.5px] mb-1" style={{ ...fontBody, color: COLORS.textDark }}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[13px] font-semibold mb-4" style={{ ...fontBody, color: "#B91C1C" }}>
              This cannot be undone.
            </p>

            <label className="block text-[13px] font-medium mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
              Type <strong>{user.email}</strong> to confirm
            </label>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Account email"
              autoComplete="off"
              className="w-full px-3.5 py-2.5 rounded-lg border-[1.5px] text-[14px] outline-none mb-5"
              style={{ ...fontBody, borderColor: "#D7DEF5" }}
            />
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-lg font-semibold text-[14px]"
            style={{ ...fontBody, color: COLORS.textMuted, background: "#F1F5F9" }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!summary || !matches || deleting}
            className="flex-1 py-2.5 rounded-lg font-semibold text-[14px] text-white disabled:opacity-40"
            style={{ ...fontBody, background: "#B91C1C" }}
          >
            {deleting ? "Deleting..." : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}