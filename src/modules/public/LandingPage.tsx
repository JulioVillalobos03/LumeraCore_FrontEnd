import PublicNavbar from "./PublicNavbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FinalCtaSection from "./components/FinalCtaSection";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-(--bg-app) overflow-hidden">
      <PublicNavbar />

      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
