import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { useOrderStore } from '../../store/orderStore';

export const CalendarNavigation: React.FC = () => {
  const { currentDate, setCurrentDate, viewMode, setViewMode } = useOrderStore();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(currentDate, 1) 
      : addMonths(currentDate, 1);
    setCurrentDate(newDate);
  };

  const goToThisMonth = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Month Navigation */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900 min-w-[160px] text-left">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center space-x-4">
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as 'monthly' | 'weekly')}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>

        <button
          onClick={goToThisMonth}
          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          This Month
        </button>
      </div>
    </div>
  );
};
