import React from 'react'
import { COLORS, fontBody } from "./theme";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";


const App = () => {
  return (
    <>
      <div style={{ ...fontBody, color: COLORS.ink, background: "#fff" }} className="overflow-x-hidden">
        <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
      </div>
    </>
  )
}

export default App
