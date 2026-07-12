import React from 'react'
import { COLORS, fontBody } from "./theme";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/home/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";


const App = () => {
  return (
    <>
      <div style={{ ...fontBody, color: COLORS.textDark, background: "#fff" }} className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </>
  )
}

export default App
