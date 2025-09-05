import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, OrderStore } from '../types';

const statusColors: Record<OrderStatus, string> = {
  'completed': '#10B981',
  'in-progress': '#3B82F6',
  'cancelled': '#6B7280',
  'planned': '#F59E0B',
  'pending': '#F59E0B',
  'approved': '#10B981'
};

// Generate a random order number (8 characters)
const generateRandomOrderNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate area-specific prefix + order number combination
const generateFullOrderNumber = (area: string, existingOrders: Order[]): string => {
  // Get area prefix (first letter of area)
  const areaPrefix = area.charAt(0).toUpperCase();
  
  // Count existing orders in this area for sequential numbering
  const areaOrders = existingOrders.filter(order => order.area === area);
  const orderCount = areaOrders.length + 1;
  
  // Generate random order number
  const randomOrderNumber = generateRandomOrderNumber();
  
  // Return: #[sequential][area_prefix] + space + random_order_number
  return `#${orderCount}${areaPrefix} ${randomOrderNumber}`;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      selectedOrder: null,
      currentDate: new Date(),
      viewMode: 'monthly',
      statusFilter: null,

      addOrder: (orderData) => {
        const state = get();
        const newOrder: Order = {
          ...orderData,
          id: crypto.randomUUID(),
          orderNumber: generateFullOrderNumber(orderData.area, state.orders),
          colorCode: statusColors[orderData.status],
        };

        set((state) => ({
          orders: [...state.orders, newOrder]
        }));
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === id
              ? { ...order, ...updates, colorCode: statusColors[updates.status || order.status] }
              : order
          )
        }));
      },

      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter(order => order.id !== id)
        }));
      },

      setSelectedOrder: (id) => set({ selectedOrder: id }),
      setCurrentDate: (date) => set({ currentDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setStatusFilter: (status) => set({ statusFilter: status }),
    }),
    {
      name: 'production-orders',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          const parsed = JSON.parse(str);
          return {
            ...parsed.state,
            orders: parsed.state.orders?.map((order: Order) => ({
              ...order,
              startDate: typeof order.startDate === 'string' ? new Date(order.startDate) : order.startDate,
              endDate: typeof order.endDate === 'string' ? new Date(order.endDate) : order.endDate,
            })) || [],
            currentDate: new Date(parsed.state.currentDate || new Date()),
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify({ state: value }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
