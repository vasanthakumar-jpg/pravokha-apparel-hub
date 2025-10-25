export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: {
    size: string;
    stock: number;
  }[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  variants: ProductVariant[];
  sku: string;
  featured?: boolean;
  newArrival?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Classic Cotton Tee",
    slug: "classic-cotton-tee",
    description: "Premium quality cotton t-shirt with a comfortable fit. Perfect for everyday wear with breathable fabric that keeps you cool all day.",
    price: 999,
    discountPrice: 799,
    category: "t-shirts",
    rating: 4.5,
    reviews: 128,
    sku: "CCT-001",
    featured: true,
    newArrival: true,
    variants: [
      {
        id: "1-teal",
        colorName: "Teal",
        colorHex: "#0F6B66",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 20 },
          { size: "XL", stock: 8 },
        ],
      },
      {
        id: "1-black",
        colorName: "Black",
        colorHex: "#1E293B",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 12 },
          { size: "M", stock: 18 },
          { size: "L", stock: 15 },
          { size: "XL", stock: 10 },
        ],
      },
      {
        id: "1-white",
        colorName: "White",
        colorHex: "#F8FAFC",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 20 },
          { size: "M", stock: 25 },
          { size: "L", stock: 18 },
          { size: "XL", stock: 12 },
        ],
      },
      {
        id: "1-coral",
        colorName: "Coral",
        colorHex: "#FF6B61",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 12 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 5 },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Athletic Track Pants",
    slug: "athletic-track-pants",
    description: "Comfortable track pants with moisture-wicking fabric. Ideal for workouts or casual wear with elastic waistband and side pockets.",
    price: 1499,
    discountPrice: 1199,
    category: "track-pants",
    rating: 4.7,
    reviews: 95,
    sku: "ATP-001",
    featured: true,
    variants: [
      {
        id: "2-black",
        colorName: "Black",
        colorHex: "#1E293B",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 15 },
          { size: "M", stock: 20 },
          { size: "L", stock: 18 },
          { size: "XL", stock: 12 },
        ],
      },
      {
        id: "2-navy",
        colorName: "Navy Blue",
        colorHex: "#1e3a8a",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 12 },
          { size: "XL", stock: 8 },
        ],
      },
      {
        id: "2-grey",
        colorName: "Grey",
        colorHex: "#64748b",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 12 },
          { size: "M", stock: 18 },
          { size: "L", stock: 15 },
          { size: "XL", stock: 10 },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Summer Casual Shorts",
    slug: "summer-casual-shorts",
    description: "Lightweight and breathable shorts perfect for summer. Features multiple pockets and adjustable drawstring waist.",
    price: 899,
    discountPrice: 699,
    category: "shorts",
    rating: 4.3,
    reviews: 76,
    sku: "SCS-001",
    newArrival: true,
    variants: [
      {
        id: "3-khaki",
        colorName: "Khaki",
        colorHex: "#d4a373",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 12 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 6 },
        ],
      },
      {
        id: "3-olive",
        colorName: "Olive Green",
        colorHex: "#556b2f",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 12 },
          { size: "XL", stock: 8 },
        ],
      },
      {
        id: "3-navy",
        colorName: "Navy",
        colorHex: "#1e3a8a",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 12 },
          { size: "M", stock: 18 },
          { size: "L", stock: 15 },
          { size: "XL", stock: 10 },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Premium V-Neck Tee",
    slug: "premium-v-neck-tee",
    description: "Stylish v-neck t-shirt made from premium cotton blend. Offers a modern fit with superior comfort.",
    price: 1099,
    category: "t-shirts",
    rating: 4.6,
    reviews: 104,
    sku: "PVT-001",
    featured: true,
    variants: [
      {
        id: "4-white",
        colorName: "White",
        colorHex: "#F8FAFC",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 15 },
          { size: "M", stock: 20 },
          { size: "L", stock: 18 },
          { size: "XL", stock: 12 },
        ],
      },
      {
        id: "4-black",
        colorName: "Black",
        colorHex: "#1E293B",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 18 },
          { size: "M", stock: 22 },
          { size: "L", stock: 20 },
          { size: "XL", stock: 15 },
        ],
      },
      {
        id: "4-grey",
        colorName: "Grey",
        colorHex: "#64748b",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 12 },
          { size: "M", stock: 16 },
          { size: "L", stock: 14 },
          { size: "XL", stock: 10 },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Sport Performance Shorts",
    slug: "sport-performance-shorts",
    description: "High-performance athletic shorts with quick-dry technology. Perfect for intense workouts and running.",
    price: 1199,
    discountPrice: 999,
    category: "shorts",
    rating: 4.8,
    reviews: 142,
    sku: "SPS-001",
    newArrival: true,
    variants: [
      {
        id: "5-black",
        colorName: "Black",
        colorHex: "#1E293B",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 12 },
          { size: "XL", stock: 8 },
        ],
      },
      {
        id: "5-teal",
        colorName: "Teal",
        colorHex: "#0F6B66",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 12 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 6 },
        ],
      },
      {
        id: "5-coral",
        colorName: "Coral",
        colorHex: "#FF6B61",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 12 },
          { size: "M", stock: 18 },
          { size: "L", stock: 15 },
          { size: "XL", stock: 10 },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Comfort Fit Track Pants",
    slug: "comfort-fit-track-pants",
    description: "Relaxed fit track pants with soft fleece lining. Features zippered pockets and tapered ankles.",
    price: 1699,
    category: "track-pants",
    rating: 4.4,
    reviews: 88,
    sku: "CFT-001",
    variants: [
      {
        id: "6-charcoal",
        colorName: "Charcoal",
        colorHex: "#334155",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 12 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 6 },
        ],
      },
      {
        id: "6-maroon",
        colorName: "Maroon",
        colorHex: "#7f1d1d",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 6 },
          { size: "M", stock: 10 },
          { size: "L", stock: 8 },
          { size: "XL", stock: 4 },
        ],
      },
      {
        id: "6-navy",
        colorName: "Navy",
        colorHex: "#1e3a8a",
        images: ["/api/placeholder/800/800", "/api/placeholder/800/800"],
        sizes: [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 12 },
          { size: "XL", stock: 8 },
        ],
      },
    ],
  },
];

export const categories = [
  { id: "all", name: "All Products", slug: "all" },
  { id: "t-shirts", name: "T-Shirts", slug: "t-shirts" },
  { id: "track-pants", name: "Track Pants", slug: "track-pants" },
  { id: "shorts", name: "Shorts", slug: "shorts" },
];
