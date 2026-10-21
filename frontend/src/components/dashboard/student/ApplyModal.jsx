import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../../theme";
import { getMyProfile } from "../../../api/users";
import { getMyResumes } from "../../../api/resumes";
import { applyToJob } from "../../../api/applications";
import { useAuth } from "../../../context/AuthContext";
import { checkLink, safeUrl } from "../../../utils/links";
import { SEMESTERS, UNIVERSITIES, DEPARTMENTS } from "../../../data/profileOptions";
import SelectWithOther from "../../SelectWithOther";

const MAX_SKILLS = 30;
const inputClass = "w-full px-3 py-2 rounded-lg border-[1.5px] text-[14px] outline-none";
const inputStyle = (hasError) => ({ ...fontBody, borderColor: hasError ? "#DC2626" : "#D7DEF5" });

function Group({ title, hint, children }) {
  return (
    <div className="mb-7">
      <h4 className="text-[14.5px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
        {title}
      </h4>
      {hint && (
        <p className="text-[12.5px] mt-0.5" style={{ ...fontBody, color: COLORS.textMuted }}>
          {hint}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Label({ children }) {
  return (
    <p className="text-[12.5px] font-medium mb-1" style={{ ...fontBody, color: COLORS.textMuted }}>
      {children}
    </p>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-[12.5px] mt-1" style={{ color: "#DC2626" }}>
      {message}
    </p>
  );
}

function Check({ checked, onChange, children, className = "" }) {
  return (
    <label className={`flex items-start gap-2.5 text-[13.5px] ${className}`} style={{ ...fontBody, color: COLORS.textDark }}>
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-1 shrink-0" />
      <span>{children}</span>
    </label>
  );
}

export default function ApplyModal({ job, onClose, onApplied }) {
  const { token } = useAuth();
  const bodyRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getMyProfile(token), getMyResumes(token)])
      .then(([p, r]) => {
        const defaultResume = r.resumes.find((x) => x.isDefault) || r.resumes[0];
        setProfile(p);
        setResumes(r.resumes);
        setForm({
          name: p.name || "",
          phone: p.phone || "",
          sharePhone: false,
          university: p.university || "",
          department: p.department || "",
          semester: SEMESTERS.includes(p.semester) ? p.semester : "",
          cgpa: p.cgpa || "",
          portfolioUrl: p.portfolioUrl || "",
          linkedin: p.socialLinks?.linkedin || "",
          github: p.socialLinks?.github || "",
          skills: p.skills || [],
          projectIds: (p.projects || []).map((x) => x._id),
          certificationIds: (p.certifications || []).map((x) => x._id),
          resumeId: defaultResume ? defaultResume._id : "",
          coverNote: "",
          saveToProfile: false,
          consent: false,
        });
      })
      .catch((err) => setLoadError(err.message));
  }, [token]);

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleText = (key) => (e) => set(key)(e.target.value);

  const toggleId = (key, id) =>
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id],
    }));

  // Only allow a valid CGPA to be typed: one digit, then up to two decimals
  const handleCgpa = (e) => {
    const v = e.target.value;
    if (v === "" || /^\d?(\.\d{0,2})?$/.test(v)) set("cgpa")(v);
  };

  const addSkill = () => {
    const skill = skillInput.trim().slice(0, 60);
    if (!skill) return;
    if (!form.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      if (form.skills.length >= MAX_SKILLS) {
        toast.error(`You can share up to ${MAX_SKILLS} skills.`);
        return;
      }
      set("skills")([...form.skills, skill]);
    }
    setSkillInput("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";

    const phone = form.phone.trim();
    if (phone && !/^\+?[\d\s()-]{7,20}$/.test(phone)) errs.phone = "Enter a valid phone number";
    else if (form.sharePhone && !phone) errs.phone = "Add a phone number, or untick sharing it";

    if (form.cgpa && (!/^\d(\.\d{1,2})?$/.test(form.cgpa) || Number(form.cgpa) > 4)) {
      errs.cgpa = "CGPA must be between 0 and 4.00";
    }

    const portfolio = checkLink(form.portfolioUrl, { label: "Portfolio link" });
    const linkedin = checkLink(form.linkedin, { host: "linkedin.com", label: "LinkedIn link" });
    const github = checkLink(form.github, { host: "github.com", label: "GitHub link" });
    if (portfolio.error) errs.portfolioUrl = portfolio.error;
    if (linkedin.error) errs.linkedin = linkedin.error;
    if (github.error) errs.github = github.error;

    return { errs, links: { portfolio: portfolio.value, linkedin: linkedin.value, github: github.value } };
  };

  const handleSubmit = async () => {
    const { errs, links } = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted fields.");
      bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      await applyToJob(
        job._id,
        {
          name: form.name.trim(),
          phone: form.phone.trim(),
          sharePhone: form.sharePhone,
          university: form.university.trim(),
          department: form.department.trim(),
          semester: form.semester,
          cgpa: form.cgpa,
          portfolioUrl: links.portfolio,
          socialLinks: { linkedin: links.linkedin, github: links.github },
          skills: form.skills,
          projectIds: form.projectIds,
          certificationIds: form.certificationIds,
          resumeId: form.resumeId || null,
          coverNote: form.coverNote.trim(),
          saveToProfile: form.saveToProfile,
          consent: form.consent,
        },
        token
      );
      toast.success("Application submitted successfully!");
      onApplied();
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  const selectedResume = form ? resumes.find((r) => r._id === form.resumeId) : null;
  const selectedResumeLink = selectedResume ? safeUrl(selectedResume.url) : null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-170 max-h-[90vh] flex flex-col">
        <div className="px-7 pt-6 pb-4 border-b border-[#F1F3F9] flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
              Apply to {job.title}
            </h3>
            <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
              {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-[22px] leading-none disabled:opacity-40"
            style={{ color: COLORS.textMuted }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div ref={bodyRef} className="px-7 py-5 overflow-y-auto">
          {loadError ? (
            <p className="text-[14px] py-8 text-center" style={{ color: "#DC2626" }}>
              {loadError}
            </p>
          ) : !form ? (
            <p className="text-[14px] py-8 text-center" style={{ ...fontBody, color: COLORS.textMuted }}>
              Loading your details...
            </p>
          ) : (
            <>
              <div className="rounded-xl px-4 py-3 mb-6" style={{ background: "#EEF1FC" }}>
                <p className="text-[13px]" style={{ ...fontBody, color: COLORS.primary }}>
                  This is what {job.company} will receive. You can change anything below, and the changes apply to this
                  application only unless you choose to save them to your profile.
                </p>
              </div>

              <Group title="Your details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full name</Label>
                    <input
                      value={form.name}
                      onChange={handleText("name")}
                      maxLength={100}
                      className={inputClass}
                      style={inputStyle(errors.name)}
                    />
                    <FieldError message={errors.name} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-[14.5px] font-medium py-2" style={{ ...fontBody, color: COLORS.textDark }}>
                      {profile.email}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Phone (optional)</Label>
                    <input
                      value={form.phone}
                      onChange={handleText("phone")}
                      maxLength={20}
                      placeholder="e.g. 03XX XXXXXXX"
                      className={inputClass}
                      style={inputStyle(errors.phone)}
                    />
                    <FieldError message={errors.phone} />
                    <Check
                      checked={form.sharePhone}
                      onChange={(e) => set("sharePhone")(e.target.checked)}
                      className="mt-2"
                    >
                      Share my phone number with the recruiter. If unticked, they won't see it.
                    </Check>
                  </div>
                </div>
              </Group>

              <Group title="Education">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>University</Label>
                    <SelectWithOther
                      value={form.university}
                      onChange={set("university")}
                      options={UNIVERSITIES}
                      otherPlaceholder="Type your university name"
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <SelectWithOther
                      value={form.department}
                      onChange={set("department")}
                      options={DEPARTMENTS}
                      otherPlaceholder="Type your department name"
                    />
                  </div>
                  <div>
                    <Label>Semester</Label>
                    <select
                      value={form.semester}
                      onChange={handleText("semester")}
                      className={`${inputClass} bg-white`}
                      style={inputStyle(false)}
                    >
                      <option value="">Select...</option>
                      {SEMESTERS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>CGPA (out of 4.00)</Label>
                    <input
                      value={form.cgpa}
                      onChange={handleCgpa}
                      inputMode="decimal"
                      placeholder="e.g. 3.50"
                      className={inputClass}
                      style={inputStyle(errors.cgpa)}
                    />
                    <FieldError message={errors.cgpa} />
                  </div>
                </div>
              </Group>

              <Group title="Links">
                <div className="flex flex-col gap-3">
                  {[
                    ["portfolioUrl", "Portfolio website", "https://yourname.com"],
                    ["linkedin", "LinkedIn", "https://linkedin.com/in/your-name"],
                    ["github", "GitHub", "https://github.com/your-username"],
                  ].map(([key, label, placeholder]) => (
                    <div key={key}>
                      <Label>{label}</Label>
                      <input
                        value={form[key]}
                        onChange={handleText(key)}
                        maxLength={300}
                        placeholder={placeholder}
                        className={inputClass}
                        style={inputStyle(errors[key])}
                      />
                      <FieldError message={errors[key]} />
                    </div>
                  ))}
                </div>
              </Group>

              <Group title="Skills" hint="Add or remove skills for this application.">
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.skills.length === 0 && (
                    <span className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                      No skills added.
                    </span>
                  )}
                  {form.skills.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-2 text-[13px] font-medium px-3 py-1.5 rounded-full"
                      style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => set("skills")(form.skills.filter((x) => x !== s))}
                        className="text-[15px] leading-none"
                        aria-label={`Remove ${s}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    maxLength={60}
                    placeholder="Add a skill and press Enter"
                    className={inputClass}
                    style={inputStyle(false)}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 rounded-lg font-semibold text-[13.5px] text-white whitespace-nowrap"
                    style={{ ...fontBody, background: COLORS.primary }}
                  >
                    Add
                  </button>
                </div>
              </Group>

              {(profile.projects || []).length > 0 && (
                <Group title="Projects to include" hint="Untick any project you don't want to show for this job.">
                  {profile.projects.map((p) => (
                    <Check
                      key={p._id}
                      checked={form.projectIds.includes(p._id)}
                      onChange={() => toggleId("projectIds", p._id)}
                      className="mb-2"
                    >
                      <strong>{p.title}</strong>
                      {p.description ? ` - ${p.description}` : ""}
                    </Check>
                  ))}
                </Group>
              )}

              {(profile.certifications || []).length > 0 && (
                <Group title="Certifications to include">
                  {profile.certifications.map((c) => (
                    <Check
                      key={c._id}
                      checked={form.certificationIds.includes(c._id)}
                      onChange={() => toggleId("certificationIds", c._id)}
                      className="mb-2"
                    >
                      <strong>{c.name}</strong>
                      {c.issuer ? ` - ${c.issuer}` : ""}
                      {c.year ? ` (${c.year})` : ""}
                    </Check>
                  ))}
                </Group>
              )}

              <Group title="Resume" hint="Choose which resume to send with this application.">
                {resumes.length === 0 ? (
                  <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                    You haven't saved a resume yet, so this application will go without one.{" "}
                    <a
                      href="/student/profile"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline"
                      style={{ color: COLORS.primary }}
                    >
                      Add one on your profile
                    </a>{" "}
                    (opens in a new tab, so you won't lose this form).
                  </p>
                ) : (
                  <>
                    <select
                      value={form.resumeId}
                      onChange={handleText("resumeId")}
                      className={`${inputClass} bg-white mb-2`}
                      style={inputStyle(false)}
                    >
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.label}
                          {r.isDefault ? " (default)" : ""}
                        </option>
                      ))}
                      <option value="">Don't attach a resume</option>
                    </select>
                    {selectedResumeLink && (
                      <a
                        href={selectedResumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-semibold"
                        style={{ ...fontBody, color: COLORS.primary }}
                      >
                        📄 Preview this resume ↗
                      </a>
                    )}
                  </>
                )}
              </Group>

              <Group title="Cover note (optional)">
                <textarea
                  value={form.coverNote}
                  onChange={handleText("coverNote")}
                  maxLength={1000}
                  rows={4}
                  placeholder="Tell the recruiter why you're a good fit"
                  className={`${inputClass} resize-none`}
                  style={inputStyle(false)}
                />
                <p className="text-[11.5px] text-right mt-1" style={{ ...fontBody, color: COLORS.textMuted }}>
                  {form.coverNote.length}/1000
                </p>
              </Group>

              <div className="rounded-xl p-4" style={{ background: "#FAFBFE", border: "1px solid #ECEEF3" }}>
                <Check
                  checked={form.saveToProfile}
                  onChange={(e) => set("saveToProfile")(e.target.checked)}
                  className="mb-3"
                >
                  Also save these changes to my profile (name, phone, education, links and skills).
                </Check>
                <Check checked={form.consent} onChange={(e) => set("consent")(e.target.checked)}>
                  <strong>I understand</strong> that the details above will be shared with {job.company} and its
                  recruiters for this application.
                </Check>
              </div>
            </>
          )}
        </div>

        <div className="px-7 py-4 border-t border-[#F1F3F9] flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3 rounded-lg font-semibold text-[14px] disabled:opacity-50"
            style={{ ...fontBody, color: COLORS.textMuted, background: "#F1F5F9" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form || submitting || !form.consent}
            className="flex-1 py-3 rounded-lg font-semibold text-[14px] text-white disabled:opacity-50"
            style={{ ...fontBody, background: COLORS.accent }}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}