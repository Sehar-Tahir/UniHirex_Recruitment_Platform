const cloudinary = require("../config/cloudinary");

// Turns a stored Cloudinary link into what Cloudinary needs to delete the file.
// Only files in OUR cloud and OUR unihirex/ folders are touched; anything else is skipped.
function parseCloudinaryUrl(raw) {
  try {
    const url = new URL(raw);
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    if (url.hostname !== "res.cloudinary.com" || !cloud) return null;

    const parts = url.pathname.split("/").filter(Boolean); // cloud / resourceType / "upload" / (v123) / ...publicId
    if (parts[0] !== cloud) return null;

    const resourceType = parts[1];
    if (!["image", "raw"].includes(resourceType) || parts[2] !== "upload") return null;

    let rest = parts.slice(3);
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);

    let publicId = decodeURIComponent(rest.join("/"));
    if (!publicId.startsWith("unihirex/")) return null;

    // Images are stored without their file extension in the public id; raw files (resumes) keep it
    if (resourceType === "image") publicId = publicId.replace(/\.[^/.]+$/, "");

    return { publicId, resourceType };
  } catch {
    return null;
  }
}

function collectUserFileUrls(user) {
  return [user.photoUrl, user.logoUrl, user.resumeUrl, ...(user.resumes || []).map((r) => r.url)].filter(Boolean);
}

// Best effort: a failure here never blocks deleting the account
async function deleteUploadedFiles(urls) {
  let removed = 0;
  let skipped = 0;

  for (const raw of new Set(urls)) {
    const target = parseCloudinaryUrl(raw);
    if (!target) {
      skipped++;
      continue;
    }
    try {
      const result = await cloudinary.uploader.destroy(target.publicId, {
        resource_type: target.resourceType,
        invalidate: true,
      });
      if (result.result === "ok") removed++;
      else skipped++;
    } catch {
      skipped++;
    }
  }

  return { removed, skipped };
}

module.exports = { collectUserFileUrls, deleteUploadedFiles };