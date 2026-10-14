const mammoth = require("mammoth");

// Downloads the student's resume and works out what kind of file it really is by
// looking at its first bytes (older uploads may have no file extension at all).
async function getResumeContent(resumeUrl) {
  let buffer;
  try {
    const response = await fetch(resumeUrl);
    if (!response.ok) throw new Error(`status ${response.status}`);
    buffer = Buffer.from(await response.arrayBuffer());
  } catch {
    throw new Error("We couldn't download your resume file. Please re-upload it on your profile and try again.");
  }

  // PDF files always start with "%PDF"
  if (buffer.length > 4 && buffer.subarray(0, 4).toString("latin1") === "%PDF") {
    return { kind: "pdf", base64: buffer.toString("base64") };
  }

  // A .docx file is a zip archive, which always starts with the letters "PK"
  if (buffer.length > 2 && buffer[0] === 0x50 && buffer[1] === 0x4b) {
    try {
      const { value } = await mammoth.extractRawText({ buffer });
      if (value && value.trim().length >= 50) return { kind: "text", text: value };
    } catch {
      // fall through to the error below
    }
    throw new Error("We couldn't read any text from your document. Please upload a PDF version instead.");
  }

  throw new Error("Unsupported resume format. Please upload your resume as a PDF or DOCX file.");
}

module.exports = getResumeContent;