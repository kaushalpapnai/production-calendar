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

const generateOrderNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '#';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
        const newOrder: Order = {
          ...orderData,
          id: crypto.randomUUID(),
          orderNumber: generateOrderNumber(),
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
    }
  )
);
