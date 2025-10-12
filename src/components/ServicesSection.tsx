import { Camera, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ServicesSection = () => {
    const services = [
        {
            icon: Camera,
            title: "AI Photoshoot",
            description: "Generate studio-quality model images automatically",
            features: [
                "No expensive photoshoots needed",
                "Multiple model variations",
                "Professional studio quality",
                "Ready in minutes, not weeks"
            ],
            cta: "Try AI Photoshoot",
            link: "/ai-photoshoot"
        },
        {
            icon: Shirt,
            title: "Virtual Try-On",
            description: "Let customers visualize outfits on models or themselves",
            features: [
                "Reduce return rates by 40%",
                "Boost customer confidence",
                "Real-time visualization",
                "Works on any device"
            ],
            cta: "Try Virtual Try-On",
            link: "/virtual-tryon"
        }
    ];

    return (
        <section id="services" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-up">
                    <h2 className="heading-section mb-6">
                        Our Services
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Two powerful AI solutions designed specifically for fashion brands
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`card-feature text-center animate-fade-up animate-delay-${(index + 1) * 100}`}
                        >
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <service.icon className="w-10 h-10 text-primary" />
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-foreground">
                                {service.title}
                            </h3>

                            <p className="text-lg text-muted-foreground mb-6">
                                {service.description}
                            </p>

                            <ul className="space-y-3 mb-8 text-left">
                                {service.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center text-muted-foreground">
                                        <div className="w-2 h-2 rounded-full bg-primary mr-3 flex-shrink-0"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link to={service.link}>
                                <Button className="btn-primary w-full">
                                    {service.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;