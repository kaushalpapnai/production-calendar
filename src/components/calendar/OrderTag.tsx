import React, { useState, useRef } from 'react';
import type { Order } from '../../types';

interface OrderTagProps {
  order: Order;
  isSelected?: boolean;
  isHovered?: boolean;
  onHover?: (orderId: string | null) => void;
  onClick?: (orderId: string) => void;
  compact?: boolean;
  viewMode?: 'monthly' | 'weekly';
}

export const OrderTag: React.FC<OrderTagProps> = ({ 
  order, 
  isSelected, 
  isHovered,
  onHover,
  onClick,
  compact = false,
  viewMode = 'monthly'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const orderTagRef = useRef<HTMLDivElement>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'cancelled':
        return 'bg-gray-400 text-white';
      case 'planned':
        return 'bg-yellow-500 text-gray-800';
      case 'pending':
        return 'bg-yellow-500 text-gray-800';
      case 'approved':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const handleMouseEnter = () => {
    if (orderTagRef.current) {
      const rect = orderTagRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowTooltip(true);
      onHover?.(order.id);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
      onHover?.(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(order.id);
  };

  // Split order number to show prefix and actual number separately
  const orderParts = order.orderNumber.split(' ');
  const prefix = orderParts[0]; // e.g., "#3A"
  const actualOrderNumber = orderParts[1] || ''; // e.g., "331BD93A"

  return (
    <>
      <div
        ref={orderTagRef}
        className={`
          ${compact || viewMode === 'monthly' ? 'text-xs px-0 py-0' : 'text-xs px-0 py-0'} 
          rounded mb-1 cursor-pointer transition-all duration-200 
          relative overflow-hidden
          ${getStatusStyle(order.status)}
          ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1 shadow-lg' : 'shadow-md'}
          ${isHovered !== undefined && !isHovered ? 'opacity-40' : 'opacity-100'}
          hover:shadow-lg transform hover:scale-[1.02] hover:z-50
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Order number display with prefix background */}
        <div className="flex items-center h-full">
          <span className="font-bold bg-white text-gray-800 px-1 ml-1 h-full flex items-center">
            {prefix}
          </span>
          <span className="font-medium px-1 py-1">
            {actualOrderNumber}
          </span>
        </div>

        {/* Show additional info in weekly view only */}
        {viewMode === 'weekly' && !compact && (
          <div className="mt-1 text-[10px] opacity-75 space-y-0.5 px-2 pb-1">
            <div className="truncate">{order.area}</div>
            <div className="truncate">{order.assignee}</div>
            <div className="truncate capitalize">{order.status.replace('-', ' ')}</div>
          </div>
        )}
      </div>

      {/* Enhanced Tooltip */}
      {showTooltip && (
        <div 
          className="fixed bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-2xl border border-gray-700 whitespace-nowrap pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999
          }}
        >
          <div className="font-semibold text-white mb-1">{order.orderNumber}</div>
          <div className="text-gray-300 space-y-0.5">
            <div>Status: <span className="text-white capitalize">{order.status.replace('-', ' ')}</span></div>
            <div>Duration: <span className="text-white">{order.duration} days</span></div>
            <div>Area: <span className="text-white">{order.area}</span></div>
            <div>Assignee: <span className="text-white">{order.assignee}</span></div>
            <div>Progress: <span className="text-white">{order.progress}%</span></div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )}
    </>
  );
};