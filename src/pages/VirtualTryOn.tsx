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
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/676f11a3-0467-482a-bd66-aaf29c1ea20d.png" 
                alt="Technizee Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
              <Link to="/ai-photoshoot">
                <Button className="btn-primary">AI Photoshoot</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Virtual Try-On Store
          </h1>
          <p className="text-muted-foreground">
            Try our clothes virtually before you buy. Upload your photo or use camera to see how they look on you.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-4 relative overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-destructive">
                  Sale
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground ml-1">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-foreground">{product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    className="btn-primary"
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