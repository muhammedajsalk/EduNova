import React from "react";
import Navbar from "./homePage Components/navbar";
import HeroSection from "./homePage Components/hero";
import HomeCourses from "./homePage Components/Homecourses";
import StatsAndHowItWorks from "./homePage Components/StatsAndHowIsWork";
import MentorSection from "./homePage Components/MentorSection";
import CommunitySection from "./homePage Components/CommunitySection";
import Footer from "./homePage Components/Footer";

function HomePage() {
  return (
    <div className="bg-white w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-24">
        <HeroSection />
        <HomeCourses/>
        <StatsAndHowItWorks/>
        <MentorSection/>
        <CommunitySection/>
        <Footer/>
      </main>
    </div>

  );
}

export default React.memo(HomePage)
