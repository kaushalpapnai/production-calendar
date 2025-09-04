import React from 'react';
import { useOrderStore } from '../../store/orderStore';
import { OrderItem } from './OrderItem';

export const OrderList: React.FC = () => {
  const { 
    orders, 
    selectedOrder, 
    setSelectedOrder, 
    statusFilter,
    setStatusFilter 
  } = useOrderStore();

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
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Plan/Order</h3>
          <div className="text-sm text-gray-500">
            {filteredOrders.length} of {orders.length}
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 uppercase tracking-wide">
          <span className="flex-1">Status</span>
          <span className="w-16 text-center">Duration</span>
          <span className="w-20 text-center">Progress</span>
        </div>

        {/* Active Filter Display */}
        {statusFilter && (
          <div className="mt-2 flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-3 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700 capitalize">
                {statusFilter} orders
              </span>
            </div>
            <button
              onClick={clearFilter}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto">
        {sortedOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {sortedOrders.map((order, index) => (
              <OrderItem
                key={order.id}
                order={order}
                isSelected={selectedOrder === order.id}
                onClick={setSelectedOrder}
                index={index + 1}
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

      {/* Footer Stats */}
      {orders.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {orders.filter(o => o.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {orders.filter(o => o.status === 'in-progress').length}
              </div>
              <div className="text-xs text-gray-500">In Progress</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
