import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { OrderListHeader } from './OrderListHeader';
import { OrderItem } from './OrderItem';

export const OrderList: React.FC = () => {
  const { 
    orders, 
    selectedOrder, 
    setSelectedOrder, 
    statusFilter,
    setStatusFilter,
    addOrder
  } = useOrderStore();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Add sample orders if none exist (to match the image)
  React.useEffect(() => {
    if (orders.length === 0) {
      const sampleOrders = [
        {
          orderNumber: 'F36FCFE1',
          status: 'pending' as const,
          startDate: new Date('2025-08-01'),
          endDate: new Date('2025-08-04'),
          duration: 4,
          area: 'Manufacturing',
          assignee: 'John Doe',
          progress: 0,
          colorCode: '#F59E0B'
        },
        {
          orderNumber: 'EE844052',
          status: 'pending' as const,
          startDate: new Date('2025-08-05'),
          endDate: new Date('2025-08-17'),
          duration: 13,
          area: 'Quality Control',
          assignee: 'Jane Smith',
          progress: 0,
          colorCode: '#F59E0B'
        },
        {
          orderNumber: '57AD32B9',
          status: 'completed' as const,
          startDate: new Date('2025-08-18'),
          endDate: new Date('2025-08-19'),
          duration: 2,
          area: 'Shipping',
          assignee: 'Bob Johnson',
          progress: 100,
          colorCode: '#10B981'
        },
        {
          orderNumber: 'F8BF681E',
          status: 'in-progress' as const,
          startDate: new Date('2025-08-20'),
          endDate: new Date('2025-09-02'),
          duration: 14,
          area: 'Production',
          assignee: 'Alice Brown',
          progress: 100,
          colorCode: '#3B82F6'
        },
        {
          orderNumber: '4CECAFA7',
          status: 'in-progress' as const,
          startDate: new Date('2025-08-21'),
          endDate: new Date('2025-08-22'),
          duration: 2,
          area: 'Assembly',
          assignee: 'Charlie Wilson',
          progress: 0,
          colorCode: '#3B82F6'
        },
        {
          orderNumber: '4E87ECE5',
          status: 'planned' as const,
          startDate: new Date('2025-08-23'),
          endDate: new Date('2025-08-23'),
          duration: 1,
          area: 'Packaging',
          assignee: 'Diana Lee',
          progress: 100,
          colorCode: '#8B5CF6'
        },
        {
          orderNumber: 'B831A322',
          status: 'in-progress' as const,
          startDate: new Date('2025-08-24'),
          endDate: new Date('2025-08-24'),
          duration: 1,
          area: 'Testing',
          assignee: 'Eve Davis',
          progress: 100,
          colorCode: '#3B82F6'
        },
        {
          orderNumber: 'CFCDD6C5',
          status: 'cancelled' as const,
          startDate: new Date('2025-08-25'),
          endDate: new Date('2025-08-25'),
          duration: 0,
          area: 'Review',
          assignee: 'Frank Miller',
          progress: 0,
          colorCode: '#EF4444'
        },
        {
          orderNumber: 'A3F6A261',
          status: 'approved' as const,
          startDate: new Date('2025-08-26'),
          endDate: new Date('2025-08-26'),
          duration: 1,
          area: 'Final Check',
          assignee: 'Grace Taylor',
          progress: 0,
          colorCode: '#10B981'
        }
      ];

      sampleOrders.forEach(order => addOrder(order));
    }
  }, [orders.length, addOrder]);

  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(orderId);
    
    // Toggle expanded state - if already expanded, collapse it
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Filter orders based on status filter
  const filteredOrders = statusFilter 
    ? orders.filter(order => order.status === statusFilter)
    : orders;

  // Sort orders by start date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const clearFilter = () => {
    setStatusFilter(null);
  };

  return (
    <div className="w-[40%] bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <OrderListHeader/>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {sortedOrders.length > 0 ? (
          <div>
            {sortedOrders.map((order, index) => (
              <OrderItem
                key={order.id}
                order={order}
                isSelected={selectedOrder === order.id}
                onClick={handleOrderClick}
                index={index + 1}
                isExpanded={expandedOrder === order.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter ? `No ${statusFilter} orders` : 'No orders yet'}
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              {statusFilter 
                ? `Try clearing the filter to see all orders.`
                : 'Create your first production order to get started.'
              }
            </p>
            {statusFilter && (
              <button
                onClick={clearFilter}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Show all orders
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};