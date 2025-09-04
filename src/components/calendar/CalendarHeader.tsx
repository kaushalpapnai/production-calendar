import React from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { useOrderStore } from '../../store/orderStore';

interface CalendarHeaderProps {
  onCreateOrder: () => void;
  onToggleFilter: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  onCreateOrder, 
  onToggleFilter 
}) => {
  const { 
    currentDate, 
    setCurrentDate, 
    viewMode, 
    setViewMode,
    statusFilter 
  } = useOrderStore();

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
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Top Row - Filters and Create Order */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleFilter}
              className={`
                flex items-center space-x-2 px-3 py-2 border rounded-md transition-colors
                ${statusFilter 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <Filter size={16} />
              <span>Filters</span>
              {statusFilter && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {statusFilter}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onCreateOrder}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Create Order</span>
          </button>
        </div>

        {/* Bottom Row - Navigation and View Controls */}
        <div className="flex items-center justify-between">
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
              
              <h2 className="text-lg font-semibold min-w-[140px] text-center">
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

            <button
              onClick={goToThisMonth}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              This Month
            </button>
          </div>

          {/* View Mode and Additional Controls */}
          <div className="flex items-center space-x-4">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'monthly' | 'weekly')}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Plan/Order</span>
              <span className="text-gray-300">|</span>
              <span>Status</span>
              <span className="text-gray-300">|</span>
              <span>Duration</span>
              <span className="text-gray-300">|</span>
              <span>Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
