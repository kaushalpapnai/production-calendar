import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay 
} from 'date-fns';
import { useOrderStore } from '../../store/orderStore';
// import { OrderTag } from './OrderTag';
import { isDateInRange } from '../../utils/dateUtils';
import { OrderTag } from './OrderTag';

export const CalendarGrid: React.FC = () => {
  const { 
    orders, 
    currentDate, 
    selectedOrder, 
    setSelectedOrder,
    statusFilter 
  } = useOrderStore();
  
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);

  // Calculate calendar dates
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Get orders for a specific date
  const getOrdersForDate = (date: Date) => {
    let filteredOrders = orders.filter(order => 
      isDateInRange(date, order.startDate, order.endDate)
    );

    // Apply status filter if active
    if (statusFilter) {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    return filteredOrders;
  };

  // Handle order selection
  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  // Handle order hover for opacity effects
  const handleOrderHover = (orderId: string | null) => {
    setHoveredOrder(orderId);
  };

  // Week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Calendar Header - Week Days */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="p-4 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day) => {
          const dayOrders = getOrdersForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const dayNumber = format(day, 'd');

          return (
            <div
              key={day.toISOString()}
              className={`
                min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0
                relative overflow-hidden
                ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                ${isToday ? 'bg-blue-50 ring-1 ring-blue-200' : ''}
              `}
            >
              {/* Day Number */}
              <div className={`
                text-sm mb-2 font-medium
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isToday ? 'text-blue-600 font-bold' : ''}
              `}>
                {dayNumber}
              </div>
              
              {/* Orders for this day */}
              <div className="space-y-1 relative z-10">
                {dayOrders.slice(0, 4).map(order => (
                  <OrderTag
                    key={order.id}
                    order={order}
                    isSelected={selectedOrder === order.id}
                    isHovered={hoveredOrder ? hoveredOrder === order.id : undefined}
                    onHover={handleOrderHover}
                    onClick={handleOrderClick}
                  />
                ))}
                
                {/* Show "more" indicator if there are more than 4 orders */}
                {dayOrders.length > 4 && (
                  <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    +{dayOrders.length - 4} more
                  </div>
                )}
              </div>

              {/* Empty day indicator */}
              {dayOrders.length === 0 && isCurrentMonth && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    No orders
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar Legend/Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-yellow-500 bg-yellow-50 rounded"></div>
              <span>Planned</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span>Cancelled</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Total Orders: {orders.length}</span>
            {statusFilter && (
              <span>• Filtered: {orders.filter(o => o.status === statusFilter).length}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
