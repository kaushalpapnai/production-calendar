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
  endOfDay,
  eachWeekOfInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  // Calculate calendar dates based on view mode
  const { days, weekDays, allWeeks } = useMemo(() => {
    if (viewMode === 'weekly') {
      // Get all weeks in the current month
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);
      
      // Get all weeks that contain days from this month
      const allWeeksInMonth = eachWeekOfInterval(
        { start: calendarStart, end: calendarEnd },
        { weekStartsOn: 0 }
      );

      // For each week, get all 7 days
      const weeksWithDays = allWeeksInMonth.map(weekStart => {
        const weekEnd = endOfWeek(weekStart);
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      });

      // Current week to display
      const currentWeek = weeksWithDays[currentWeekIndex] || weeksWithDays[0];
      
      return {
        days: currentWeek,
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        allWeeks: weeksWithDays
      };
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);
      const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
      
      return {
        days: monthDays,
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        allWeeks: []
      };
    }
  }, [currentDate, viewMode, currentWeekIndex]);

  // Reset week index when month changes
  React.useEffect(() => {
    setCurrentWeekIndex(0);
  }, [currentDate]);

  const getOrdersForDate = (date: Date) => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    let filteredOrders = orders.filter(order => {
      const orderStart = new Date(order.startDate);
      const orderEnd = new Date(order.endDate);
      
      return isDateInRange(date, orderStart, orderEnd) ||
             (orderStart <= dayEnd && orderEnd >= dayStart);
    });

    if (statusFilter) {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    return filteredOrders;
  };

  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  const handleOrderHover = (orderId: string | null) => {
    setHoveredOrder(orderId);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentWeekIndex > 0) {
      setCurrentWeekIndex(prev => prev - 1);
    } else if (direction === 'next' && currentWeekIndex < allWeeks.length - 1) {
      setCurrentWeekIndex(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white h-full flex flex-col overflow-y-hidden">
      {/* Calendar Navigation */}
      <CalendarNavigation />

      {/* Weekly Navigation (only in weekly view) */}
      {viewMode === 'weekly' && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek('prev')}
              disabled={currentWeekIndex === 0}
              className={`p-2 rounded-md transition-colors ${
                currentWeekIndex === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="text-sm font-medium text-gray-700">
              Week {currentWeekIndex + 1} of {allWeeks.length}
              <span className="text-gray-500 ml-2">
                ({format(days[0], 'MMM dd')} - {format(days[6], 'MMM dd')})
              </span>
            </div>

            <button
              onClick={() => navigateWeek('next')}
              disabled={currentWeekIndex === allWeeks.length - 1}
              className={`p-2 rounded-md transition-colors ${
                currentWeekIndex === allWeeks.length - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="text-xs text-gray-500">
            {days.filter(day => getOrdersForDate(day).length > 0).length} days with orders
          </div>
        </div>
      )}

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

      {/* DIFFERENT LAYOUTS FOR WEEKLY VS MONTHLY */}
      {viewMode === 'weekly' ? (
        /* WEEKLY VIEW - Full Week Display */
        <div className="flex-1 grid grid-cols-7">
          {days.map((day) => {
            const dayOrders = getOrdersForDate(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            const dayNumber = format(day, 'd');

            return (
              <div
                key={day.toISOString()}
                className={`
                  border-r border-b border-gray-200 last:border-r-0 flex flex-col
                  ${isToday ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-white'}
                  ${!isCurrentMonth ? 'bg-gray-50' : ''}
                `}
                style={{ minHeight: '500px' }}
              >
                {/* Day Header - Fixed */}
                <div className={`
                  p-3 text-center border-b border-gray-200 flex-shrink-0
                  ${isToday ? 'text-blue-600 font-bold bg-blue-100' : 'text-gray-900'}
                  ${!isCurrentMonth ? 'text-gray-400 bg-gray-100' : 'bg-gray-50'}
                `}>
                  <div className="text-lg font-semibold">{dayNumber}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(day, 'MMM')}
                  </div>
                  {dayOrders.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {dayOrders.length} order{dayOrders.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Scrollable Orders Container */}
                <div className="flex-1 p-3 overflow-y-auto scrollbar-container">
                  <div className="space-y-2">
                    {dayOrders.map(order => (
                      <OrderTag
                        key={`${order.id}-${day.toISOString()}`}
                        order={order}
                        isSelected={selectedOrder === order.id}
                        isHovered={hoveredOrder ? hoveredOrder === order.id : undefined}
                        onHover={handleOrderHover}
                        onClick={handleOrderClick}
                        // viewMode="weekly"
                      />
                    ))}

                    {dayOrders.length === 0 && (
                      <div className="text-sm text-gray-400 text-center py-8">
                        No orders
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MONTHLY VIEW - Grid Layout */
        <div className="flex-1 grid grid-cols-7 auto-rows-fr ">
          {days.map((day) => {
            const dayOrders = getOrdersForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dayNumber = format(day, 'd');

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[120px] border-r border-b border-gray-200 last:border-r-0
                  relative flex flex-col
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                  ${isToday ? 'bg-blue-50 ring-1 ring-blue-300' : ''}
                `}
              >
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

                <div className="flex-1 p-2 scrollbar-hide">
                  <div className="space-y-1">
                    {dayOrders.slice(0, 3).map(order => (
                      <OrderTag
                        key={`${order.id}-${day.toISOString()}`}
                        order={order}
                        isSelected={selectedOrder === order.id}
                        isHovered={hoveredOrder ? hoveredOrder === order.id : undefined}
                        onHover={handleOrderHover}
                        onClick={handleOrderClick}
                      />
                    ))}
                    
                    {dayOrders.length > 3 && (
                      <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors">
                        +{dayOrders.length - 3} more
                      </div>
                    )}

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
      )}

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
            <span>• {viewMode === 'weekly' 
              ? `Weekly View (Week ${currentWeekIndex + 1}/${allWeeks.length})` 
              : 'Monthly View'
            }</span>
          </div>
        </div>
      </div>
    </div>
  );
};
