import bcrypt from "bcryptjs";

export interface DBUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  role: "USER" | "ADMIN";
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "PIZZA" | "BURGERS" | "PASTA" | "SIDES" | "BEVERAGES" | "DESSERTS";
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBOrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem: DBMenuItem;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

export interface DBOrderStatusLog {
  id: string;
  orderId: string;
  status: "ORDER_RECEIVED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  note: string | null;
  timestamp: Date;
}

export interface DBOrder {
  id: string;
  orderNumber: string;
  userId: string;
  user?: { name: string; email: string };
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes: string | null;
  status: "ORDER_RECEIVED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  items: DBOrderItem[];
  statusHistory: DBOrderStatusLog[];
  createdAt: Date;
  updatedAt: Date;
}

// Global in-memory storage for persistent hot-reload state
declare global {
  var __fooddash_db: {
    users: Map<string, DBUser>;
    menuItems: Map<string, DBMenuItem>;
    orders: Map<string, DBOrder>;
    initialized: boolean;
  } | undefined;
}

if (!globalThis.__fooddash_db) {
  globalThis.__fooddash_db = {
    users: new Map(),
    menuItems: new Map(),
    orders: new Map(),
    initialized: false,
  };
}

const store = globalThis.__fooddash_db;

const INITIAL_MENU: Omit<DBMenuItem, "id" | "createdAt" | "updatedAt">[] = [
  // Pizza
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, San Marzano tomatoes, and basil on a crispy thin crust.",
    price: 299,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    category: "PIZZA",
    isAvailable: true,
  },
  {
    name: "Pepperoni Feast",
    description: "Loaded with double pepperoni, mozzarella cheese, and our signature marinara sauce.",
    price: 399,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    category: "PIZZA",
    isAvailable: true,
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Smoky BBQ sauce, grilled chicken, red onions, and cilantro on a garlic butter crust.",
    price: 449,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    category: "PIZZA",
    isAvailable: true,
  },
  // Burgers
  {
    name: "Classic Smash Burger",
    description: "Double smashed patties with American cheese, pickles, onions, and special sauce.",
    price: 199,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    category: "BURGERS",
    isAvailable: true,
  },
  {
    name: "Spicy Chicken Burger",
    description: "Crispy fried chicken with sriracha mayo, jalapeños, lettuce, and coleslaw.",
    price: 229,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80",
    category: "BURGERS",
    isAvailable: true,
  },
  // Pasta
  {
    name: "Penne Arrabbiata",
    description: "Penne pasta in a spicy tomato sauce with garlic, chili flakes, and fresh parsley.",
    price: 249,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d628169a?auto=format&fit=crop&w=600&q=80",
    category: "PASTA",
    isAvailable: true,
  },
  {
    name: "Creamy Alfredo",
    description: "Fettuccine in a rich, creamy Parmesan Alfredo sauce with grilled chicken and mushrooms.",
    price: 329,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    category: "PASTA",
    isAvailable: true,
  },
  // Sides
  {
    name: "Garlic Bread",
    description: "Toasted ciabatta with roasted garlic butter, herbs, and melted mozzarella.",
    price: 129,
    image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&q=80",
    category: "SIDES",
    isAvailable: true,
  },
  {
    name: "Loaded Fries",
    description: "Crispy golden fries topped with cheese sauce, bacon bits, jalapeños, and sour cream.",
    price: 179,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    category: "SIDES",
    isAvailable: true,
  },
  // Beverages
  {
    name: "Fresh Lime Soda",
    description: "Freshly squeezed lime with soda water, a hint of mint, and your choice of sweet or salted.",
    price: 79,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed514?auto=format&fit=crop&w=600&q=80",
    category: "BEVERAGES",
    isAvailable: true,
  },
  {
    name: "Mango Smoothie",
    description: "Thick and creamy alphonso mango smoothie blended with yogurt and a touch of honey.",
    price: 149,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
    category: "BEVERAGES",
    isAvailable: true,
  },
  {
    name: "Cold Coffee",
    description: "Rich cold brew coffee blended with milk, vanilla ice cream, and chocolate drizzle.",
    price: 129,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    category: "BEVERAGES",
    isAvailable: true,
  },
  // Desserts
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
    price: 199,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    category: "DESSERTS",
    isAvailable: true,
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers, mascarpone cream, and cocoa.",
    price: 249,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
    category: "DESSERTS",
    isAvailable: true,
  },
];

