import { useState } from "react";
import menShirt1 from "@/assets/men-shirt-1.jpg";
import menShirt2 from "@/assets/men-shirt-2.jpg";
import menShirt3 from "@/assets/men-shirt-3.jpg";
import menPants1 from "@/assets/men-pants-1.jpg";
import womenTop1 from "@/assets/women-top-1.jpg";
import womenTop2 from "@/assets/women-top-2.jpg";
import womenTop3 from "@/assets/women-top-3.jpg";
import womenBottom1 from "@/assets/women-bottom-1.jpg";
import indianFemaleStudio from "@/assets/models/indian-female-studio.jpg";
import indianMaleStudio from "@/assets/models/indian-male-studio.jpg";
import aiPhotoshootDemo from "@/assets/ai-photoshoot-demo.jpg";
import virtualTryonDemo from "@/assets/virtual-tryon-demo.jpg";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const portfolioItems = [
    {
      image: aiPhotoshootDemo,
      caption: "AI-generated photoshoot from flatlay",
      type: "AI Photoshoot",
      category: "women"
    },
    {
      image: indianFemaleStudio,
      caption: "Studio photoshoot - AI generated model",
      type: "AI Photoshoot",
      category: "women"
    },
    {
      image: indianMaleStudio,
      caption: "Professional male model - AI generated",
      type: "AI Photoshoot",
      category: "men"
    },
    {
      image: virtualTryonDemo,
      caption: "Virtual try-on with real user photo",
      type: "Virtual Try-On",
      category: "tryon"
    },
    {
      image: womenTop1,
      caption: "Women's top - AI photoshoot",
      type: "AI Photoshoot",
      category: "women"
    },
    {
      image: womenTop3,
      caption: "Elegant women's wear - AI model",
      type: "AI Photoshoot",
      category: "women"
    },
    {
      image: menShirt1,
      caption: "Men's shirt - Product to model",
      type: "AI Photoshoot",
      category: "men"
    },
    {
      image: menShirt3,
      caption: "Men's casual wear - AI photoshoot",
      type: "AI Photoshoot",
      category: "men"
    },
    {
      image: menShirt2,
      caption: "Virtual try-on - Men's shirt",
      type: "Virtual Try-On",
      category: "tryon"
    },
    {
      image: womenTop2,
      caption: "Real-time try-on preview",
      type: "Virtual Try-On",
      category: "tryon"
    },
    {
      image: menPants1,
      caption: "Men's pants - AI photoshoot",
      type: "AI Photoshoot",
      category: "men"
    },
    {
      image: womenBottom1,
      caption: "Women's bottoms - AI model showcase",
      type: "AI Photoshoot",
      category: "women"
    }
  ];

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="heading-section mb-6">
            Our Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            See the quality and realism our AI technology delivers for fashion brands
          </p>
          
          <Tabs defaultValue="all" className="w-full max-w-md mx-auto" onValueChange={setActiveFilter}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="men">Men's</TabsTrigger>
              <TabsTrigger value="women">Women's</TabsTrigger>
              <TabsTrigger value="tryon">Try-On</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredItems.map((item, index) => {
            const delayClass = index % 4 === 0 ? '' : index % 4 === 1 ? 'animate-delay-100' : index % 4 === 2 ? 'animate-delay-200' : 'animate-delay-300';
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-xl shadow-card hover:shadow-glow transition-all duration-300 animate-fade-up ${delayClass}`}
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
            );
          })}
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
