const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const { DEFAULT_LIMITS } = require("../utils/aiQuota");
const {
  getWindow,
  dayBuckets,
  inWindow,
  countWithTrend,
  average,
  dailyCounts,
  mergeSkillRows,
} = require("../utils/analyticsHelpers");

// @route  GET /api/admin/analytics/overview?range=7|30|90|all
const getOverview = async (req, res) => {
  try {
    const win = getWindow(req.query.range);
    const appMatch = inWindow(win);

    const [students, recruiters, listings, applications, interviews, analyses] = await Promise.all([
      countWithTrend(User, { role: "student" }, win),
      countWithTrend(User, { role: "recruiter" }, win),
      countWithTrend(Job, {}, win),
      countWithTrend(Application, {}, win),
      countWithTrend(Interview, { status: "Completed" }, win),
      countWithTrend(ResumeAnalysis, {}, win),
    ]);

    const [statusRows, invited] = await Promise.all([
      Application.aggregate([{ $match: appMatch }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Application.countDocuments({ ...appMatch, "interviewInvite.sentAt": { $exists: true } }),
    ]);

    const byStatus = Object.fromEntries(statusRows.map((r) => [r._id, r.count]));
    const applied = statusRows.reduce((sum, r) => sum + r.count, 0);

    const noResume = { role: "student", $or: [{ resumeUrl: { $exists: false } }, { resumeUrl: "" }, { resumeUrl: null }] };
    const noSkills = { role: "student", $or: [{ skills: { $exists: false } }, { skills: { $size: 0 } }] };

    const [pendingRecruiters, oldestPending, studentsNoResume, studentsNoSkills, unverifiedUsers, suspendedUsers, jobStatusRows] =
      await Promise.all([
        User.countDocuments({ role: "recruiter", status: "Pending" }),
        User.findOne({ role: "recruiter", status: "Pending" }).sort({ createdAt: 1 }).select("createdAt"),
        User.countDocuments(noResume),
        User.countDocuments(noSkills),
        User.countDocuments({ role: { $in: ["student", "recruiter"] }, isEmailVerified: { $ne: true } }),
        User.countDocuments({ status: "Suspended" }),
        Job.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      ]);

    const jobsByStatus = { Active: 0, Flagged: 0, Closed: 0, ...Object.fromEntries(jobStatusRows.map((r) => [r._id, r.count])) };

    res.json({
      range: win.key,
      kpis: { students, recruiters, listings, applications, interviews, analyses },
      funnel: {
        applied,
        underReview: byStatus["Under Review"] || 0,
        shortlisted: byStatus["Shortlisted"] || 0,
        rejected: byStatus["Rejected"] || 0,
        invited,
      },
      health: {
        pendingRecruiters,
        oldestPendingSince: oldestPending ? oldestPending.createdAt : null,
        studentsTotal: students.total,
        studentsNoResume,
        studentsNoSkills,
        unverifiedUsers,
        suspendedUsers,
        jobsByStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load overview analytics", error: err.message });
  }
};

// @route  GET /api/admin/analytics/growth?range=7|30|90|all   (daily series, capped at 90 days)
const getGrowth = async (req, res) => {
  try {
    const win = getWindow(req.query.range);
    const days = Math.min(win.days || 90, 90);
    const { start } = getWindow(String(days));

    const [students, recruiters, listings, applications] = await Promise.all([
      dailyCounts(User, { role: "student" }, "createdAt", start),
      dailyCounts(User, { role: "recruiter" }, "createdAt", start),
      dailyCounts(Job, {}, "createdAt", start),
      dailyCounts(Application, {}, "createdAt", start),
    ]);

    const series = dayBuckets(days).map((date) => ({
      date,
      students: students.get(date) || 0,
      recruiters: recruiters.get(date) || 0,
      listings: listings.get(date) || 0,
      applications: applications.get(date) || 0,
    }));

    res.json({ days, cappedFromAll: win.days === null, series });
  } catch (err) {
    res.status(500).json({ message: "Failed to load growth analytics", error: err.message });
  }
};

// @route  GET /api/admin/analytics/jobs?range=7|30|90|all
const getJobsAnalytics = async (req, res) => {
  try {
    const win = getWindow(req.query.range);
    const periodMatch = inWindow(win);

    const [categoryRows, typeRows, statusRows, topJobs, companyRows, demandRows, supplyRows] = await Promise.all([
      Job.aggregate([
        { $match: periodMatch },
        {
          $group: {
            _id: { $toLower: { $trim: { input: "$category" } } },
            label: { $first: { $trim: { input: "$category" } } },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Job.aggregate([{ $match: periodMatch }, { $group: { _id: "$type", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Job.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Application.aggregate([
        { $match: periodMatch },
        { $group: { _id: "$job", applications: { $sum: 1 } } },
        { $sort: { applications: -1 } },
        { $limit: 5 },
        { $lookup: { from: "jobs", localField: "_id", foreignField: "_id", as: "job" } },
        { $unwind: "$job" },
        { $project: { _id: 0, applications: 1, title: "$job.title", company: "$job.company" } },
      ]),
      Job.aggregate([
        { $match: periodMatch },
        { $group: { _id: "$company", listings: { $sum: 1 } } },
        { $sort: { listings: -1 } },
        { $limit: 5 },
      ]),
      // Skills: always based on ALL active listings and ALL student profiles (a snapshot of the market)
      Job.aggregate([
        { $match: { status: "Active" } },
        { $unwind: "$requirements" },
        { $group: { _id: { $trim: { input: "$requirements" } }, count: { $sum: 1 } } },
      ]),
      User.aggregate([
        { $match: { role: "student" } },
        { $unwind: "$skills" },
        { $group: { _id: { $trim: { input: "$skills" } }, count: { $sum: 1 } } },
      ]),
    ]);

    const categories = categoryRows.slice(0, 8).map((r) => ({ label: r.label, count: r.count }));
    const otherCount = categoryRows.slice(8).reduce((sum, r) => sum + r.count, 0);
    if (otherCount > 0) categories.push({ label: "Other", count: otherCount });

    const demand = mergeSkillRows(demandRows);
    const supply = mergeSkillRows(supplyRows);
    const skills = [...demand.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([key, d]) => ({ skill: d.label, demand: d.count, supply: supply.get(key)?.count || 0 }));

    res.json({
      range: win.key,
      categories,
      types: typeRows.map((r) => ({ label: r._id, count: r.count })),
      statuses: { Active: 0, Flagged: 0, Closed: 0, ...Object.fromEntries(statusRows.map((r) => [r._id, r.count])) },
      topJobs,
      topCompanies: companyRows.map((r) => ({ company: r._id, listings: r.listings })),
      skills,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load jobs analytics", error: err.message });
  }
};

const limitReached = (usedPath, limitPath, fallback) => ({
  $expr: { $gte: [{ $ifNull: [`$${usedPath}`, 0] }, { $ifNull: [`$${limitPath}`, fallback] }] },
});

// @route  GET /api/admin/analytics/ai?range=7|30|90|all
const getAiAnalytics = async (req, res) => {
  try {
    const win = getWindow(req.query.range);
    const days = Math.min(win.days || 90, 90);
    const { start: dailyStart } = getWindow(String(days));

    const startedMatch = win.start ? { startedAt: { $gte: win.start } } : { startedAt: { $exists: true } };
    const createdMatch = inWindow(win);

    const [
      started,
      completed,
      avgInterview,
      analysesCount,
      avgResume,
      atInterviewLimit,
      atResumeLimit,
      requestsLast7Days,
      recentRequests,
      topUsers,
      dailyInterviews,
      dailyResumes,
    ] = await Promise.all([
      Interview.countDocuments(startedMatch),
      Interview.countDocuments({ status: "Completed", ...createdMatch }),
      average(Interview, { status: "Completed", overallScore: { $ne: null }, ...createdMatch }, "overallScore"),
      ResumeAnalysis.countDocuments(createdMatch),
      average(ResumeAnalysis, createdMatch, "overallScore"),
      User.countDocuments({
        role: "student",
        ...limitReached("aiUsage.interviewsUsed", "aiLimits.interviews", DEFAULT_LIMITS.interviews),
      }),
      User.countDocuments({
        role: "student",
        ...limitReached("aiUsage.resumeAnalysesUsed", "aiLimits.resumeAnalyses", DEFAULT_LIMITS.resumeAnalyses),
      }),
      User.countDocuments({ role: "student", aiAccessRequestedAt: { $gte: new Date(Date.now() - 7 * 86400000) } }),
      User.find({ role: "student", aiAccessRequestedAt: { $ne: null } })
        .sort({ aiAccessRequestedAt: -1 })
        .limit(5)
        .select("name email aiAccessRequestedAt"),
      User.aggregate([
        { $match: { role: "student" } },
        {
          $addFields: {
            interviewsUsed: { $ifNull: ["$aiUsage.interviewsUsed", 0] },
            resumeAnalysesUsed: { $ifNull: ["$aiUsage.resumeAnalysesUsed", 0] },
          },
        },
        { $addFields: { totalUsed: { $add: ["$interviewsUsed", "$resumeAnalysesUsed"] } } },
        { $match: { totalUsed: { $gt: 0 } } },
        { $sort: { totalUsed: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: 1, email: 1, interviewsUsed: 1, resumeAnalysesUsed: 1 } },
      ]),
      dailyCounts(Interview, {}, "startedAt", dailyStart),
      dailyCounts(ResumeAnalysis, {}, "createdAt", dailyStart),
    ]);

    res.json({
      range: win.key,
      interviews: { started, completed, avgScore: avgInterview },
      resume: { analyses: analysesCount, avgScore: avgResume },
      atLimit: { interviews: atInterviewLimit, resumeAnalyses: atResumeLimit },
      requests: { last7Days: requestsLast7Days, recent: recentRequests },
      topUsers,
      dailyDays: days,
      daily: dayBuckets(days).map((date) => ({
        date,
        interviews: dailyInterviews.get(date) || 0,
        resumes: dailyResumes.get(date) || 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load AI analytics", error: err.message });
  }
};

module.exports = { getOverview, getGrowth, getJobsAnalytics, getAiAnalytics };