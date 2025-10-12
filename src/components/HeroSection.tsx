import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/fashion-tech-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center hero-bg overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-hero-bg/70 to-hero-bg-light/60 md:from-hero-bg/90 md:to-hero-bg-light/80" />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-5xl mx-auto animate-fade-up">
          <h1 className="heading-hero mb-6 leading-tight">
            AI Photoshoots & Virtual Try-On for Fashion Brands
          </h1>

          <p className="text-2xl md:text-3xl mb-4 font-semibold">
            No Models. No Studio. Just Upload & Get Stunning Results.
          </p>

          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Save 90% on photoshoot costs. Launch collections 3× faster. Generate professional model images in minutes.
          </p>

          <div className="mb-16">
            <Button
              size="lg"
              className="bg-white text-hero-bg hover:bg-white/90 font-bold px-10 py-6 text-xl shadow-glow hover:scale-105 transition-transform duration-300"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm md:text-base">Trusted by 500+ Fashion Brands</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm md:text-base">90% Cost Reduction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm md:text-base">Launch 3× Faster</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white/70" />
      </div>
    </section>
  );
};

export default HeroSection;