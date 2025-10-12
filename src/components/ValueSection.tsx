import { DollarSign, Clock, Rocket, TrendingUp } from "lucide-react";

const ValueSection = () => {
    const benefits = [
        {
            icon: DollarSign,
            title: "Cut your photoshoot costs by 90%",
            description: "No more expensive studio sessions, models, or photographers"
        },
        {
            icon: Clock,
            title: "Generate model images in minutes",
            description: "What used to take weeks now happens in real-time"
        },
        {
            icon: Rocket,
            title: "Launch your collection 3× faster",
            description: "From design to market-ready product photos instantly"
        },
        {
            icon: TrendingUp,
            title: "Perfect for D2C, e-commerce, and boutique brands",
            description: "Scalable solution that grows with your business"
        }
    ];

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-up">
                    <h2 className="heading-section mb-6">
                        Why Fashion Brands Choose Us
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Transform your fashion business with measurable results
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className={`card-feature text-center animate-fade-up animate-delay-${(index + 1) * 100}`}
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                                <benefit.icon className="w-8 h-8 text-primary" />
                            </div>

                            <h3 className="text-lg font-bold mb-3 text-foreground">
                                {benefit.title}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValueSection;