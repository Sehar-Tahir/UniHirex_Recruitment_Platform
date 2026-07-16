import React from 'react'
import { COLORS, fontBody } from "./theme";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/home/LandingPage";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import JobsListPage from "./pages/student/JobsListPage";
import JobDetailsPage from "./pages/student/JobDetailsPage";
import MyApplicationsPage from "./pages/student/MyApplicationsPage";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CompanyProfilePage from "./pages/recruiter/CompanyProfilePage";
import PostListingPage from "./pages/recruiter/PostListingPage";
import ManageListingsPage from "./pages/recruiter/ManageListingsPage";
import ApplicantsReviewPage from "./pages/recruiter/ApplicantsReviewPage";
import SearchCandidatesPage from "./pages/recruiter/SearchCandidatesPage";
import CandidateDetailsPage from "./pages/recruiter/CandidateDetailsPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageJobsPage from "./pages/admin/ManageJobsPage";

import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

import NotificationsPage from "./pages/NotificationsPage";
import { mockNotifications } from "./data/mockStudentData";
import { mockRecruiterNotifications } from "./data/mockRecruiterData";
import { mockAdminNotifications } from "./data/mockAdminData";

const App = () => {
  return (
    <>
      <AuthProvider>
      <div style={{ ...fontBody, color: COLORS.textDark, background: "#fff" }} className="overflow-x-hidden">

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/jobs" element={<JobsListPage mode="jobs" />} />
              <Route path="/student/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/student/internships" element={<JobsListPage mode="internships" />} />
              <Route path="/student/applications" element={<MyApplicationsPage />} />
              <Route path="/student/notifications" element={<NotificationsPage role="student" initialData={mockNotifications} />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/company" element={<CompanyProfilePage />} />
              <Route path="/recruiter/post-listing" element={<PostListingPage />} />
              <Route path="/recruiter/listings" element={<ManageListingsPage />} />
              <Route path="/recruiter/listings/:id/applicants" element={<ApplicantsReviewPage />} />
              <Route path="/recruiter/candidates" element={<SearchCandidatesPage />} />
               <Route path="/recruiter/candidates/:id" element={<CandidateDetailsPage />} />
              <Route path="/recruiter/notifications" element={<NotificationsPage role="recruiter" initialData={mockRecruiterNotifications} />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/jobs" element={<ManageJobsPage />} />
              <Route path="/admin/notifications" element={<NotificationsPage role="admin" initialData={mockAdminNotifications} />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </div>
    </AuthProvider>
    </>
  )
}

export default App
