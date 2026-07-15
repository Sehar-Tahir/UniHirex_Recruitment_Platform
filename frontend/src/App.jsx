import React from 'react'
import { COLORS, fontBody } from "./theme";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/home/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
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


const App = () => {
  return (
    <>
      <AuthProvider>
      <div style={{ ...fontBody, color: COLORS.textDark, background: "#fff" }} className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/jobs" element={<JobsListPage mode="jobs" />} />
              <Route path="/student/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/student/internships" element={<JobsListPage mode="internships" />} />
              <Route path="/student/applications" element={<MyApplicationsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/company" element={<CompanyProfilePage />} />
              <Route path="/recruiter/post-listing" element={<PostListingPage />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </AuthProvider>
    </>
  )
}

export default App
