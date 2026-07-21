import React, { useState } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { uploadFile } from "../../../api/upload";
import { useAuth } from "../../../context/AuthContext";

export default function ResumeCard({ resumeUrl, onChange }) {
  const { token } = useAuth();
  const [fileName, setFileName] = useState(resumeUrl ? "Current Resume" : null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, "resume", token);
      setFileName(file.name);
      onChange(url);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
      <h3 className="text-[16px] font-semibold mb-4" style={{ ...fontHead, color: COLORS.textDark }}>
        Resume
      </h3>

      {fileName ? (
        <div className="flex items-center justify-between p-4 rounded-xl border border-[#ECEEF3] mb-4">
          <p className="text-[14px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
            📄 {fileName}
          </p>
          <a
            href={resumeUrl}
            download
            className="text-[13px] font-semibold"
            style={{ ...fontBody, color: COLORS.primary }}
          >
            Download
          </a>
        </div>
      ) : (
        <p className="text-[14px] mb-4" style={{ ...fontBody, color: COLORS.textMuted }}>
          No resume uploaded yet.
        </p>
      )}

      <label
        className="inline-block px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white cursor-pointer"
        style={{ ...fontBody, background: uploading ? "#94A3B8" : COLORS.accent }}
      >
        {uploading ? "Uploading..." : fileName ? "Replace Resume" : "Upload Resume"}
        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}