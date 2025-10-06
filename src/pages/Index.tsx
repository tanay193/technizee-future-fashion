import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ValueSection from "@/components/ValueSection";
import PortfolioSection from "@/components/PortfolioSection";
import DemoSection from "@/components/DemoSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <ValueSection />
      <PortfolioSection />
      <DemoSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;