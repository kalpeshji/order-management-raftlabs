import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

// Whether we have a real database connection
const hasDatabase = !!process.env.DATABASE_URL;

// ============================================================
// IN-MEMORY FALLBACK (only used when DATABASE_URL is not set)
// ============================================================
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

const INITIAL_MENU = [
  { name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella, San Marzano tomatoes, and basil on a crispy thin crust.", price: 299, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", category: "PIZZA", isAvailable: true },
  { name: "Pepperoni Feast", description: "Loaded with double pepperoni, mozzarella cheese, and our signature marinara sauce.", price: 399, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80", category: "PIZZA", isAvailable: true },
  { name: "BBQ Chicken Pizza", description: "Smoky BBQ sauce, grilled chicken, red onions, and cilantro on a garlic butter crust.", price: 449, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80", category: "PIZZA", isAvailable: true },
  { name: "Classic Smash Burger", description: "Double smashed patties with American cheese, pickles, onions, and special sauce.", price: 199, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", category: "BURGERS", isAvailable: true },
  { name: "Spicy Chicken Burger", description: "Crispy fried chicken with sriracha mayo, jalapeños, lettuce, and coleslaw.", price: 229, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80", category: "BURGERS", isAvailable: true },
  { name: "Penne Arrabbiata", description: "Penne pasta in a spicy tomato sauce with garlic, chili flakes, and fresh parsley.", price: 249, image: "https://images.unsplash.com/photo-1621996346565-e3d5d628169a?auto=format&fit=crop&w=600&q=80", category: "PASTA", isAvailable: true },
  { name: "Creamy Alfredo", description: "Fettuccine in a rich, creamy Parmesan Alfredo sauce with grilled chicken and mushrooms.", price: 329, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80", category: "PASTA", isAvailable: true },
  { name: "Garlic Bread", description: "Toasted ciabatta with roasted garlic butter, herbs, and melted mozzarella.", price: 129, image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&q=80", category: "SIDES", isAvailable: true },
  { name: "Loaded Fries", description: "Crispy golden fries topped with cheese sauce, bacon bits, jalapeños, and sour cream.", price: 179, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80", category: "SIDES", isAvailable: true },
  { name: "Fresh Lime Soda", description: "Freshly squeezed lime with soda water, a hint of mint, and your choice of sweet or salted.", price: 79, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed514?auto=format&fit=crop&w=600&q=80", category: "BEVERAGES", isAvailable: true },
  { name: "Mango Smoothie", description: "Thick and creamy alphonso mango smoothie blended with yogurt and a touch of honey.", price: 149, image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80", category: "BEVERAGES", isAvailable: true },
  { name: "Cold Coffee", description: "Rich cold brew coffee blended with milk, vanilla ice cream, and chocolate drizzle.", price: 129, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80", category: "BEVERAGES", isAvailable: true },
  { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center, served with vanilla ice cream.", price: 199, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", category: "DESSERTS", isAvailable: true },
  { name: "Tiramisu", description: "Classic Italian dessert with espresso-soaked ladyfingers, mascarpone cream, and cocoa.", price: 249, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80", category: "DESSERTS", isAvailable: true },
];

async function ensureMemorySeeded() {
  if (store.initialized) return;

  INITIAL_MENU.forEach((item, idx) => {
    const id = `item_${idx + 1}`;
    store.menuItems.set(id, { ...item, id, category: item.category as any, createdAt: new Date(), updatedAt: new Date() });
  });

  const adminPass = await bcrypt.hash("admin123", 10);
  store.users.set("user_admin", { id: "user_admin", name: "Admin", email: "admin@fooddash.com", phone: "+91 9999999999", password: adminPass, role: "ADMIN", address: "FoodDash Kitchen HQ, Mumbai", createdAt: new Date(), updatedAt: new Date() });

  const userPass = await bcrypt.hash("user123", 10);
  store.users.set("user_demo", { id: "user_demo", name: "John Doe", email: "user@fooddash.com", phone: "+91 9876543210", password: userPass, role: "USER", address: "123 Main Street, Apartment 4B, Mumbai 400001", createdAt: new Date(), updatedAt: new Date() });

  store.initialized = true;
}

function generateOrderNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let num = "ORD-";
  for (let i = 0; i < 6; i++) num += chars.charAt(Math.floor(Math.random() * chars.length));
  return num;
}

// ============================================================
// DATABASE SERVICE LAYER
// ============================================================
export const db = {

  // ---- MENU ----
  async getMenuItems(category?: string): Promise<DBMenuItem[]> {
    if (hasDatabase) {
      const where: any = { isAvailable: true };
      if (category && category !== "ALL") where.category = category;
      return (await prisma.menuItem.findMany({ where, orderBy: { createdAt: "asc" } })) as DBMenuItem[];
    }
    await ensureMemorySeeded();
    let items = Array.from(store.menuItems.values()).filter((i) => i.isAvailable);
    if (category && category !== "ALL") items = items.filter((i) => i.category === category);
    return items;
  },

  async getMenuItemById(id: string): Promise<DBMenuItem | null> {
    if (hasDatabase) {
      return (await prisma.menuItem.findUnique({ where: { id } })) as DBMenuItem | null;
    }
    await ensureMemorySeeded();
    return store.menuItems.get(id) || null;
  },

  // ---- USERS ----
  async getUserByEmail(email: string): Promise<DBUser | null> {
    if (hasDatabase) {
      return (await prisma.user.findUnique({ where: { email } })) as DBUser | null;
    }
    await ensureMemorySeeded();
    for (const u of store.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  },

  async getUserById(id: string): Promise<DBUser | null> {
    if (hasDatabase) {
      return (await prisma.user.findUnique({ where: { id } })) as DBUser | null;
    }
    await ensureMemorySeeded();
    return store.users.get(id) || null;
  },

  async createUser(data: { name: string; email: string; phone?: string | null; password: string; role?: "USER" | "ADMIN"; address?: string | null }): Promise<DBUser> {
    if (hasDatabase) {
      return (await prisma.user.create({
        data: { name: data.name, email: data.email, phone: data.phone || null, password: data.password, role: data.role || "USER", address: data.address || null },
      })) as DBUser;
    }
    await ensureMemorySeeded();
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user: DBUser = { id, name: data.name, email: data.email, phone: data.phone || null, password: data.password, role: data.role || "USER", address: data.address || null, createdAt: new Date(), updatedAt: new Date() };
    store.users.set(id, user);
    return user;
  },

  // ---- ORDERS ----
  async createOrder(data: { userId: string; customerName: string; customerPhone: string; deliveryAddress: string; deliveryNotes?: string | null; items: { menuItemId: string; quantity: number }[] }): Promise<DBOrder> {
    const orderNumber = generateOrderNumber();

    if (hasDatabase) {
      // Fetch verified menu prices from PostgreSQL
      const menuItems = await prisma.menuItem.findMany({
        where: { id: { in: data.items.map((i) => i.menuItemId) } },
      });

      const itemMap = new Map(menuItems.map((m) => [m.id, m]));
      let subtotal = 0;
      const createItemsData = [];

      for (const itemInput of data.items) {
        const menuItem = itemMap.get(itemInput.menuItemId);
        if (!menuItem) throw new Error(`Item ${itemInput.menuItemId} not found`);
        const itemTotal = menuItem.price * itemInput.quantity;
        subtotal += itemTotal;
        createItemsData.push({ menuItemId: menuItem.id, quantity: itemInput.quantity, unitPrice: menuItem.price, itemTotal });
      }

      const tax = Math.round(subtotal * 0.1 * 100) / 100;
      const deliveryFee = 40;
      const total = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

      const order = await prisma.order.create({
        data: {
          orderNumber, userId: data.userId, customerName: data.customerName, customerPhone: data.customerPhone,
          deliveryAddress: data.deliveryAddress, deliveryNotes: data.deliveryNotes || null,
          status: "ORDER_RECEIVED", subtotal, tax, deliveryFee, total,
          items: { create: createItemsData },
          statusHistory: { create: [{ status: "ORDER_RECEIVED", note: "Order placed successfully" }] },
        },
        include: { items: { include: { menuItem: true } }, statusHistory: { orderBy: { timestamp: "asc" } }, user: { select: { name: true, email: true } } },
      });
      return order as unknown as DBOrder;
    }

    // In-memory fallback (local dev without database)
    await ensureMemorySeeded();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let subtotal = 0;
    const orderItems: DBOrderItem[] = [];

    for (const itemInput of data.items) {
      const menuItem = store.menuItems.get(itemInput.menuItemId);
      if (!menuItem) throw new Error(`Item ${itemInput.menuItemId} not found`);
      const unitPrice = menuItem.price;
      const itemTotal = unitPrice * itemInput.quantity;
      subtotal += itemTotal;
      orderItems.push({ id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, orderId, menuItemId: menuItem.id, menuItem, quantity: itemInput.quantity, unitPrice, itemTotal });
    }

    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const deliveryFee = 40;
    const total = Math.round((subtotal + tax + deliveryFee) * 100) / 100;
    const user = store.users.get(data.userId);

    const order: DBOrder = {
      id: orderId, orderNumber, userId: data.userId,
      user: user ? { name: user.name, email: user.email } : undefined,
      customerName: data.customerName, customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress, deliveryNotes: data.deliveryNotes || null,
      status: "ORDER_RECEIVED", subtotal, tax, deliveryFee, total, items: orderItems,
      statusHistory: [{ id: `sh_${Date.now()}`, orderId, status: "ORDER_RECEIVED", note: "Order placed successfully", timestamp: new Date() }],
      createdAt: new Date(), updatedAt: new Date(),
    };
    store.orders.set(orderId, order);
    return order;
  },

  async getOrderById(id: string): Promise<DBOrder | null> {
    if (hasDatabase) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { menuItem: true } }, statusHistory: { orderBy: { timestamp: "asc" } }, user: { select: { name: true, email: true } } },
      });
      return (order as unknown as DBOrder) || null;
    }
    await ensureMemorySeeded();
    return store.orders.get(id) || null;
  },

  async getOrders(userId?: string, statusFilter?: string): Promise<DBOrder[]> {
    if (hasDatabase) {
      const where: any = {};
      if (userId) where.userId = userId;
      if (statusFilter && statusFilter !== "ALL") where.status = statusFilter;
      const orders = await prisma.order.findMany({
        where,
        include: { items: { include: { menuItem: true } }, statusHistory: { orderBy: { timestamp: "asc" } }, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
      return orders as unknown as DBOrder[];
    }
    await ensureMemorySeeded();
    let orders = Array.from(store.orders.values());
    if (userId) orders = orders.filter((o) => o.userId === userId);
    if (statusFilter && statusFilter !== "ALL") orders = orders.filter((o) => o.status === statusFilter);
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async updateOrderStatus(id: string, newStatus: "ORDER_RECEIVED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED", note?: string): Promise<DBOrder | null> {
    if (hasDatabase) {
      const statusNote = note || `Status updated to ${newStatus.replace(/_/g, " ")}`;

      // Create status log first, then update order
      await prisma.orderStatusLog.create({
        data: { orderId: id, status: newStatus, note: statusNote },
      });

      const order = await prisma.order.update({
        where: { id },
        data: { status: newStatus },
        include: { items: { include: { menuItem: true } }, statusHistory: { orderBy: { timestamp: "asc" } }, user: { select: { name: true, email: true } } },
      });
      return order as unknown as DBOrder;
    }

    await ensureMemorySeeded();
    const order = store.orders.get(id);
    if (!order) return null;
    order.status = newStatus;
    order.updatedAt = new Date();
    order.statusHistory.push({ id: `sh_${Date.now()}`, orderId: id, status: newStatus, note: note || `Status updated to ${newStatus.replace(/_/g, " ")}`, timestamp: new Date() });
    return order;
  },
};
