// Cleans and validates the profile fields students can edit. Anything invalid is rejected with a
// clear message, and nothing here trusts what the browser sent.
const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "Graduated"];

const clean = (v) => (typeof v === "string" ? v.trim() : "");

// Accepts "github.com/me" or "https://github.com/me". Rejects anything that isn't a real web link.
function checkUrl(raw, { host, label }) {
  const value = clean(raw);
  if (!value) return { value: "" };
  if (value.length > 300) return { error: `${label} is too long` };

  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  let url;
  try {
    url = new URL(withScheme);
  } catch {
    return { error: `${label} must be a valid link` };
  }
  if (!url.hostname.includes(".")) return { error: `${label} must be a valid link` };
  if (host && url.hostname !== host && !url.hostname.endsWith(`.${host}`)) {
    return { error: `${label} must be a ${host} link` };
  }
  return { value: url.toString() };
}

// Only fields that are present in `input` are checked and returned.
function sanitizeProfileFields(input) {
  const data = input || {};
  const values = {};
  const fail = (message) => ({ error: message });

  if (data.phone !== undefined) {
    const phone = clean(data.phone);
    if (phone && !/^\+?[\d\s()-]{7,20}$/.test(phone)) return fail("Enter a valid phone number");
    values.phone = phone;
  }

  if (data.university !== undefined) {
    const university = clean(data.university);
    if (university.length > 120) return fail("University name is too long");
    values.university = university;
  }

  if (data.department !== undefined) {
    const department = clean(data.department);
    if (department.length > 120) return fail("Department name is too long");
    values.department = department;
  }

  if (data.semester !== undefined) {
    const semester = clean(data.semester);
    if (semester && !SEMESTERS.includes(semester)) return fail("Please choose a semester from the list");
    values.semester = semester;
  }

  if (data.cgpa !== undefined) {
    const raw = clean(String(data.cgpa ?? ""));
    if (raw) {
      if (!/^\d(\.\d{1,2})?$/.test(raw) || Number(raw) > 4) {
        return fail("CGPA must be a number between 0 and 4.00");
      }
      values.cgpa = Number(raw).toFixed(2);
    } else {
      values.cgpa = "";
    }
  }

  if (data.portfolioUrl !== undefined) {
    const result = checkUrl(data.portfolioUrl, { label: "Portfolio link" });
    if (result.error) return fail(result.error);
    values.portfolioUrl = result.value;
  }

  if (data.socialLinks !== undefined) {
    if (typeof data.socialLinks !== "object" || data.socialLinks === null) return fail("Invalid social links");
    const social = {};

    if (data.socialLinks.linkedin !== undefined) {
      const result = checkUrl(data.socialLinks.linkedin, { host: "linkedin.com", label: "LinkedIn link" });
      if (result.error) return fail(result.error);
      social.linkedin = result.value;
    }
    if (data.socialLinks.github !== undefined) {
      const result = checkUrl(data.socialLinks.github, { host: "github.com", label: "GitHub link" });
      if (result.error) return fail(result.error);
      social.github = result.value;
    }
    values.socialLinks = social;
  }

  if (data.skills !== undefined) {
    if (!Array.isArray(data.skills)) return fail("Skills must be a list");
    const seen = new Set();
    const skills = [];
    for (const item of data.skills) {
      const skill = clean(item).slice(0, 60);
      if (!skill || seen.has(skill.toLowerCase())) continue;
      seen.add(skill.toLowerCase());
      skills.push(skill);
    }
    if (skills.length > 30) return fail("You can add up to 30 skills");
    values.skills = skills;
  }

  if (data.projects !== undefined) {
    if (!Array.isArray(data.projects)) return fail("Projects must be a list");
    if (data.projects.length > 10) return fail("You can add up to 10 projects");

    const projects = [];
    for (const p of data.projects) {
      const title = clean(p?.title);
      if (!title) return fail("Every project needs a title");
      if (title.length > 120) return fail("A project title is too long");

      const github = checkUrl(p?.link, { label: `The GitHub link for "${title}"` });
      if (github.error) return fail(github.error);
      const live = checkUrl(p?.liveLink, { label: `The live link for "${title}"` });
      if (live.error) return fail(live.error);

      projects.push({
        title,
        description: clean(p?.description).slice(0, 500),
        link: github.value,
        liveLink: live.value,
      });
    }
    values.projects = projects;
  }

  return { values };
}

// MongoDB needs "socialLinks.github" style keys so saving one link doesn't wipe the other
function flattenForSet(values) {
  const { socialLinks, ...rest } = values;
  const set = { ...rest };
  if (socialLinks) {
    for (const [key, value] of Object.entries(socialLinks)) set[`socialLinks.${key}`] = value;
  }
  return set;
}

module.exports = { SEMESTERS, sanitizeProfileFields, flattenForSet };