// Force reset menu items so fresh URLs are always applied
store.menuItems.clear();
INITIAL_MENU.forEach((item, idx) => {
  const id = `item_${idx + 1}`;
  store.menuItems.set(id, {
    ...item,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

async function ensureSeeded() {
  if (store.initialized) return;

  // Seed Admin
  const adminId = "user_admin";
  const adminPass = await bcrypt.hash("admin123", 10);
  store.users.set(adminId, {
    id: adminId,
    name: "Admin",
    email: "admin@fooddash.com",
    phone: "+91 9999999999",
    password: adminPass,
    role: "ADMIN",
    address: "FoodDash Kitchen HQ, Mumbai",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Seed Demo User
  const demoUserId = "user_demo";
  const userPass = await bcrypt.hash("user123", 10);
  store.users.set(demoUserId, {
    id: demoUserId,
    name: "John Doe",
    email: "user@fooddash.com",
    phone: "+91 9876543210",
    password: userPass,
    role: "USER",
    address: "123 Main Street, Apartment 4B, Mumbai 400001",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Seed sample order
  const sampleOrderId = "order_sample_1";
  const sampleItems: DBOrderItem[] = [
    {
      id: "oi_1",
      orderId: sampleOrderId,
      menuItemId: "item_1",
      menuItem: store.menuItems.get("item_1")!,
      quantity: 1,
      unitPrice: 299,
      itemTotal: 299,
    },
    {
      id: "oi_2",
      orderId: sampleOrderId,
      menuItemId: "item_4",
      menuItem: store.menuItems.get("item_4")!,
      quantity: 2,
      unitPrice: 199,
      itemTotal: 398,
    },
  ];

  store.orders.set(sampleOrderId, {
    id: sampleOrderId,
    orderNumber: "ORD-9X8K2M",
    userId: demoUserId,
    user: { name: "John Doe", email: "user@fooddash.com" },
    customerName: "John Doe",
    customerPhone: "+91 9876543210",
    deliveryAddress: "123 Main Street, Apartment 4B, Mumbai 400001",
    deliveryNotes: "Ring the doorbell",
    status: "PREPARING",
    subtotal: 697,
    tax: 69.7,
    deliveryFee: 40,
    total: 806.7,
    items: sampleItems,
    statusHistory: [
      {
        id: "sh_1",
        orderId: sampleOrderId,
        status: "ORDER_RECEIVED",
        note: "Order received by kitchen",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
      },
      {
        id: "sh_2",
        orderId: sampleOrderId,
        status: "PREPARING",
        note: "Chef is preparing your delicious meal",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
  });

  store.initialized = true;
}

export const db = {
  async getMenuItems(category?: string) {
    await ensureSeeded();
    let items = Array.from(store.menuItems.values()).filter((i) => i.isAvailable);
    if (category && category !== "ALL") {
      items = items.filter((i) => i.category === category);
    }
    return items;
  },

  async getMenuItemById(id: string) {
    await ensureSeeded();
    return store.menuItems.get(id) || null;
  },

  async getUserByEmail(email: string) {
    await ensureSeeded();
    for (const u of store.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  },

  async getUserById(id: string) {
    await ensureSeeded();
    return store.users.get(id) || null;
  },

  async createUser(data: {
    name: string;
    email: string;
    phone?: string | null;
    password: string;
    role?: "USER" | "ADMIN";
    address?: string | null;
  }) {
    await ensureSeeded();
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user: DBUser = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      password: data.password,
      role: data.role || "USER",
      address: data.address || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.users.set(id, user);
    return user;
  },

  async createOrder(data: {
    userId: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryNotes?: string | null;
    items: { menuItemId: string; quantity: number }[];
  }) {
    await ensureSeeded();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let subtotal = 0;
    const orderItems: DBOrderItem[] = [];

    for (const itemInput of data.items) {
      const menuItem = store.menuItems.get(itemInput.menuItemId);
      if (!menuItem) throw new Error(`Item ${itemInput.menuItemId} not found`);

      const unitPrice = menuItem.price;
      const itemTotal = unitPrice * itemInput.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderId,
        menuItemId: menuItem.id,
        menuItem,
        quantity: itemInput.quantity,
        unitPrice,
        itemTotal,
      });
    }

    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const deliveryFee = 40;
    const total = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let orderNumber = "ORD-";
    for (let i = 0; i < 6; i++) {
      orderNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const initialLog: DBOrderStatusLog = {
      id: `sh_${Date.now()}`,
      orderId,
      status: "ORDER_RECEIVED",
      note: "Order placed successfully",
      timestamp: new Date(),
    };

    const user = store.users.get(data.userId);

    const order: DBOrder = {
      id: orderId,
      orderNumber,
      userId: data.userId,
      user: user ? { name: user.name, email: user.email } : undefined,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      deliveryNotes: data.deliveryNotes || null,
      status: "ORDER_RECEIVED",
      subtotal,
      tax,
      deliveryFee,
      total,
      items: orderItems,
      statusHistory: [initialLog],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    store.orders.set(orderId, order);
    return order;
  },

  async getOrderById(id: string) {
    await ensureSeeded();
    return store.orders.get(id) || null;
  },

  async getOrders(userId?: string, statusFilter?: string) {
    await ensureSeeded();
    let orders = Array.from(store.orders.values());

    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }

    if (statusFilter && statusFilter !== "ALL") {
      orders = orders.filter((o) => o.status === statusFilter);
    }

    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async updateOrderStatus(
    id: string,
    newStatus: "ORDER_RECEIVED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED",
    note?: string
  ) {
    await ensureSeeded();
    const order = store.orders.get(id);
    if (!order) return null;

    order.status = newStatus;
    order.updatedAt = new Date();
    order.statusHistory.push({
      id: `sh_${Date.now()}`,
      orderId: id,
      status: newStatus,
      note: note || `Status updated to ${newStatus.replace(/_/g, " ")}`,
      timestamp: new Date(),
    });

    return order;
  },
};
