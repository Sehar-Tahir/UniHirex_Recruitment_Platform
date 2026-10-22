import React from 'react'

import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import TrustStrip from "../../components/home/TrustStrip";
import HowItWorks from "../../components/home/HowItWorks";
import AIShowcase from "../../components/home/AIShowcase";
import AudienceSection from "../../components/home/AudienceSection";
import Features from "../../components/home/Features";
import UseCases from "../../components/home/UseCases";
import StatsBand from "../../components/home/StatsBand";
import Testimonials from "../../components/home/Testimonials";
import CTABand from "../../components/home/CTABand";
import Footer from "../../components/home/Footer";

const landingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <AIShowcase />
      <AudienceSection />
      <Features />
      <UseCases />
      <StatsBand />
      <Testimonials />
      <CTABand />
      <Footer />
    </>
  )
}

export default landingPage
