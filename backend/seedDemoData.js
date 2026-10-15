require("dotenv").config();

const crypto = require("crypto");
const mongoose = require("mongoose");

const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Interview = require("./models/Interview");
const ResumeAnalysis = require("./models/ResumeAnalysis");

// Usage:
// node seedDemoData.js --confirm  (create demo data)
// node seedDemoData.js --remove   (remove demo data created by this script)

const args = process.argv.slice(2);
const DEMO_EMAIL_SUFFIX = "@demo.unihirex.test";

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const between = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickMany = (arr, n) =>
  [...arr].sort(() => Math.random() - 0.5).slice(0, n);

const randomPast = (days) =>
  new Date(Date.now() - Math.pow(Math.random(), 1.5) * days * 86400000);

const randomBetween = (from, to) =>
  new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));

const randomPassword = () => crypto.randomBytes(16).toString("hex");

const COMPANIES = [
  "Techverse Solutions",
  "NovaSoft",
  "CodeCrafters",
  "PixelWorks",
  "ByteForge",
  "Northbridge Labs",
  "BrightPath Digital",
  "Vector Systems",
];

const FIRST = [
  "Ayesha", "Ahmed", "Fatima", "Bilal", "Hira", "Usman",
  "Sana", "Hamza", "Zainab", "Ali", "Maryam", "Omar",
];

const LAST = [
  "Khan", "Malik", "Raza", "Noor", "Ahmed", "Iqbal", "Sheikh", "Butt",
];

const CATEGORIES = [
  "Web Development", "Design", "Marketing", "Data Science",
  "Mobile Development",
];

const TYPES = ["Full-time", "Part-time", "Internship"];

const LEVELS = ["Entry Level", "Mid Level", "Senior Level"];

const LOCATIONS = [
  "Lahore, Pakistan",
  "Karachi, Pakistan",
  "Islamabad, Pakistan",
  "Remote",
];

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Full Stack Developer",
];

const SKILLS = [
  "React", "Node.js", "MongoDB", "Express", "JavaScript",
  "Python", "Figma", "SQL", "HTML", "CSS", "Git",
  "TypeScript", "Tailwind CSS", "Django", "Java",
];

const VARIANTS = {
  React: ["React", "ReactJS", "React.js"],
  "Node.js": ["Node.js", "NodeJS", "Node"],
};

const spell = (skill) =>
  VARIANTS[skill] ? pick(VARIANTS[skill]) : skill;

async function removeDemoData() {
  const users = await User.find({
    email: /@demo\.unihirex\.test$/,
  }).select("_id role");

  const userIds = users.map((user) => user._id);

  const recruiterIds = users
    .filter((user) => user.role === "recruiter")
    .map((user) => user._id);

  const jobIds = (
    await Job.find({
      postedBy: { $in: recruiterIds },
    }).select("_id")
  ).map((job) => job._id);

  await Application.deleteMany({
    $or: [
      { student: { $in: userIds } },
      { job: { $in: jobIds } },
    ],
  });

  await Job.deleteMany({ _id: { $in: jobIds } });

  await Interview.deleteMany({
    student: { $in: userIds },
  });

  await ResumeAnalysis.deleteMany({
    student: { $in: userIds },
  });

  await User.deleteMany({ _id: { $in: userIds } });

  console.log(
    `Removed ${userIds.length} demo users and their associated demo data.`
  );
}

