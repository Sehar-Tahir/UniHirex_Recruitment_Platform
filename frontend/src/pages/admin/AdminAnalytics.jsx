import React, { useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, fontHead, fontBody } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { useAnalyticsSection } from "../../hooks/useAnalyticsSection";
import { getOverview, getGrowth, getJobsAnalytics, getAiAnalytics } from "../../api/analytics";
import { Section, KpiCard, ChartCard, Tile, FunnelRow } from "../../components/dashboard/admin/analytics/AnalyticsUI";
import { TrendLines, HBars } from "../../components/dashboard/admin/analytics/AnalyticsCharts";

const RANGES = [
  ["7", "Last 7 days"],
  ["30", "Last 30 days"],
  ["90", "Last 90 days"],
  ["all", "All time"],
];

const KPI_DEFS = [
  ["students", "New students"],
  ["recruiters", "New recruiters"],
  ["listings", "New listings"],
  ["applications", "Applications"],
  ["interviews", "Interviews completed"],
  ["analyses", "Resume analyses"],
];

const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
const daysSince = (date) => Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));
const hasActivity = (series, keys) => series.some((row) => keys.some((k) => row[k] > 0));

function Empty({ children }) {
  return (
    <p className="text-[13.5px] text-center py-10" style={{ ...fontBody, color: COLORS.textMuted }}>
      {children}
    </p>
  );
}

function ListRow({ primary, secondary, right }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[#F1F3F9] last:border-0">
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold truncate" style={{ ...fontBody, color: COLORS.textDark }}>
          {primary}
        </p>
        {secondary && (
          <p className="text-[12px] truncate" style={{ ...fontBody, color: COLORS.textMuted }}>
            {secondary}
          </p>
        )}
      </div>
      <span className="text-[13px] font-bold whitespace-nowrap" style={{ ...fontHead, color: COLORS.primary }}>
        {right}
      </span>
    </div>
  );
}

