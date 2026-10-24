
import React from "react";
import { COLORS, fontHead } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

export default function About() {
return ( <StaticPageLayout
   title="About UniHirex"
   subtitle="Connecting university students with opportunities."
 > <p className="mb-5 leading-7">
UniHirex is a university recruitment platform designed to bridge the
gap between students seeking internships and entry-level opportunities
and recruiters looking for emerging talent. Students often struggle to
discover relevant opportunities, showcase their skills, and gain
professional visibility. At the same time, companies need a more
efficient way to connect with qualified university students. UniHirex
brings both sides together through one dedicated platform. </p>


  <p className="mb-5 leading-7">
    Students can create comprehensive profiles highlighting their
    education, skills, certifications, and projects, then apply directly
    for jobs and internships. Recruiters can publish job opportunities,
    discover student talent based on skills and universities, review
    applications, and manage their hiring pipeline through a centralized
    dashboard.
  </p>

  <h3
    className="text-xl font-semibold mt-8 mb-3"
    style={{ ...fontHead, color: COLORS.textDark }}
  >
    Where It Started
  </h3>

  <p className="mb-5 leading-7">
    UniHirex began as a Final Year Project at The Islamia University of
    Bahawalpur (IUB). It evolved into a full-stack MERN application,
    developed from the ground up with a consistent brand identity,
    thoughtful user experience, and dedicated dashboards for students,
    recruiters, and administrators.
  </p>

  <h3
    className="text-xl font-semibold mt-8 mb-3"
    style={{ ...fontHead, color: COLORS.textDark }}
  >
    Our Vision
  </h3>

  <p className="mb-5 leading-7">
    Our vision is to make the transition from university to professional
    life easier by helping students showcase their potential and connect
    with meaningful career opportunities. We aim to create a more
    accessible and efficient recruitment experience for both emerging
    talent and the organizations ready to hire them.
  </p>
</StaticPageLayout>


);
}
