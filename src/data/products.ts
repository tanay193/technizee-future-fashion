// Centralized products data for Virtual Try-On and Product Detail pages
// Update this file when adding/removing products or images

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

export type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  images: string[]; // First image is the cover
  category: "men" | "women";
  type: "upper_body" | "lower_body" | "dresses"; // Match model categories
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
};

export const products: Product[] = [
  // Men's Upper Garments
  {
    id: 1,
    name: "Men's Casual Shirt",
    price: "₹1,299",
    originalPrice: "₹1,999",
    images: [menShirt1],
    category: "men",
    type: "upper_body",
    rating: 4.5,
    reviews: 128,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: 2,
    name: "Men's Formal Shirt",
    price: "₹1,899",
    originalPrice: "₹2,499",
    images: [menShirt2],
    category: "men",
    type: "upper_body",
    rating: 4.6,
    reviews: 156,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Light Blue"],
  },
  {
    id: 3,
    name: "Men's Cotton T-Shirt",
    price: "₹999",
    originalPrice: "₹1,499",
    images: [menShirt3],
    category: "men",
    type: "upper_body",
    rating: 4.3,
    reviews: 94,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Gray"],
  },
  // Men's Lower Garments
  {
    id: 4,
    name: "Men's Slim Fit Jeans",
    price: "₹2,199",
    originalPrice: "₹2,999",
    images: [menPants1],
    category: "men",
    type: "lower_body",
    rating: 4.4,
    reviews: 203,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black", "Gray"],
  },
  {
    id: 5,
    name: "Men's Formal Trousers",
    price: "₹1,799",
    originalPrice: "₹2,399",
    images: [menPants2],
    category: "men",
    type: "lower_body",
    rating: 4.2,
    reviews: 87,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Navy", "Gray"],
  },
  // Women's Upper Garments
  {
    id: 6,
    name: "Women's Elegant Blouse",
    price: "₹1,599",
    originalPrice: "₹2,199",
    images: [womenTop1],
    category: "women",
    type: "upper_body",
    rating: 4.7,
    reviews: 145,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Pink", "Blue"],
  },
  {
    id: 7,
    name: "Women's Casual Top",
    price: "₹1,199",
    originalPrice: "₹1,699",
    images: [womenTop2],
    category: "women",
    type: "upper_body",
    rating: 4.5,
    reviews: 112,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Red"],
  },
  {
    id: 8,
    name: "Women's Summer Dress",
    price: "₹2,299",
    originalPrice: "₹3,199",
    images: [womenTop3],
    category: "women",
    type: "dresses",
    rating: 4.8,
    reviews: 189,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral", "Solid", "Striped"],
  },
  // Women's Lower Garments
  {
    id: 9,
    name: "Women's Skinny Jeans",
    price: "₹1,899",
    originalPrice: "₹2,599",
    images: [womenBottom1],
    category: "women",
    type: "lower_body",
    rating: 4.6,
    reviews: 167,
    sizes: ["24", "26", "28", "30", "32"],
    colors: ["Blue", "Black", "Light Blue"],
  },
  {
    id: 10,
    name: "Women's A-Line Skirt",
    price: "₹1,399",
    originalPrice: "₹1,899",
    images: [womenBottom2],
    category: "women",
    type: "lower_body",
    rating: 4.4,
    reviews: 98,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Beige"],
  },
];
