// Temporary mock data — replace with real API calls in Phase 2

export const mockCompany = {
  name: "Techverse Solutions",
  industry: "Software Development",
  website: "https://techverse.example.com",
  logoUrl: null,
};

export const mockRecruiterStats = {
  activeListings: 4,
  totalApplicants: 27,
  shortlisted: 6,
  newThisWeek: 9,
};

export const mockRecentApplicants = [
  { id: 1, studentName: "Ahmed Raza", jobTitle: "Frontend Developer Intern", appliedOn: "2026-07-13", status: "Under Review" },
  { id: 2, studentName: "Fatima Noor", jobTitle: "MERN Stack Developer", appliedOn: "2026-07-12", status: "Shortlisted" },
  { id: 3, studentName: "Bilal Khan", jobTitle: "Frontend Developer Intern", appliedOn: "2026-07-11", status: "Under Review" },
  { id: 4, studentName: "Ayesha Malik", jobTitle: "React Developer", appliedOn: "2026-07-10", status: "Rejected" },
];

export const mockListings = [
  { id: 1, title: "Frontend Developer Intern", type: "Internship", applicants: 12, status: "Active", postedOn: "2026-07-01" },
  { id: 2, title: "MERN Stack Developer", type: "Full-time", applicants: 8, status: "Active", postedOn: "2026-06-28" },
  { id: 3, title: "React Developer", type: "Part-time", applicants: 5, status: "Active", postedOn: "2026-06-20" },
  { id: 4, title: "QA Intern", type: "Internship", applicants: 2, status: "Closed", postedOn: "2026-05-15" },
];

export const mockCandidates = [
  { id: 1, name: "Ahmed Raza", university: "IUB", department: "Information Technology", skills: ["React.js", "Node.js", "MongoDB"], cgpa: "3.72" },
  { id: 2, name: "Fatima Noor", university: "LUMS", department: "Computer Science", skills: ["React.js", "Redux Toolkit", "Tailwind CSS"], cgpa: "3.90" },
  { id: 3, name: "Bilal Khan", university: "FAST-NUCES", department: "Software Engineering", skills: ["Node.js", "Express.js", "MongoDB"], cgpa: "3.55" },
];