import { useState } from "react";
import aiphotoshootdress from "@/assets/ai_photoshoot_dress.png"
import aiphotoshootsaree from "@/assets/ai_photoshoot_saree.png"
import aiphotoshootshirt from "@/assets/ai_photoshoot_shirt.png"
import aiphotoshoorttop from "@/assets/ai_photoshoot_top.png"
import virtualtryonsaree from "@/assets/virtual_tryon_saree_1.png"
import virtualtryonkurtaset from "@/assets/virtual_tryon_kurta_set.png"
import virtualtryonshirt from "@/assets/virtual_tryon_shirt.png"
import virtualtryontshirt from "@/assets/virtual_tryon_tshirt.png"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PortfolioSection = () => {
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const portfolioItems = [
        {
            image: aiphotoshootdress,
            caption: "AI-generated photoshoot from mannequin",
            type: "AI Photoshoot",
            category: "photoshoot"
        },
        {
            image: aiphotoshootsaree,
            caption: "Studio photoshoot - AI generated model",
            type: "AI Photoshoot",
            category: "photoshoot"
        },
        {
            image: aiphotoshootshirt,
            caption: "Professional male model - AI generated",
            type: "AI Photoshoot",
            category: "photoshoot"
        },
        {
            image: aiphotoshoorttop,
            caption: "Professional female model - AI generated",
            type: "AI Photoshoot",
            category: "photoshoot"
        },
        {
            image: virtualtryonsaree,
            caption: "Virtual try-on with real female user photo",
            type: "Virtual Try-On",
            category: "tryon"
        },
        {
            image: virtualtryonkurtaset,
            caption: "Virtual try-on with real female user photo",
            type: "Virtual Try-On",
            category: "tryon"
        },
        {
            image: virtualtryonshirt,
            caption: "Virtual try-on with real male user photo",
            type: "Virtual Try-On",
            category: "tryon"
        },
        {
            image: virtualtryontshirt,
            caption: "Virtual try-on with real male user photo",
            type: "Virtual Try-On",
            category: "tryon"
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
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="photoshoot">AI Photoshoot</TabsTrigger>
                            <TabsTrigger value="tryon">Virtual Try-On</TabsTrigger>
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
                                    className="w-full h-80 object-contain transition-transform duration-300 group-hover:scale-105"
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
                        All images generated using our AI Photoshoot & Virtual Try-On model
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;