async function createDemoData() {
  // Prevent duplicate demo accounts if the script has already been run.
  const existingDemoUser = await User.findOne({
    email: /@demo\.unihirex\.test$/,
  });

  if (existingDemoUser) {
    throw new Error(
      "Demo users already exist. Run with --remove first if you want to recreate the demo data."
    );
  }

  const recruiters = await Promise.all(
    COMPANIES.map((company, i) =>
      User.create({
        name: `Demo Recruiter ${i + 1}`,
        email: `recruiter${i + 1}${DEMO_EMAIL_SUFFIX}`,
        password: randomPassword(),
        role: "recruiter",
        companyName: company,
        status: "Active",
        isEmailVerified: true,
        createdAt: randomPast(90),
      })
    )
  );

  const students = await Promise.all(
    Array.from({ length: 40 }, (_, i) =>
      User.create({
        name: `${pick(FIRST)} ${pick(LAST)}`,
        email: `student${i + 1}${DEMO_EMAIL_SUFFIX}`,
        password: randomPassword(),
        role: "student",
        status: "Active",
        isEmailVerified: true,
        university: "Demo University",
        department: pick([
          "Information Technology",
          "Computer Science",
          "Software Engineering",
        ]),
        cgpa: (2.8 + Math.random() * 1.2).toFixed(2),
        skills: pickMany(SKILLS, between(3, 6)).map(spell),
        resumeUrl:
          Math.random() < 0.7
            ? "https://example.com/demo-resume.pdf"
            : "",
        aiUsage: {
          interviewsUsed: between(0, 2),
          resumeAnalysesUsed: between(0, 2),
        },
        aiAccessRequestedAt:
          i < 3
            ? new Date(Date.now() - between(0, 5) * 86400000)
            : undefined,
        createdAt: randomPast(90),
      })
    )
  );

  const jobs = await Promise.all(
    Array.from({ length: 30 }, () => {
      const recruiter = pick(recruiters);
      const roll = Math.random();

      return Job.create({
        title: pick(ROLES),
        category: pick(CATEGORIES),
        type: pick(TYPES),
        location: pick(LOCATIONS),
        salary: "PKR 40,000 - 70,000/mo",
        salaryMin: 40000,
        salaryMax: 70000,
        experienceLevel: pick(LEVELS),
        description: "Demo listing used to demonstrate the analytics.",
        requirements: pickMany(SKILLS, between(2, 4)).map(spell),
        status:
          roll < 0.78
            ? "Active"
            : roll < 0.88
              ? "Flagged"
              : "Closed",
        postedBy: recruiter._id,
        company: recruiter.companyName,
        createdAt: randomPast(90),
      });
    })
  );

  const used = new Set();
  const applications = [];

  while (applications.length < 120) {
    const student = pick(students);
    const job = pick(jobs);

    const key = `${student._id}-${job._id}`;

    if (used.has(key)) continue;

    used.add(key);

    const createdAt = randomBetween(job.createdAt, new Date());
    const roll = Math.random();

    const status =
      roll < 0.5
        ? "Under Review"
        : roll < 0.8
          ? "Shortlisted"
          : "Rejected";

    const doc = {
      student: student._id,
      job: job._id,
      status,
      createdAt,
    };

    if (status === "Shortlisted" && Math.random() < 0.5) {
      doc.interviewInvite = {
        dateTime: randomBetween(
          new Date(),
          new Date(Date.now() + 7 * 86400000)
        ),
        location: "Google Meet (demo)",
        message: "Demo invitation",
        sentAt: randomBetween(createdAt, new Date()),
      };
    }

    applications.push(doc);
  }

  await Application.create(applications);

  await Interview.create(
    Array.from({ length: 25 }, () => {
      const createdAt = randomPast(90);
      const completed = Math.random() < 0.8;

      return {
        student: pick(students)._id,
        role: pick(ROLES),
        level: pick(["Junior", "Mid", "Senior"]),
        type: pick(["Technical", "HR", "Behavioral", "Mixed"]),
        questionCount: 5,
        startedAt: createdAt,
        status: completed ? "Completed" : "Abandoned",
        overallScore: completed ? between(45, 92) : undefined,
        questions: completed
          ? [
              {
                question: "Demo question",
                answer: "Demo answer",
                score: between(5, 9),
                feedback: "Demo feedback",
              },
            ]
          : [],
        createdAt,
      };
    })
  );

  await ResumeAnalysis.create(
    Array.from({ length: 25 }, () => ({
      student: pick(students)._id,
      targetRole: pick(ROLES),
      version: 1,
      overallScore: between(40, 90),
      contentScore: between(40, 90),
      structureScore: between(40, 90),
      skillsScore: between(40, 90),
      languageScore: between(40, 90),
      atsScore: between(40, 90),
      summary: "Demo analysis",
      createdAt: randomPast(90),
    }))
  );

  console.log(
    "Created: 8 recruiters, 40 students, 30 jobs, 120 applications, 25 interviews, 25 resume analyses."
  );

  console.log("Remove demo data with: node seedDemoData.js --remove");
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from your .env file.");
  }

  if (!args.includes("--confirm") && !args.includes("--remove")) {
    console.log(
      "Add --confirm to create demo data, or --remove to delete it."
    );
    return;
  }

  if (args.includes("--confirm") && args.includes("--remove")) {
    throw new Error("Use either --confirm or --remove, not both.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const dbName = mongoose.connection.name;
    console.log(`Connected to database: ${dbName}`);

    // Permit only databases whose names contain "demo" or "test".
    // --force bypasses this check, so use it only when you understand the risk.
    if (
      !["demo", "test"].some((name) =>
        dbName.toLowerCase().includes(name)
      ) &&
      !args.includes("--force")
    ) {
      throw new Error(
        'Refusing to run: database name must contain "demo" or "test".'
      );
    }

    if (args.includes("--remove")) {
      await removeDemoData();
    } else {
      await createDemoData();
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exitCode = 1;
});

