import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { getMyResumes, addResume, updateResume, deleteResume } from "../../../api/resumes";
import { uploadFile } from "../../../api/upload";
import { useAuth } from "../../../context/AuthContext";
import { safeUrl } from "../../../utils/links";

const MAX_RESUMES = 5;
const MAX_FILE_MB = 5;
const inputClass = "w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none";
const inputStyle = { ...fontBody, borderColor: "#D7DEF5" };

export default function ResumesCard() {
  const { token } = useAuth();
  const [resumes, setResumes] = useState(null); // null = still loading
  const [loadError, setLoadError] = useState("");
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState(null);
  const [makeDefault, setMakeDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    getMyResumes(token)
      .then((data) => setResumes(data.resumes))
      .catch((err) => setLoadError(err.message));
  }, [token]);

  const resetForm = () => {
    setAdding(false);
    setLabel("");
    setFile(null);
    setMakeDefault(false);
  };

  // Runs an API call for one resume, then refreshes the list from the response
  const run = async (id, action, successMessage) => {
    setBusyId(id);
    try {
      const data = await action();
      setResumes(data.resumes);
      if (successMessage) toast.success(successMessage);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleAdd = async () => {
    const name = label.trim();
    if (!name) return toast.error("Give this resume a name, for example Full Stack Developer.");
    if (!file) return toast.error("Please choose a file to upload.");

    const ext = file.name.toLowerCase().split(".").pop();
    if (!["pdf", "doc", "docx"].includes(ext)) return toast.error("Resumes must be PDF, DOC or DOCX files.");
    if (file.size > MAX_FILE_MB * 1024 * 1024) return toast.error(`That file is too large. The limit is ${MAX_FILE_MB} MB.`);

    setSaving(true);
    try {
      const url = await uploadFile(file, "resume", token);
      const data = await addResume(
        { label: name, url, fileName: file.name, makeDefault: makeDefault || resumes.length === 0 },
        token
      );
      setResumes(data.resumes);
      toast.success("Resume added");
      resetForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRename = async (id) => {
    const name = renameValue.trim();
    if (!name) return toast.error("The name can't be empty.");
    const ok = await run(id, () => updateResume(id, { label: name }, token), "Resume renamed");
    if (ok) setRenamingId(null);
  };

  const handleDefault = (id) => run(id, () => updateResume(id, { isDefault: true }, token), "Default resume updated");

  const handleDelete = (r) => {
    if (!window.confirm(`Delete "${r.label}"? This removes it from your profile.`)) return;
    run(r._id, () => deleteResume(r._id, token), "Resume deleted");
  };

  const count = resumes ? resumes.length : 0;

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[16px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
          Resumes
        </h3>
        {resumes && !adding && count < MAX_RESUMES && (
          <button onClick={() => setAdding(true)} className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.accent }}>
            + Add Resume
          </button>
        )}
      </div>
      <p className="text-[12.5px] mb-4" style={{ ...fontBody, color: COLORS.textMuted }}>
        Save a resume for each kind of role you apply to, for example Full Stack, DevOps, or Software Engineer. 
        <br/>
        The default one is used when nothing else is chosen. ({count} of {MAX_RESUMES} saved)
      </p>

      {loadError && (
        <p className="text-[13.5px]" style={{ color: "#DC2626" }}>
          {loadError}
        </p>
      )}
      {!resumes && !loadError && (
        <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          Loading...
        </p>
      )}

      {adding && (
        <div className="mb-5 p-4 rounded-xl bg-[#FAFBFE] border border-[#ECEEF3]">
          <p className="text-[13px] font-semibold mb-3" style={{ ...fontBody, color: COLORS.textDark }}>
            New resume
          </p>
          <input
            placeholder="Name, e.g. Full Stack Developer"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={60}
            className={`${inputClass} mb-3`}
            style={inputStyle}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="block w-full text-[13px] mb-3 px-3 py-2 rounded-lg border-[1.5px] border-gray-200 outline-none"
            style={{ ...fontBody, color: COLORS.textMuted }}
          />
          <p className="text-[12px] mb-3" style={{ ...fontBody, color: COLORS.textMuted }}>
            Select PDF up to {MAX_FILE_MB} MB. PDF is needed for the AI Resume Analyzer.
          </p>
          {count > 0 && (
            <label className="flex items-center gap-2 text-[13px] mb-3" style={{ ...fontBody, color: COLORS.textDark }}>
              <input type="checkbox" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} />
              Make this my default resume
            </label>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-4 py-2 rounded-lg font-semibold text-[13.5px] text-white disabled:opacity-60"
              style={{ ...fontBody, background: COLORS.primary }}
            >
              {saving ? "Uploading..." : "Save Resume"}
            </button>
            <button
              onClick={resetForm}
              disabled={saving}
              className="px-4 py-2 rounded-lg font-semibold text-[13.5px]"
              style={{ ...fontBody, color: COLORS.textMuted, background: "#F1F5F9" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {resumes && resumes.length === 0 && !adding && (
        <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          No resumes saved yet.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {(resumes || []).map((r) => {
          const link = safeUrl(r.url);
          const busy = busyId === r._id;
          return (
            <div key={r._id} className="p-4 rounded-xl border border-[#ECEEF3]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  {renamingId === r._id ? (
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        maxLength={60}
                        className="px-3 py-1.5 rounded-lg border-[1.5px] text-[14px] outline-none"
                        style={inputStyle}
                      />
                      <button
                        onClick={() => handleRename(r._id)}
                        disabled={busy}
                        className="text-[13px] font-semibold disabled:opacity-50"
                        style={{ ...fontBody, color: COLORS.primary }}
                      >
                        Save
                      </button>
                      <button onClick={() => setRenamingId(null)} className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-[14.5px] font-semibold mb-0.5" style={{ ...fontBody, color: COLORS.textDark }}>
                      {r.label}
                      {r.isDefault && (
                        <span
                          className="ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full align-middle"
                          style={{ ...fontBody, background: "#E7F7EE", color: "#15803D" }}
                        >
                          Default
                        </span>
                      )}
                    </p>
                  )}
                  <p className="text-[12.5px] truncate" style={{ ...fontBody, color: COLORS.textMuted }}>
                    {r.fileName || "Resume file"}
                    {r.uploadedAt ? ` · Added ${new Date(r.uploadedAt).toLocaleDateString()}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 shrink-0">
                  {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
                      View ↗
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setRenamingId(r._id);
                      setRenameValue(r.label || "");
                    }}
                    disabled={busy}
                    className="text-[13px] font-semibold disabled:opacity-50"
                    style={{ ...fontBody, color: COLORS.primary }}
                  >
                    Rename
                  </button>
                  {!r.isDefault && (
                    <button
                      onClick={() => handleDefault(r._id)}
                      disabled={busy}
                      className="text-[13px] font-semibold disabled:opacity-50"
                      style={{ ...fontBody, color: COLORS.accent }}
                    >
                      Make default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r)}
                    disabled={busy}
                    className="text-[13px] disabled:opacity-50"
                    style={{ ...fontBody, color: "#B91C1C" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}