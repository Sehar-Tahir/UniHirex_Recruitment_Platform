const MAX_RESUMES = 5;
const LEGACY_LABEL = "My Resume";

const cleanLabel = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 60);

// Only accept files uploaded to OUR Cloudinary account, in the resume folder.
// This stops a student from saving an arbitrary link that recruiters would then click.
function isOwnResumeUrl(raw) {
  try {
    const url = new URL(raw);
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      !!cloud &&
      url.pathname.startsWith(`/${cloud}/`) &&
      url.pathname.includes("/unihirex/resume/")
    );
  } catch {
    return false;
  }
}

// Older accounts only have a single resumeUrl. Turn it into the first entry of their resume list.
async function migrateLegacyResume(user) {
  if (user.resumeUrl && user.resumes.length === 0) {
    user.resumes.push({ label: LEGACY_LABEL, url: user.resumeUrl, isDefault: true });
    await user.save();
  }
}

// Keeps exactly one default resume, and keeps resumeUrl pointing at it
function syncDefault(user) {
  if (user.resumes.length > 0 && !user.resumes.some((r) => r.isDefault)) {
    user.resumes[0].isDefault = true;
  }
  const def = user.resumes.find((r) => r.isDefault);
  user.resumeUrl = def ? def.url : "";
}

const view = (user) => ({ resumes: user.resumes, resumeUrl: user.resumeUrl });

const labelTaken = (user, label, exceptId) =>
  user.resumes.some(
    (r) => (!exceptId || r._id.toString() !== exceptId) && (r.label || "").toLowerCase() === label.toLowerCase()
  );

// @route  GET /api/users/me/resumes   (student only)
const listResumes = async (req, res) => {
  try {
    await migrateLegacyResume(req.user);
    res.json(view(req.user));
  } catch (err) {
    res.status(500).json({ message: "Failed to load resumes", error: err.message });
  }
};

// @route  POST /api/users/me/resumes   body: { label, url, fileName?, makeDefault? }
const addResume = async (req, res) => {
  try {
    const user = req.user;
    await migrateLegacyResume(user);

    if (user.resumes.length >= MAX_RESUMES) {
      return res.status(400).json({ message: `You can save up to ${MAX_RESUMES} resumes. Delete one to add another.` });
    }

    const label = cleanLabel(req.body.label);
    if (!label) {
      return res.status(400).json({ message: "Please give this resume a name, for example Full Stack Developer." });
    }
    if (labelTaken(user, label)) {
      return res.status(400).json({ message: "You already have a resume with that name. Please choose a different one." });
    }

    const url = String(req.body.url || "").trim();
    if (url.length > 500 || !isOwnResumeUrl(url)) {
      return res.status(400).json({ message: "That file couldn't be verified. Please upload it again." });
    }

    const makeDefault = user.resumes.length === 0 || req.body.makeDefault === true;
    if (makeDefault) user.resumes.forEach((r) => (r.isDefault = false));

    user.resumes.push({
      label,
      url,
      fileName: String(req.body.fileName || "").trim().slice(0, 150),
      isDefault: makeDefault,
    });
    syncDefault(user);
    await user.save();

    res.status(201).json(view(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to add resume", error: err.message });
  }
};

// @route  PATCH /api/users/me/resumes/:resumeId   body: { label?, isDefault? }
const updateResume = async (req, res) => {
  try {
    const user = req.user;
    await migrateLegacyResume(user);

    const resume = user.resumes.id(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    if (req.body.label !== undefined) {
      const label = cleanLabel(req.body.label);
      if (!label) return res.status(400).json({ message: "The name can't be empty." });
      if (labelTaken(user, label, resume._id.toString())) {
        return res.status(400).json({ message: "You already have a resume with that name." });
      }
      resume.label = label;
    }

    if (req.body.isDefault === true) {
      user.resumes.forEach((r) => (r.isDefault = false));
      resume.isDefault = true;
    }

    syncDefault(user);
    await user.save();
    res.json(view(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to update resume", error: err.message });
  }
};

// @route  DELETE /api/users/me/resumes/:resumeId
const deleteResume = async (req, res) => {
  try {
    const user = req.user;
    await migrateLegacyResume(user);

    const resume = user.resumes.id(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    user.resumes.pull(resume._id);
    syncDefault(user); // if the default was deleted, the first remaining resume becomes the default
    await user.save();

    res.json(view(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to delete resume", error: err.message });
  }
};

module.exports = { listResumes, addResume, updateResume, deleteResume };