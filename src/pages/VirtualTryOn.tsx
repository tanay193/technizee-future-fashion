import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Camera, Upload, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { products } from "@/data/products";

const VirtualTryOn = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Optimized for TV */}
      <header className="border-b border-border">
        <div className="container mx-auto px-12 py-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/676f11a3-0467-482a-bd66-aaf29c1ea20d.png" 
                alt="Technizee Logo" 
                className="h-16 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-8">
              <Button variant="outline" className="text-xl px-8 py-4 h-auto">
                <ShoppingCart className="h-6 w-6 mr-3" />
                Cart (0)
              </Button>
              <Link to="/ai-photoshoot">
                <Button className="btn-primary text-xl px-8 py-4 h-auto">AI Photoshoot</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-12 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-foreground mb-8">
            Virtual Try-On Store
          </h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Try our clothes virtually before you buy. Upload your photo or use camera to see how they look on you.
          </p>
        </div>

        {/* Products Grid - Optimized for horizontal TV layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="p-6 hover:shadow-glow hover:scale-105 transition-all duration-300">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-6 relative overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-destructive text-lg px-3 py-1">
                  Sale
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg text-muted-foreground ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-foreground">{product.price}</span>
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                </div>

                <div className="flex flex-col space-y-3 pt-2">
                  <Link 
                    to={`/product/${product.id}`}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full text-lg py-3 h-auto">
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    className="btn-primary w-full text-lg py-3 h-auto"
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    Try On
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;