export default function AdminAnalytics() {
  const { token } = useAuth();
  const [range, setRange] = useState("30");

  const overview = useAnalyticsSection(getOverview, range, token);
  const growth = useAnalyticsSection(getGrowth, range, token);
  const jobs = useAnalyticsSection(getJobsAnalytics, range, token);
  const ai = useAnalyticsSection(getAiAnalytics, range, token);

  const isAllTime = range === "all";
  const kpiLabel = (label) => (isAllTime ? label.replace(/^New /, "").replace(/^./, (c) => c.toUpperCase()) : label);

  return (
    <div className="max-w-250">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[24px] font-bold mb-1" style={{ ...fontHead, color: COLORS.textDark }}>
            Platform Analytics
          </h1>
          <p className="text-[14.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            How UniHirex is growing and being used.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGES.map(([value, label]) => {
            const active = range === value;
            return (
              <button
                key={value}
                onClick={() => setRange(value)}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[12.5px] md:text-[13.5px] font-semibold transition-colors whitespace-nowrap"
                style={{
                  ...fontBody,
                  background: active ? COLORS.primary : "#F1F5F9",
                  color: active ? "#fff" : COLORS.textMuted,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview */}
      <Section title="Overview" subtitle={isAllTime ? "All-time totals." : "This period, compared with the previous period of the same length."} state={overview}>
        {overview.data && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {KPI_DEFS.map(([key, label]) => {
              const k = overview.data.kpis[key];
              return (
                <KpiCard key={key} label={kpiLabel(label)} total={k.total} current={k.current} previous={k.previous} isAllTime={isAllTime} />
              );
            })}
          </div>
        )}
      </Section>

      {/* Funnel */}
      <Section title="Application funnel" subtitle="What happens to applications after students apply." state={overview}>
        {overview.data &&
          (overview.data.funnel.applied === 0 ? (
            <div className="border border-[#ECEEF3] rounded-2xl bg-white">
              <Empty>No applications in this period.</Empty>
            </div>
          ) : (
            <div className="border border-[#ECEEF3] rounded-2xl p-6 bg-white">
              {(() => {
                const f = overview.data.funnel;
                return (
                  <>
                    <FunnelRow label="Applications received" value={f.applied} percent={100} color={COLORS.primary} />
                    <FunnelRow label="Shortlisted" value={f.shortlisted} percent={pct(f.shortlisted, f.applied)} color="#15803D" note={`${pct(f.shortlisted, f.applied)}% of applications`} />
                    <FunnelRow label="Invited to interview" value={f.invited} percent={pct(f.invited, f.applied)} color={COLORS.accent} note={`${pct(f.invited, f.shortlisted)}% of shortlisted`} />
                    <FunnelRow label="Still under review" value={f.underReview} percent={pct(f.underReview, f.applied)} color="#B45309" note={`${pct(f.underReview, f.applied)}%`} />
                    <FunnelRow label="Rejected" value={f.rejected} percent={pct(f.rejected, f.applied)} color="#B91C1C" note={`${pct(f.rejected, f.applied)}%`} />
                  </>
                );
              })()}
            </div>
          ))}
      </Section>

      {/* Health */}
      <Section title="Platform health" subtitle="Things that may need your attention (current snapshot, not affected by the date range)." state={overview}>
        {overview.data && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
              <Tile
                label="Recruiters awaiting approval"
                value={overview.data.health.pendingRecruiters}
                tone={overview.data.health.pendingRecruiters > 0 ? "warn" : "good"}
                note={
                  overview.data.health.oldestPendingSince
                    ? `Oldest waiting ${daysSince(overview.data.health.oldestPendingSince)} day(s)`
                    : "Nobody waiting"
                }
              />
              <Tile label="Students without a resume" value={overview.data.health.studentsNoResume} note={`of ${overview.data.health.studentsTotal} students`} />
              <Tile label="Students without skills" value={overview.data.health.studentsNoSkills} note={`of ${overview.data.health.studentsTotal} students`} />
              <Tile label="Unverified accounts" value={overview.data.health.unverifiedUsers} tone={overview.data.health.unverifiedUsers > 0 ? "warn" : "good"} />
              <Tile label="Suspended users" value={overview.data.health.suspendedUsers} />
              <Tile label="Active listings" value={overview.data.health.jobsByStatus.Active} tone="good" />
              <Tile label="Flagged listings" value={overview.data.health.jobsByStatus.Flagged} tone={overview.data.health.jobsByStatus.Flagged > 0 ? "bad" : undefined} />
              <Tile label="Closed listings" value={overview.data.health.jobsByStatus.Closed} />
            </div>
            <div className="flex gap-5">
              <Link to="/admin/users" className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
                Manage users →
              </Link>
              <Link to="/admin/jobs" className="text-[13px] font-semibold" style={{ ...fontBody, color: COLORS.primary }}>
                Manage jobs →
              </Link>
            </div>
          </>
        )}
      </Section>

      {/* Growth */}
      <Section
        title="Growth"
        subtitle={growth.data?.cappedFromAll ? "Showing the last 90 days." : `Daily activity over the last ${growth.data?.days ?? ""} days.`}
        state={growth}
      >
        {growth.data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard title="New sign-ups">
              {hasActivity(growth.data.series, ["students", "recruiters"]) ? (
                <TrendLines
                  data={growth.data.series}
                  lines={[
                    { key: "students", name: "Students", color: COLORS.primary },
                    { key: "recruiters", name: "Recruiters", color: COLORS.accent },
                  ]}
                />
              ) : (
                <Empty>No sign-ups in this period.</Empty>
              )}
            </ChartCard>
            <ChartCard title="Listings and applications">
              {hasActivity(growth.data.series, ["listings", "applications"]) ? (
                <TrendLines
                  data={growth.data.series}
                  lines={[
                    { key: "listings", name: "New listings", color: COLORS.primaryLight },
                    { key: "applications", name: "Applications", color: COLORS.accentLight },
                  ]}
                />
              ) : (
                <Empty>No listings or applications in this period.</Empty>
              )}
            </ChartCard>
          </div>
        )}
      </Section>

      {/* Jobs */}
      <Section title="Jobs and skills" subtitle="Listings posted in this period. The skills chart uses all active listings and all student profiles." state={jobs}>
        {jobs.data && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <ChartCard title="Listings by category">
                {jobs.data.categories.length > 0 ? (
                  <HBars data={jobs.data.categories} yKey="label" bars={[{ key: "count", name: "Listings", color: COLORS.primary }]} />
                ) : (
                  <Empty>No listings in this period.</Empty>
                )}
              </ChartCard>
              <ChartCard title="Listings by type">
                {jobs.data.types.length > 0 ? (
                  <HBars data={jobs.data.types} yKey="label" bars={[{ key: "count", name: "Listings", color: COLORS.accent }]} />
                ) : (
                  <Empty>No listings in this period.</Empty>
                )}
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <ChartCard title="Most-applied jobs">
                {jobs.data.topJobs.length > 0 ? (
                  jobs.data.topJobs.map((j, i) => (
                    <ListRow key={i} primary={j.title} secondary={j.company} right={`${j.applications} applied`} />
                  ))
                ) : (
                  <Empty>No applications in this period.</Empty>
                )}
              </ChartCard>
              <ChartCard title="Top companies by listings">
                {jobs.data.topCompanies.length > 0 ? (
                  jobs.data.topCompanies.map((c, i) => <ListRow key={i} primary={c.company} right={`${c.listings} listings`} />)
                ) : (
                  <Empty>No listings in this period.</Empty>
                )}
              </ChartCard>
            </div>

            <ChartCard title="Skills: demand vs supply" subtitle="Active listings that require each skill, against students who list it. Big gaps show where students need to learn.">
              {jobs.data.skills.length > 0 ? (
                <HBars
                  data={jobs.data.skills}
                  yKey="skill"
                  bars={[
                    { key: "demand", name: "Listings requiring it", color: COLORS.primary },
                    { key: "supply", name: "Students with it", color: COLORS.accent },
                  ]}
                />
              ) : (
                <Empty>No active listings with requirements yet.</Empty>
              )}
            </ChartCard>
          </>
        )}
      </Section>

      {/* AI usage */}
      <Section title="AI feature usage" subtitle="Interview Coach and Resume Analyzer." state={ai}>
        {ai.data && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <Tile label="Interviews started" value={ai.data.interviews.started} />
              <Tile label="Interviews completed" value={ai.data.interviews.completed} />
              <Tile label="Avg interview score" value={ai.data.interviews.avgScore ?? "-"} />
              <Tile label="Resume analyses" value={ai.data.resume.analyses} />
              <Tile label="Avg resume score" value={ai.data.resume.avgScore ?? "-"} />
              <Tile label="At interview limit" value={ai.data.atLimit.interviews} tone={ai.data.atLimit.interviews > 0 ? "warn" : undefined} note="students" />
              <Tile label="At resume limit" value={ai.data.atLimit.resumeAnalyses} tone={ai.data.atLimit.resumeAnalyses > 0 ? "warn" : undefined} note="students" />
              <Tile label="Access requests" value={ai.data.requests.last7Days} tone={ai.data.requests.last7Days > 0 ? "warn" : undefined} note="last 7 days" />
            </div>

            <div className="mb-5">
              <ChartCard title="Daily AI usage" subtitle={`Last ${ai.data.dailyDays} days.`}>
                {hasActivity(ai.data.daily, ["interviews", "resumes"]) ? (
                  <TrendLines
                    data={ai.data.daily}
                    lines={[
                      { key: "interviews", name: "Interviews started", color: COLORS.primary },
                      { key: "resumes", name: "Resume analyses", color: COLORS.accent },
                    ]}
                  />
                ) : (
                  <Empty>No AI usage in this period.</Empty>
                )}
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ChartCard title="Recent access requests" subtitle="Change a student's limit from Manage Users → AI Access.">
                {ai.data.requests.recent.length > 0 ? (
                  ai.data.requests.recent.map((u, i) => (
                    <ListRow key={i} primary={u.name} secondary={u.email} right={new Date(u.aiAccessRequestedAt).toLocaleDateString()} />
                  ))
                ) : (
                  <Empty>No requests yet.</Empty>
                )}
              </ChartCard>
              <ChartCard title="Heaviest AI users">
                {ai.data.topUsers.length > 0 ? (
                  ai.data.topUsers.map((u, i) => (
                    <ListRow
                      key={i}
                      primary={u.name}
                      secondary={u.email}
                      right={`${u.interviewsUsed} interviews · ${u.resumeAnalysesUsed} analyses`}
                    />
                  ))
                ) : (
                  <Empty>No usage yet.</Empty>
                )}
              </ChartCard>
            </div>
          </>
        )}
      </Section>
    </div>
  );
}