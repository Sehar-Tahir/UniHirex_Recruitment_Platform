import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../../theme";

export default function ResumeCard({ resumeUrl, onChange }) {
  const [fileName, setFileName] = useState(resumeUrl ? "Current Resume.pdf" : null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: upload to Cloudinary in Phase 2, for now just track file name locally
    setFileName(file.name);
    onChange(URL.createObjectURL(file));
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
        style={{ ...fontBody, background: COLORS.accent }}
      >
        {fileName ? "Replace Resume" : "Upload Resume"}
        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  );
}