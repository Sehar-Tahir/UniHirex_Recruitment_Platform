// Temporary mock data — replace with real API calls in Phase 2

export const mockAdminStats = {
  totalStudents: 342,
  totalRecruiters: 48,
  totalListings: 76,
  totalApplications: 891,
};

export const mockRecentActivity = [
  { id: 1, text: "New recruiter registered: Techverse Solutions", time: "1h ago" },
  { id: 2, text: "Student Ahmed Raza applied to Frontend Developer Intern", time: "3h ago" },
  { id: 3, text: "NovaSoft posted a new listing: MERN Stack Developer", time: "5h ago" },
  { id: 4, text: "42 new student registrations this week", time: "1d ago" },
];

export const mockAdminNotifications = [
  { id: 1, text: "New recruiter registration pending review: Techverse Solutions.", time: "1h ago" },
  { id: 2, text: "Listing 'React Developer' by CodeCrafters was auto-flagged for suspicious salary range.", time: "5h ago" },
  { id: 3, text: "Weekly platform report is ready.", time: "1d ago" },
];

export const mockUsers = [
  { id: 1, name: "Ahmed Raza", email: "ahmed.raza@iub.edu.pk", role: "student", status: "Active", joinedOn: "2026-06-01" },
  { id: 2, name: "Fatima Noor", email: "fatima.noor@lums.edu.pk", role: "student", status: "Active", joinedOn: "2026-06-03" },
  { id: 3, name: "Techverse Solutions", email: "hr@techverse.example.com", role: "recruiter", status: "Active", joinedOn: "2026-05-20" },
  { id: 4, name: "NovaSoft", email: "careers@novasoft.example.com", role: "recruiter", status: "Active", joinedOn: "2026-05-25" },
  { id: 5, name: "Bilal Khan", email: "bilal.khan@nu.edu.pk", role: "student", status: "Suspended", appliedOn: "2026-06-10", joinedOn: "2026-06-10" },
];

export const mockAdminListings = [
  { id: 1, title: "Frontend Developer Intern", company: "Techverse Solutions", type: "Internship", status: "Active", postedOn: "2026-07-01" },
  { id: 2, title: "MERN Stack Developer", company: "NovaSoft", type: "Full-time", status: "Active", postedOn: "2026-06-28" },
  { id: 3, title: "React Developer", company: "CodeCrafters", type: "Part-time", status: "Flagged", postedOn: "2026-06-20" },
  { id: 4, title: "QA Intern", company: "ByteForge", type: "Internship", status: "Closed", postedOn: "2026-05-15" },
];