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
          
          <h2 className="text-xl font-semibold text-gray-900 min-w-[120px] text-center">
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
      <div className="flex items-center space-x-3">
        {/* Custom View Mode Selector */}
        <div className="relative inline-block">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'monthly' | 'weekly')}
            className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        <button
          onClick={goToThisMonth}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors border border-gray-300"
        >
          This Month
        </button>
      </div>
    </div>
  );
};