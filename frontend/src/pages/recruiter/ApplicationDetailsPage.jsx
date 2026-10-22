import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getApplicationById, updateApplicationStatus } from "../../api/applications";
import { useAuth } from "../../context/AuthContext";
import { safeUrl } from "../../utils/links";
import Avatar from "../../components/Avatar";
import { ProfileLinkButtons, ProjectLinks } from "../../components/ProfileLinks";
import InterviewInviteSection from "../../components/dashboard/recruiter/InterviewInviteSection";

const STATUS_STYLES = {
  "Under Review": { bg: "#FFF6E5", color: "#B45309" },
  Shortlisted: { bg: "#E7F7EE", color: "#15803D" },
  Rejected: { bg: "#FBEAEA", color: "#B91C1C" },
};

function Card({ title, children }) {
  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-5">
      <h3 className="text-[15px] font-semibold mb-3" style={{ ...fontHead, color: COLORS.textDark }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div>
      <p className="text-[12.5px] font-medium mb-0.5" style={{ ...fontBody, color: COLORS.textMuted }}>
        {label}
      </p>
      <p className="text-[14.5px] font-medium" style={{ ...fontBody, color: COLORS.textDark }}>
        {children || "-"}
      </p>
    </div>
  );
}

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getApplicationById(id, token)
      .then(setApplication)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleStatus = async (status) => {
    setUpdating(true);
    try {
      await updateApplicationStatus(id, status, token);
      setApplication((prev) => ({ ...prev, status }));
      toast.success(`Applicant ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p style={{ ...fontBody, color: COLORS.textMuted }}>Loading...</p>;
  if (error || !application) {
    return <p style={{ color: "#DC2626" }}>{error || "Application not found."}</p>;
  }

  const s = application.snapshot;
  const hasSnapshot = !!s?.sharedAt;
  const student = application.student;
  const job = application.job;
  const statusStyle = STATUS_STYLES[application.status] || { bg: "#F1F5F9", color: COLORS.textMuted };
  const resumeLink = hasSnapshot ? safeUrl(s.resume?.url) : null;

  return (
    <div className="max-w-180">
      <button
        onClick={() => navigate(-1)}
        className="text-[13.5px] font-semibold mb-6"
        style={{ ...fontBody, color: COLORS.primary }}
      >
        ← Back to applicants
      </button>

      <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={hasSnapshot ? s.name : student?.name} photoUrl={student?.photoUrl} sizeClass="w-16 h-16" textClass="text-2xl" />
            <div>
              <h1 className="text-[20px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
                {hasSnapshot ? s.name : student?.name}
              </h1>
              <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                Applied for {job?.title} on {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{ ...fontBody, background: statusStyle.bg, color: statusStyle.color }}
          >
            {application.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-5">
          {application.status !== "Shortlisted" && (
            <button
              onClick={() => handleStatus("Shortlisted")}
              disabled={updating}
              className="px-4 py-2 rounded-lg font-semibold text-[13.5px] text-white disabled:opacity-60"
              style={{ ...fontBody, background: COLORS.primary }}
            >
              Shortlist
            </button>
          )}
          {application.status !== "Rejected" && (
            <button
              onClick={() => handleStatus("Rejected")}
              disabled={updating}
              className="px-4 py-2 rounded-lg font-semibold text-[13.5px] disabled:opacity-60"
              style={{ ...fontBody, color: "#B91C1C", background: "#FBEAEA" }}
            >
              Reject
            </button>
          )}
          {student?._id && (
            <Link
              to={`/recruiter/candidates/${student._id}`}
              className="text-[13.5px] font-semibold"
              style={{ ...fontBody, color: COLORS.primary }}
            >
              View profile →
            </Link>
          )}
        </div>
      </div>

      {application.status === "Shortlisted" && (
        <InterviewInviteSection
          application={application}
          studentName={hasSnapshot ? s.name : student?.name}
          onSent={(invite) => setApplication((prev) => ({ ...prev, interviewInvite: invite }))}
        />
      )}

      {!hasSnapshot ? (
        <div className="rounded-2xl px-5 py-4" style={{ background: "#FFF6E5" }}>
          <p className="text-[13.5px]" style={{ ...fontBody, color: "#B45309" }}>
            This applicant applied before detailed applications were introduced, so there is no application form to show.
            You can still view their profile using the link above.
          </p>
        </div>
      ) : (
        <>
          <Card title="Contact and education">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Row label="Email">
                <a href={`mailto:${s.email}`} style={{ color: COLORS.primary }}>
                  {s.email}
                </a>
              </Row>
              <Row label="Phone">{s.phone || "Not shared"}</Row>
              <Row label="University">{s.university}</Row>
              <Row label="Department">{s.department}</Row>
              <Row label="Semester">{s.semester}</Row>
              <Row label="CGPA">{s.cgpa}</Row>
            </div>
          </Card>

          <Card title="Resume">
            {resumeLink ? (
              <a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2.5 rounded-lg font-semibold text-[13.5px] border-2"
                style={{ ...fontBody, color: COLORS.primary, borderColor: COLORS.primary }}
              >
                📄 View resume{s.resume?.label ? ` (${s.resume.label})` : ""} ↗
              </a>
            ) : (
              <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                No resume attached.
              </p>
            )}
          </Card>

          {s.coverNote && (
            <Card title="Cover note">
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ ...fontBody, color: COLORS.textDark }}>
                {s.coverNote}
              </p>
            </Card>
          )}

          <Card title="Skills">
            {s.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {s.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[13px] font-medium px-3 py-1.5 rounded-full"
                    style={{ ...fontBody, background: "#EEF1FC", color: COLORS.primary }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                None shared.
              </p>
            )}
          </Card>

          {s.projects.length > 0 && (
            <Card title="Projects">
              {s.projects.map((p, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <p className="text-[14.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>
                    {p.title}
                  </p>
                  {p.description && (
                    <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
                      {p.description}
                    </p>
                  )}
                  <ProjectLinks project={p} />
                </div>
              ))}
            </Card>
          )}

          {s.certifications.length > 0 && (
            <Card title="Certifications">
              {s.certifications.map((c, i) => (
                <p key={i} className="text-[14px] mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
                  {c.name}
                  {c.issuer ? ` - ${c.issuer}` : ""}
                  {c.year ? ` (${c.year})` : ""}
                </p>
              ))}
            </Card>
          )}

          {(s.portfolioUrl || s.socialLinks?.linkedin || s.socialLinks?.github) && (
            <Card title="Links">
              <ProfileLinkButtons portfolioUrl={s.portfolioUrl} socialLinks={s.socialLinks} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}