import React from "react";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../theme";
import { scoreColor } from "../../utils/scoreColor";

const SEVERITY_STYLES = {
  high: { bg: "#FBEAEA", color: "#B91C1C", label: "High" },
  medium: { bg: "#FFF6E5", color: "#B45309", label: "Medium" },
  low: { bg: "#EEF1FC", color: "#2340B8", label: "Low" },
};

function copyText(text) {
  if (!navigator.clipboard) {
    toast.error("Copy isn't available here. Please select the text and copy it manually.");
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Copied to clipboard"))
    .catch(() => toast.error("Couldn't copy. Please select the text and copy it manually."));
}

export function Card({ title, right, children }) {
  return (
    <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white mb-6">
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {title && (
            <h3 className="text-[15px] font-semibold" style={{ ...fontHead, color: COLORS.textDark }}>
              {title}
            </h3>
          )}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function SubHead({ children }) {
  return (
    <p
      className="text-[12.5px] font-semibold uppercase tracking-wide mb-2 mt-4 first:mt-0"
      style={{ ...fontBody, color: COLORS.textMuted }}
    >
      {children}
    </p>
  );
}

function Chip({ children, bg, color }) {
  return (
    <span className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full" style={{ ...fontBody, background: bg, color }}>
      {children}
    </span>
  );
}

function Delta({ current, previous }) {
  if (previous == null) return null;
  const diff = current - previous;
  if (diff === 0) {
    return <span className="text-[12px]" style={{ ...fontBody, color: COLORS.textMuted }}>no change</span>;
  }
  return (
    <span className="text-[12px] font-semibold" style={{ ...fontBody, color: diff > 0 ? "#15803D" : "#B91C1C" }}>
      {diff > 0 ? "▲" : "▼"} {Math.abs(diff)}
    </span>
  );
}

function ScoreBar({ label, value, previous }) {
  const color = scoreColor(value);
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[13px]" style={{ ...fontBody, color: COLORS.textDark }}>{label}</span>
        <span className="flex items-center gap-2">
          <Delta current={value} previous={previous} />
          <span className="text-[13px] font-semibold" style={{ ...fontBody, color }}>{value}%</span>
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function SuggestionActions({ text, accepted, onToggle }) {
  return (
    <div className="flex items-center gap-4 mt-3">
      <button onClick={() => copyText(text)} className="text-[12.5px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
        Copy
      </button>
      <button
        onClick={onToggle}
        className="text-[12.5px] font-semibold"
        style={{ ...fontBody, color: accepted ? "#15803D" : COLORS.accent }}
      >
        {accepted ? "✓ Applied (undo)" : "Mark as applied"}
      </button>
    </div>
  );
}

export default function ResumeReport({ analysis, onToggleApplied, onDelete }) {
  const isNew = analysis.version != null; // analyses made before the update lack the newer sections
  const prev = analysis.previous && analysis.previous.overallScore != null ? analysis.previous : null;
  const issues = analysis.issues || [];
  const parsed = analysis.parsed || {};
  const sections = analysis.sections || [];
  const missingSections = sections.filter((s) => !s.present).map((s) => s.name);
  const atsIssues = analysis.atsIssues || [];
  const skillGaps = analysis.skillGaps || [];
  const foundSkills = parsed.skills || [];
  const rewrites = analysis.rewrites || [];
  const hasSummarySuggestion = !!analysis.suggestedSummary;
  const totalSuggestions = rewrites.length + (hasSummarySuggestion ? 1 : 0);
  const appliedCount =
    rewrites.filter((r) => r.accepted).length + (hasSummarySuggestion && analysis.summaryAccepted ? 1 : 0);
  const hasParsed = [parsed.education, parsed.projects, parsed.experience, parsed.certifications].some(
    (a) => a && a.length > 0
  );

  const categories = [
    ["Content & Impact", analysis.contentScore, prev?.contentScore],
    ["Structure & Formatting", analysis.structureScore, prev?.structureScore],
    ["Skills & Keywords", analysis.skillsScore, prev?.skillsScore],
    ["Language & Clarity", analysis.languageScore, prev?.languageScore],
    ["ATS Compatibility", analysis.atsScore, prev?.atsScore],
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-[12.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
          Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
          {analysis.targetRole ? ` · Target role: ${analysis.targetRole}` : ""}
          {analysis.resumeLabel ? ` · Resume: ${analysis.resumeLabel}` : ""}
          {analysis.version ? ` · v${analysis.version}` : ""}
        </p>
        <button onClick={onDelete} className="text-[12.5px] font-semibold" style={{ ...fontBody, color: "#B91C1C" }}>
          Delete this analysis
        </button>
      </div>

      <div className="border border-[#ECEEF3] rounded-2xl p-7 bg-white mb-6 text-center">
        <p className="text-[13px] font-medium mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>
          Overall Resume Score
        </p>
        <p className="text-[42px] font-bold" style={{ ...fontHead, color: scoreColor(analysis.overallScore) }}>
          {analysis.overallScore}<span className="text-[20px]">/100</span>
        </p>
        {prev && (
          <p className="text-[13px] mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>
            <Delta current={analysis.overallScore} previous={prev.overallScore} /> since your previous analysis (v
            {prev.version}, {new Date(prev.createdAt).toLocaleDateString()})
          </p>
        )}
        <p className="text-[13.5px] leading-relaxed max-w-130 mx-auto" style={{ ...fontBody, color: COLORS.textMuted }}>
          {analysis.summary}
        </p>
      </div>

      <Card title="Category Breakdown">
        {categories.map(([label, value, previous]) => (
          <ScoreBar key={label} label={label} value={value ?? 0} previous={previous} />
        ))}
      </Card>

      {analysis.hadJobDescription && analysis.jobMatch?.matchScore != null && (
        <Card title="Job Description Match">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-[34px] font-bold" style={{ ...fontHead, color: scoreColor(analysis.jobMatch.matchScore) }}>
              {analysis.jobMatch.matchScore}%
            </p>
            <p className="text-[13.5px] leading-relaxed" style={{ ...fontBody, color: COLORS.textMuted }}>
              {analysis.jobMatch.summary}
            </p>
          </div>
          {analysis.jobMatch.matchedKeywords?.length > 0 && (
            <>
              <SubHead>Keywords you already match</SubHead>
              <div className="flex flex-wrap gap-2">
                {analysis.jobMatch.matchedKeywords.map((k) => (
                  <Chip key={k} bg="#E7F7EE" color="#15803D">{k}</Chip>
                ))}
              </div>
            </>
          )}
          {analysis.jobMatch.missingKeywords?.length > 0 && (
            <>
              <SubHead>Keywords the job wants that are missing</SubHead>
              <div className="flex flex-wrap gap-2">
                {analysis.jobMatch.missingKeywords.map((k) => (
                  <Chip key={k} bg="#FFF6E5" color="#B45309">{k}</Chip>
                ))}
              </div>
            </>
          )}
        </Card>
      )}

      {hasParsed && (
        <Card title="What We Found in Your Resume">
          {parsed.education?.length > 0 && (
            <>
              <SubHead>Education</SubHead>
              {parsed.education.map((e, i) => (
                <p key={i} className="text-[13.5px] mb-1" style={{ ...fontBody, color: COLORS.textDark }}>
                  {[e.degree, e.institution].filter(Boolean).join(" — ")}
                  {e.period ? ` (${e.period})` : ""}
                </p>
              ))}
            </>
          )}
          {parsed.experience?.length > 0 && (
            <>
              <SubHead>Experience</SubHead>
              {parsed.experience.map((e, i) => (
                <p key={i} className="text-[13.5px] mb-1" style={{ ...fontBody, color: COLORS.textDark }}>
                  {[e.role, e.company].filter(Boolean).join(" at ")}
                  {e.period ? ` (${e.period})` : ""}
                </p>
              ))}
            </>
          )}
          {parsed.projects?.length > 0 && (
            <>
              <SubHead>Projects</SubHead>
              {parsed.projects.map((p, i) => (
                <p key={i} className="text-[13.5px] mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>
                  <strong>{p.name}</strong>
                  {p.description ? ` — ${p.description}` : ""}
                </p>
              ))}
            </>
          )}
          {parsed.certifications?.length > 0 && (
            <>
              <SubHead>Certifications</SubHead>
              {parsed.certifications.map((c, i) => (
                <p key={i} className="text-[13.5px] mb-1" style={{ ...fontBody, color: COLORS.textDark }}>{c}</p>
              ))}
            </>
          )}
          <p className="text-[12px] mt-4" style={{ ...fontBody, color: COLORS.textMuted }}>
            If something is missing here, the AI may not have been able to read that part of your file.
          </p>
        </Card>
      )}

      <Card title="Sections Found">
        <div className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <Chip key={s.name} bg={s.present ? "#E7F7EE" : "#FBEAEA"} color={s.present ? "#15803D" : "#B91C1C"}>
              {s.present ? "✓" : "✗"} {s.name}
            </Chip>
          ))}
        </div>
        {missingSections.length > 0 && (
          <p className="text-[13px] mt-3" style={{ ...fontBody, color: COLORS.textMuted }}>
            Missing: {missingSections.join(", ")}
          </p>
        )}
      </Card>

      {isNew && (
        <Card
          title="ATS Compatibility"
          right={
            <span className="flex items-center gap-2">
              <Delta current={analysis.atsScore} previous={prev?.atsScore} />
              <span className="text-[15px] font-bold" style={{ ...fontHead, color: scoreColor(analysis.atsScore) }}>
                {analysis.atsScore}%
              </span>
            </span>
          }
        >
          {atsIssues.length === 0 ? (
            <div className="rounded-xl px-4 py-3" style={{ background: "#E7F7EE" }}>
              <p className="text-[13.5px]" style={{ ...fontBody, color: "#15803D" }}>
                No major ATS problems found.
              </p>
            </div>
          ) : (
            <ul className="list-disc pl-5">
              {atsIssues.map((a, i) => (
                <li key={i} className="text-[13.5px] mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>{a}</li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {isNew && (foundSkills.length > 0 || skillGaps.length > 0) && (
        <Card title="Skills Analysis">
          {foundSkills.length > 0 && (
            <>
              <SubHead>Skills found on your resume</SubHead>
              <div className="flex flex-wrap gap-2">
                {foundSkills.map((s) => (
                  <Chip key={s} bg="#EEF1FC" color={COLORS.primary}>{s}</Chip>
                ))}
              </div>
            </>
          )}
          {skillGaps.length > 0 && (
            <>
              <SubHead>Recommended skills to add</SubHead>
              {skillGaps.map((g, i) => (
                <div key={i} className="mb-2.5">
                  <p className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>{g.skill}</p>
                  <p className="text-[13px]" style={{ ...fontBody, color: COLORS.textMuted }}>{g.reason}</p>
                </div>
              ))}
            </>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
          <h3 className="text-[14px] font-semibold mb-3" style={{ ...fontHead, color: "#15803D" }}>Strengths</h3>
          <ul className="list-disc pl-5">
            {(analysis.strengths || []).map((s, i) => (
              <li key={i} className="text-[13.5px] mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
          <h3 className="text-[14px] font-semibold mb-3" style={{ ...fontHead, color: "#B45309" }}>
            {issues.length > 0 ? "Top Issues" : "Improvements"}
          </h3>
          <ul className="list-disc pl-5">
            {(issues.length > 0 ? issues.map((i) => i.title) : analysis.improvements || []).map((s, i) => (
              <li key={i} className="text-[13.5px] mb-1.5" style={{ ...fontBody, color: COLORS.textDark }}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {issues.length > 0 && (
        <Card title="Issues & How to Fix Them">
          {issues.map((issue, i) => {
            const sev = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.medium;
            return (
              <div key={i} className="mb-4 pb-4 border-b border-[#F1F3F9] last:border-0 last:mb-0 last:pb-0">
                <div className="flex items-start gap-3 mb-1.5">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                    style={{ ...fontBody, background: sev.bg, color: sev.color }}
                  >
                    {sev.label}
                  </span>
                  <p className="text-[13.5px] font-semibold" style={{ ...fontBody, color: COLORS.textDark }}>{issue.title}</p>
                </div>
                <p className="text-[13px] pl-14.5" style={{ ...fontBody, color: COLORS.textMuted }}>
                  <strong style={{ color: COLORS.textDark }}>Fix:</strong> {issue.solution}
                </p>
              </div>
            );
          })}
        </Card>
      )}

      {totalSuggestions > 0 && (
        <p className="text-[13px] font-semibold mb-3" style={{ ...fontBody, color: COLORS.primary }}>
          {appliedCount} of {totalSuggestions} suggestions marked as applied
        </p>
      )}

      {hasSummarySuggestion && (
        <Card title="Professional Summary">
          {parsed.currentSummary && (
            <div className="rounded-xl px-4 py-3 mb-3" style={{ background: "#FBEAEA" }}>
              <p className="text-[11.5px] font-semibold mb-1" style={{ ...fontBody, color: "#B91C1C" }}>Your current summary</p>
              <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textDark }}>{parsed.currentSummary}</p>
            </div>
          )}
          <div className="rounded-xl px-4 py-3" style={{ background: "#E7F7EE" }}>
            <p className="text-[11.5px] font-semibold mb-1" style={{ ...fontBody, color: "#15803D" }}>Suggested summary</p>
            <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textDark }}>{analysis.suggestedSummary}</p>
          </div>
          <SuggestionActions
            text={analysis.suggestedSummary}
            accepted={analysis.summaryAccepted}
            onToggle={() => onToggleApplied("summary", null, !analysis.summaryAccepted)}
          />
        </Card>
      )}

      {rewrites.length > 0 && (
        <Card title="Bullet Point Rewriter">
          {rewrites.map((r, i) => (
            <div key={i} className="mb-6 last:mb-0">
              {r.section && (
                <p className="text-[12px] font-semibold mb-2" style={{ ...fontBody, color: COLORS.textMuted }}>{r.section}</p>
              )}
              <div className="rounded-xl px-4 py-3 mb-2" style={{ background: "#FBEAEA" }}>
                <p className="text-[11.5px] font-semibold mb-1" style={{ ...fontBody, color: "#B91C1C" }}>Before</p>
                <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textDark }}>{r.original}</p>
              </div>
              <div className="rounded-xl px-4 py-3 mb-2" style={{ background: "#E7F7EE" }}>
                <p className="text-[11.5px] font-semibold mb-1" style={{ ...fontBody, color: "#15803D" }}>After</p>
                <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textDark }}>{r.improved}</p>
              </div>
              {r.reason && (
                <p className="text-[12.5px] italic" style={{ ...fontBody, color: COLORS.textMuted }}>{r.reason}</p>
              )}
              <SuggestionActions
                text={r.improved}
                accepted={r.accepted}
                onToggle={() => onToggleApplied("rewrite", i, !r.accepted)}
              />
            </div>
          ))}
          <p className="text-[12px] mt-4" style={{ ...fontBody, color: COLORS.textMuted }}>
            Placeholders like [X%] mean you should add your real number there. Only claim what is true. "Mark as
            applied" is just your checklist, since the AI can't edit your uploaded file.
          </p>
        </Card>
      )}
    </div>
  );
}