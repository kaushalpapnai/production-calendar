import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  startOfDay,
  endOfDay
} from 'date-fns';
import { useOrderStore } from '../../store/orderStore';
import { OrderTag } from './OrderTag';
import { isDateInRange } from '../../utils/dateUtils';
import { CalendarNavigation } from './CalendarNavigation';

export const CalendarGrid: React.FC = () => {
  const { 
    orders, 
    currentDate, 
    selectedOrder, 
    setSelectedOrder,
    statusFilter,
    viewMode 
  } = useOrderStore();
  
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);

  // Calculate calendar dates based on view mode
  const { days, weekDays } = useMemo(() => {
    if (viewMode === 'weekly') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      return {
        days: weekDays,
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      };
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);
      const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
      
      return {
        days: monthDays,
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      };
    }
  }, [currentDate, viewMode]);

  // Get orders for a specific date
  const getOrdersForDate = (date: Date) => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    let filteredOrders = orders.filter(order => {
      const orderStart = new Date(order.startDate);
      const orderEnd = new Date(order.endDate);
      
      // Check if order spans this day
      return isDateInRange(date, orderStart, orderEnd) ||
             (orderStart <= dayEnd && orderEnd >= dayStart);
    });

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

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Calendar Navigation */}
      <CalendarNavigation />

      {/* Calendar Header - Week Days */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="flex-1 grid grid-cols-7 overflow-scroll">
        {days.map((day) => {
          const dayOrders = getOrdersForDate(day);
          const isCurrentMonth = viewMode === 'weekly' ? true : isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const dayNumber = format(day, 'd');

          return (
            <div
              key={day.toISOString()}
              className={`
                border-r border-b border-gray-200 last:border-r-0
                relative flex flex-col
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isToday ? 'bg-blue-50 ring-1 ring-blue-300' : ''}
                ${viewMode === 'monthly' ? 'min-h-[120px]' : ''}
              `}
            >
              {/* Day Header - Fixed at top */}
              <div className={`
                p-2 text-sm font-medium border-b border-gray-100 flex-shrink-0 bg-inherit
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isToday ? 'text-blue-600 font-bold' : ''}
              `}>
                <div className="flex items-center justify-between">
                  <span>{dayNumber}</span>
                  {dayOrders.length > 0 && (
                    <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 ml-1">
                      {dayOrders.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Scrollable Orders Container */}
              <div className={`
                flex-1 p-2 scrollbar-hide
                ${viewMode === 'weekly' 
                  ? 'overflow-y-auto max-h-[calc(100vh-200px)]' 
                  : dayOrders.length > 3 ? 'overflow-y-auto' : 'overflow-visible'
                }
              `}>
                <div className="space-y-1">
                  {/* Show all orders in weekly view, limit in monthly */}
                  {(viewMode === 'weekly' ? dayOrders : dayOrders.slice(0, 3)).map(order => (
                    <OrderTag
                      key={`${order.id}-${day.toISOString()}`}
                      order={order}
                      isSelected={selectedOrder === order.id}
                      isHovered={hoveredOrder ? hoveredOrder === order.id : undefined}
                      onHover={handleOrderHover}
                      onClick={handleOrderClick}
                      compact={viewMode === 'monthly'}
                      viewMode={viewMode}
                    />
                  ))}
                  
                  {/* Show "more" indicator only in monthly view */}
                  {viewMode === 'monthly' && dayOrders.length > 3 && (
                    <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors">
                      +{dayOrders.length - 3} more
                    </div>
                  )}

                  {/* Empty state */}
                  {dayOrders.length === 0 && isCurrentMonth && (
                    <div className="text-xs text-gray-400 text-center py-8 opacity-50">
                      No orders
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar Legend/Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-2 flex-shrink-0">
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
            <span>• {viewMode === 'weekly' ? 'Weekly View' : 'Monthly View'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
