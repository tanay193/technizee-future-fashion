import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Camera, Upload, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Import all clothing images
import menShirt1 from "@/assets/men-shirt-1.jpg";
import menShirt2 from "@/assets/men-shirt-2.jpg";
import menShirt3 from "@/assets/men-shirt-3.jpg";
import menPants1 from "@/assets/men-pants-1.jpg";
import menPants2 from "@/assets/men-pants-2.jpg";
import womenTop1 from "@/assets/women-top-1.jpg";
import womenTop2 from "@/assets/women-top-2.jpg";
import womenTop3 from "@/assets/women-top-3.jpg";
import womenBottom1 from "@/assets/women-bottom-1.jpg";
import womenBottom2 from "@/assets/women-bottom-2.jpg";

const VirtualTryOn = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const products = [
    // Men's Upper Garments
    {
      id: 1,
      name: "Men's Casual Shirt",
      price: "₹1,299",
      originalPrice: "₹1,999",
      image: menShirt1,
      category: "men",
      type: "upper",
      rating: 4.5,
      reviews: 128,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Navy"]
    },
    {
      id: 2,
      name: "Men's Formal Shirt",
      price: "₹1,899",
      originalPrice: "₹2,499",
      image: menShirt2,
      category: "men",
      type: "upper",
      rating: 4.6,
      reviews: 156,
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Blue", "Light Blue"]
    },
    {
      id: 3,
      name: "Men's Cotton T-Shirt",
      price: "₹999",
      originalPrice: "₹1,499",
      image: menShirt3,
      category: "men",
      type: "upper",
      rating: 4.3,
      reviews: 94,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Gray"]
    },
    // Men's Lower Garments
    {
      id: 4,
      name: "Men's Slim Fit Jeans",
      price: "₹2,199",
      originalPrice: "₹2,999",
      image: menPants1,
      category: "men",
      type: "lower",
      rating: 4.4,
      reviews: 203,
      sizes: ["28", "30", "32", "34", "36"],
      colors: ["Blue", "Black", "Gray"]
    },
    {
      id: 5,
      name: "Men's Formal Trousers",
      price: "₹1,799",
      originalPrice: "₹2,399",
      image: menPants2,
      category: "men",
      type: "lower",
      rating: 4.2,
      reviews: 87,
      sizes: ["28", "30", "32", "34", "36"],
      colors: ["Black", "Navy", "Gray"]
    },
    // Women's Upper Garments
    {
      id: 6,
      name: "Women's Elegant Blouse",
      price: "₹1,599",
      originalPrice: "₹2,199",
      image: womenTop1,
      category: "women",
      type: "upper",
      rating: 4.7,
      reviews: 145,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Pink", "Blue"]
    },
    {
      id: 7,
      name: "Women's Casual Top",
      price: "₹1,199",
      originalPrice: "₹1,699",
      image: womenTop2,
      category: "women",
      type: "upper",
      rating: 4.5,
      reviews: 112,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "White", "Red"]
    },
    {
      id: 8,
      name: "Women's Summer Dress",
      price: "₹2,299",
      originalPrice: "₹3,199",
      image: womenTop3,
      category: "women",
      type: "upper",
      rating: 4.8,
      reviews: 189,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Floral", "Solid", "Striped"]
    },
    // Women's Lower Garments
    {
      id: 9,
      name: "Women's Skinny Jeans",
      price: "₹1,899",
      originalPrice: "₹2,599",
      image: womenBottom1,
      category: "women",
      type: "lower",
      rating: 4.6,
      reviews: 167,
      sizes: ["24", "26", "28", "30", "32"],
      colors: ["Blue", "Black", "Light Blue"]
    },
    {
      id: 10,
      name: "Women's A-Line Skirt",
      price: "₹1,399",
      originalPrice: "₹1,899",
      image: womenBottom2,
      category: "women",
      type: "lower",
      rating: 4.4,
      reviews: 98,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Beige"]
    }
  ];

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
                  src={product.image} 
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