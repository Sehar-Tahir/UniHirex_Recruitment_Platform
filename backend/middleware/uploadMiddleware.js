const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Determines the Cloudinary folder + allowed file types based on what's being uploaded
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const uploadType = req.params.uploadType;
    const isResume = uploadType === "resume";
    const extension = file.originalname.split(".").pop().toLowerCase();
    const baseName = file.originalname.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-");

    return {
      folder: `unihirex/${uploadType || "misc"}`,
      resource_type: isResume ? "raw" : "image", // resumes (PDF/DOC) need "raw", images need "image"
      allowed_formats: isResume ? ["pdf", "doc", "docx"] : ["jpg", "jpeg", "png", "webp"],
      // For "raw" resource types, Cloudinary needs the extension baked into the
      // public_id itself — the separate "format" option isn't reliably honored for raw files.
      public_id: isResume ? `${Date.now()}-${baseName}.${extension}` : undefined,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;