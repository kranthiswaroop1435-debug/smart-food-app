// Sample food data for the Smart Food Ordering System
// This data represents a variety of food items across different categories

export const foodCategories = [
  "All",
  "Pizza",
  "Burgers",
  "Chinese",
  "Desserts",
  "Beverages"
];

export const foodItems = [
  // Pizza Category
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, tomatoes, and basil on a crispy thin crust",
    price: 12.99,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  {
    id: 2,
    name: "Pepperoni Feast",
    description: "Loaded with pepperoni slices and extra cheese for meat lovers",
    price: 15.99,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    vegetarian: false,
    spicy: false
  },
  {
    id: 3,
    name: "Veggie Supreme",
    description: "Garden fresh vegetables including bell peppers, onions, mushrooms, and olives",
    price: 14.49,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  
  // Burgers Category
  {
    id: 4,
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce",
    price: 9.99,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    vegetarian: false,
    spicy: false
  },
  {
    id: 5,
    name: "Double Bacon Burger",
    description: "Two beef patties with crispy bacon, BBQ sauce, and onion rings",
    price: 12.99,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
    vegetarian: false,
    spicy: false
  },
  {
    id: 6,
    name: "Veggie Burger",
    description: "Plant-based patty with avocado, lettuce, and vegan mayo",
    price: 10.49,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  
  // Chinese Category
  {
    id: 7,
    name: "Chicken Fried Rice",
    description: "Wok-tossed rice with tender chicken, eggs, and mixed vegetables",
    price: 11.49,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    vegetarian: false,
    spicy: false
  },
  {
    id: 8,
    name: "Vegetable Chow Mein",
    description: "Stir-fried noodles with crisp vegetables in a savory sauce",
    price: 10.99,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  {
    id: 9,
    name: "Sweet & Sour Chicken",
    description: "Crispy chicken pieces in a tangy sweet and sour sauce with pineapple",
    price: 12.49,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop",
    vegetarian: false,
    spicy: false
  },
  {
    id: 10,
    name: "Szechuan Spicy Noodles",
    description: "Hot and spicy noodles with vegetables in authentic Szechuan sauce",
    price: 11.99,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: true
  },
  
  // Desserts Category
  {
    id: 11,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream",
    price: 6.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  {
    id: 12,
    name: "Ice Cream Sundae",
    description: "Three scoops of ice cream with chocolate sauce, whipped cream, and cherry",
    price: 5.49,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  {
    id: 13,
    name: "Cheesecake Slice",
    description: "Creamy New York style cheesecake with graham cracker crust",
    price: 5.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  
  // Beverages Category
  {
    id: 14,
    name: "Fresh Mango Smoothie",
    description: "Refreshing blend of fresh mangoes, yogurt, and a touch of honey",
    price: 4.99,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  {
    id: 15,
    name: "Iced Coffee",
    description: "Cold brewed coffee served over ice with your choice of milk",
    price: 3.99,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  },
  {
    id: 16,
    name: "Berry Blast Juice",
    description: "Mixed berry juice with strawberries, blueberries, and raspberries",
    price: 4.49,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
    vegetarian: true,
    spicy: false
  }
];

// Helper function to get items by category
export const getItemsByCategory = (category) => {
  if (category === "All") {
    return foodItems;
  }
  return foodItems.filter(item => item.category === category);
};

// Helper function to get item by ID
export const getItemById = (id) => {
  return foodItems.find(item => item.id === id);
};