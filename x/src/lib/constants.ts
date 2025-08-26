export const CATEGORIES = [
  { id: "all", name: "All", filter: null },
  { id: "tshirts", name: "T-Shirts", filter: "tshirts" },
  { id: "hoodies", name: "Hoodies", filter: "hoodies" },
  { id: "accessories", name: "Accessories", filter: "accessories" },
];

export const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery", icon: "fas fa-money-bill-wave" },
  { id: "card", name: "Credit/Debit Card", icon: "fas fa-credit-card" },
  { id: "transfer", name: "Bank Transfer", icon: "fas fa-university" },
];

export const SIZE_GUIDE = {
  tshirts: {
    title: "T-Shirt Measurements (cm)",
    measurements: [
      { size: "XS", chest: 86, length: 66, shoulder: 41 },
      { size: "S", chest: 91, length: 69, shoulder: 43 },
      { size: "M", chest: 96, length: 72, shoulder: 45 },
      { size: "L", chest: 101, length: 75, shoulder: 47 },
      { size: "XL", chest: 106, length: 78, shoulder: 49 },
      { size: "XXL", chest: 111, length: 81, shoulder: 51 },
    ],
  },
  hoodies: {
    title: "Hoodie Measurements (cm)",
    measurements: [
      { size: "S", chest: 95, length: 70, shoulder: 45 },
      { size: "M", chest: 100, length: 73, shoulder: 47 },
      { size: "L", chest: 105, length: 76, shoulder: 49 },
      { size: "XL", chest: 110, length: 79, shoulder: 51 },
      { size: "XXL", chest: 115, length: 82, shoulder: 53 },
    ],
  },
};

export const LIFESTYLE_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    alt: "Urban lifestyle with GrindCTRL t-shirt",
  },
  {
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    alt: "Street style with GrindCTRL hoodie",
  },
  {
    url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    alt: "Skate culture with GrindCTRL gear",
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    alt: "Casual styling with GrindCTRL accessories",
  },
];
