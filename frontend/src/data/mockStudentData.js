// Temporary mock data — replace with real API calls in Phase 2 (backend integration)

export const mockProfile = {
  completion: 68,
  missing: ["Resume", "Certifications"],
};

export const mockRecommendedJobs = [
  { id: 1, title: "Frontend Developer Intern", company: "Techverse Solutions", location: "Lahore, Pakistan", type: "Internship" },
  { id: 2, title: "MERN Stack Developer", company: "NovaSoft", location: "Remote", type: "Full-time" },
  { id: 3, title: "React Developer", company: "CodeCrafters", location: "Karachi, Pakistan", type: "Part-time" },
];

export const mockRecommendedInternships = [
  { id: 1, title: "UI/UX Design Intern", company: "PixelWorks", location: "Islamabad, Pakistan", type: "Internship" },
  { id: 2, title: "Backend Developer Intern", company: "ByteForge", location: "Remote", type: "Internship" },
];

export const mockRecentApplications = [
  { id: 1, title: "Frontend Developer Intern", company: "Techverse Solutions", status: "Under Review", appliedOn: "2026-07-08" },
  { id: 2, title: "React Developer", company: "CodeCrafters", status: "Shortlisted", appliedOn: "2026-07-05" },
  { id: 3, title: "Backend Intern", company: "ByteForge", status: "Rejected", appliedOn: "2026-06-29" },
];

export const mockNotifications = [
  { id: 1, text: "Your application to Techverse Solutions is under review.", time: "2h ago" },
  { id: 2, text: "New job match: React Developer at CodeCrafters.", time: "1d ago" },
  { id: 3, text: "CodeCrafters shortlisted your application!", time: "2d ago" },
];