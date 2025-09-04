import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter, Plus, X } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import type { OrderStatus } from '../../types';

interface CalendarHeaderProps {
  onCreateOrder: () => void;
  onToggleFilter: () => void;
}

const statusOptions: { value: OrderStatus | null; label: string; color: string }[] = [
  { value: null, label: 'All Orders', color: 'bg-gray-100 text-gray-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'planned', label: 'Planned', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  onCreateOrder, 
}) => {
  const { 
    statusFilter,
    setStatusFilter,
    orders 
  } = useOrderStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterSelect = (status: OrderStatus | null) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  };

  const clearFilter = () => {
    setStatusFilter(null);
    setIsFilterOpen(false);
  };

  const getFilteredCount = (status: OrderStatus | null) => {
    if (status === null) return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const currentFilter = statusOptions.find(option => option.value === statusFilter);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Top Row - Filters and Create Order */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`
                  flex items-center space-x-2 px-3 py-2 border rounded-md transition-colors cursor-pointer
                  ${statusFilter 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <Filter size={16} />
                <span>
                  {statusFilter ? `Filter: ${currentFilter?.label}` : 'Filters'}
                </span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value || 'all'}
                        onClick={() => handleFilterSelect(option.value)}
                        className={`
                          w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between
                          ${statusFilter === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                        `}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                            {option.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {getFilteredCount(option.value)}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Clear Filter Option */}
                  {statusFilter && (
                    <>
                      <div className="border-t border-gray-200"></div>
                      <button
                        onClick={clearFilter}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <X size={14} />
                        <span>Clear Filter</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Active Filter Display */}
            {statusFilter && (
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded px-3 py-1">
                <span className="text-sm font-medium text-blue-700">
                  Showing {getFilteredCount(statusFilter)} {currentFilter?.label?.toLowerCase()} orders
                </span>
                <button
                  onClick={clearFilter}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onCreateOrder}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Create Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
