import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const menuItems = [
  // Pizza
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, San Marzano tomatoes, and basil on a crispy thin crust.",
    price: 299,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop",
    category: "PIZZA",
  },
  {
    name: "Pepperoni Feast",
    description: "Loaded with double pepperoni, mozzarella cheese, and our signature marinara sauce.",
    price: 399,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop",
    category: "PIZZA",
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Smoky BBQ sauce, grilled chicken, red onions, and cilantro on a garlic butter crust.",
    price: 449,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop",
    category: "PIZZA",
  },
  // Burgers
  {
    name: "Classic Smash Burger",
    description: "Double smashed patties with American cheese, pickles, onions, and special sauce.",
    price: 199,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop",
    category: "BURGERS",
  },
  {
    name: "Spicy Chicken Burger",
    description: "Crispy fried chicken with sriracha mayo, jalapeños, lettuce, and coleslaw.",
    price: 229,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop",
    category: "BURGERS",
  },
  // Pasta
  {
    name: "Penne Arrabbiata",
    description: "Penne pasta in a spicy tomato sauce with garlic, chili flakes, and fresh parsley.",
    price: 249,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&h=400&fit=crop",
    category: "PASTA",
  },
  {
    name: "Creamy Alfredo",
    description: "Fettuccine in a rich, creamy Parmesan Alfredo sauce with grilled chicken and mushrooms.",
    price: 329,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=400&fit=crop",
    category: "PASTA",
  },
  // Sides
  {
    name: "Garlic Bread",
    description: "Toasted ciabatta with roasted garlic butter, herbs, and melted mozzarella.",
    price: 129,
    image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&h=400&fit=crop",
    category: "SIDES",
  },
  {
    name: "Loaded Fries",
    description: "Crispy golden fries topped with cheese sauce, bacon bits, jalapeños, and sour cream.",
    price: 179,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop",
    category: "SIDES",
  },
  // Beverages
  {
    name: "Fresh Lime Soda",
    description: "Freshly squeezed lime with soda water, a hint of mint, and your choice of sweet or salted.",
    price: 79,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=500&h=400&fit=crop",
    category: "BEVERAGES",
  },
  {
    name: "Mango Smoothie",
    description: "Thick and creamy alphonso mango smoothie blended with yogurt and a touch of honey.",
    price: 149,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&h=400&fit=crop",
    category: "BEVERAGES",
  },
  {
    name: "Cold Coffee",
    description: "Rich cold brew coffee blended with milk, vanilla ice cream, and chocolate drizzle.",
    price: 129,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
    category: "BEVERAGES",
  },
  // Desserts
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
    price: 199,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&h=400&fit=crop",
    category: "DESSERTS",
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers, mascarpone cream, and cocoa.",
    price: 249,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop",
    category: "DESSERTS",
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clear existing data
  await prisma.orderStatusLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.user.deleteMany();

  // Seed admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@fooddash.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+91 9999999999",
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Seed demo user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "user@fooddash.com",
      password: userPassword,
      role: "USER",
      phone: "+91 9876543210",
      address: "123 Main Street, Apartment 4B, Mumbai 400001",
    },
  });
  console.log(`✅ Demo user created: ${user.email}`);

  // Seed menu items
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`✅ ${menuItems.length} menu items created`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
