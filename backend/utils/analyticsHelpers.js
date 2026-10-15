const TZ = "Asia/Karachi";
const TZ_OFFSET = "+05:00"; // Pakistan has no daylight saving time, so this offset never changes

const RANGES = { 7: 7, 30: 30, 90: 90, all: null };

const dayString = (date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

// Turns ?range=30 into the start of the current period and of the previous period of equal length
function getWindow(rangeParam) {
  const key = Object.prototype.hasOwnProperty.call(RANGES, rangeParam) ? String(rangeParam) : "30";
  const days = RANGES[key];
  if (days === null) return { key, days: null, start: null, prevStart: null };

  const firstDay = dayString(new Date(Date.now() - (days - 1) * 86400000));
  const start = new Date(`${firstDay}T00:00:00${TZ_OFFSET}`);
  const prevStart = new Date(start.getTime() - days * 86400000);
  return { key, days, start, prevStart };
}

// ["2026-10-01", "2026-10-02", ...] ending today, so days with no activity still appear as zero
function dayBuckets(days) {
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) buckets.push(dayString(new Date(Date.now() - i * 86400000)));
  return buckets;
}

const inWindow = (win) => (win.start ? { createdAt: { $gte: win.start } } : {});

// Total count, count in the current period, and count in the previous period
async function countWithTrend(Model, filter, win) {
  const total = await Model.countDocuments(filter);
  if (!win.start) return { total, current: total, previous: null };

  const [current, previous] = await Promise.all([
    Model.countDocuments({ ...filter, createdAt: { $gte: win.start } }),
    Model.countDocuments({ ...filter, createdAt: { $gte: win.prevStart, $lt: win.start } }),
  ]);
  return { total, current, previous };
}

async function average(Model, match, field) {
  const [row] = await Model.aggregate([{ $match: match }, { $group: { _id: null, avg: { $avg: `$${field}` } } }]);
  return row && row.avg != null ? Math.round(row.avg) : null;
}

// Map of "YYYY-MM-DD" -> count, grouped in Pakistan time
async function dailyCounts(Model, match, dateField, start) {
  const rows = await Model.aggregate([
    { $match: { ...match, [dateField]: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}`, timezone: TZ } },
        count: { $sum: 1 },
      },
    },
  ]);
  return new Map(rows.map((r) => [r._id, r.count]));
}

// Spelling variants of the same skill ("React.js", "ReactJS", "react") are counted together
const SKILL_ALIASES = {
  reactjs: "react",
  nodejs: "node",
  expressjs: "express",
  vuejs: "vue",
  nextjs: "next",
  js: "javascript",
  ts: "typescript",
  html5: "html",
  css3: "css",
  mongo: "mongodb",
  postgres: "postgresql",
};

const skillKey = (raw) => {
  const base = String(raw).toLowerCase().replace(/[\s._-]/g, "");
  return SKILL_ALIASES[base] || base;
};

// rows: [{ _id: "React.js", count: 3 }, ...]  ->  Map(key -> { count, label })
function mergeSkillRows(rows) {
  const merged = new Map();
  for (const row of rows) {
    const key = skillKey(row._id);
    if (!key) continue;
    const entry = merged.get(key) || { count: 0, spellings: new Map() };
    entry.count += row.count;
    entry.spellings.set(row._id, (entry.spellings.get(row._id) || 0) + row.count);
    merged.set(key, entry);
  }

  const result = new Map();
  for (const [key, entry] of merged) {
    // Show the spelling people use most
    const label = [...entry.spellings.entries()].sort((a, b) => b[1] - a[1])[0][0];
    result.set(key, { count: entry.count, label });
  }
  return result;
}

module.exports = { getWindow, dayBuckets, inWindow, countWithTrend, average, dailyCounts, mergeSkillRows };