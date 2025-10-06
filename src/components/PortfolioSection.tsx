import menShirt1 from "@/assets/men-shirt-1.jpg";
import menShirt2 from "@/assets/men-shirt-2.jpg";
import womenTop1 from "@/assets/women-top-1.jpg";
import womenTop2 from "@/assets/women-top-2.jpg";
import indianFemaleStudio from "@/assets/models/indian-female-studio.jpg";
import indianMaleStudio from "@/assets/models/indian-male-studio.jpg";
import aiPhotoshootDemo from "@/assets/ai-photoshoot-demo.jpg";
import virtualTryonDemo from "@/assets/virtual-tryon-demo.jpg";

const PortfolioSection = () => {
  const portfolioItems = [
    {
      image: aiPhotoshootDemo,
      caption: "AI-generated photoshoot from flatlay",
      type: "AI Photoshoot"
    },
    {
      image: virtualTryonDemo,
      caption: "Virtual try-on sample",
      type: "Virtual Try-On"
    },
    {
      image: indianFemaleStudio,
      caption: "Studio-quality AI model",
      type: "AI Photoshoot"
    },
    {
      image: indianMaleStudio,
      caption: "Professional model generation",
      type: "AI Photoshoot"
    },
    {
      image: menShirt1,
      caption: "Product to model transformation",
      type: "AI Photoshoot"
    },
    {
      image: womenTop1,
      caption: "Instant model visualization",
      type: "AI Photoshoot"
    },
    {
      image: menShirt2,
      caption: "Virtual garment fitting",
      type: "Virtual Try-On"
    },
    {
      image: womenTop2,
      caption: "Real-time try-on preview",
      type: "Virtual Try-On"
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="heading-section mb-6">
            Our Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See the quality and realism our AI technology delivers for fashion brands
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl shadow-card hover:shadow-glow transition-all duration-300 animate-fade-up animate-delay-${(index + 1) * 100}`}
            >
              <img 
                src={item.image} 
                alt={item.caption}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
                  <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full mb-2">
                    {item.type}
                  </span>
                  <p className="text-sm font-medium">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All images generated using our AI technology
          </p>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
