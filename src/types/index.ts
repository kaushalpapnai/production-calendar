export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  startDate: Date;
  endDate: Date;
  area: string;
  assignee: string;
  duration: number;
  progress: number;
  colorCode: string;
}

export type OrderStatus = 'completed' | 'in-progress' | 'cancelled' | 'planned' | 'pending' | 'approved';

export interface OrderStore {
  orders: Order[];
  selectedOrder: string | null;
  currentDate: Date;
  viewMode: 'monthly' | 'weekly';
  statusFilter: OrderStatus | null;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  setSelectedOrder: (id: string | null) => void;
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: 'monthly' | 'weekly') => void;
  setStatusFilter: (status: OrderStatus | null) => void;
}
