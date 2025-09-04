import React, { useState, useRef, useEffect } from 'react';
import type { Order } from '../../types';

interface OrderTagProps {
  order: Order;
  isSelected?: boolean;
  isHovered?: boolean;
  onHover?: (orderId: string | null) => void;
  onClick?: (orderId: string) => void;
}

export const OrderTag: React.FC<OrderTagProps> = ({ 
  order, 
  isSelected, 
  isHovered,
  onHover,
  onClick 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tagRef = useRef<HTMLDivElement>(null);

  const updateTooltipPosition = () => {
    if (tagRef.current) {
      const rect = tagRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // Position above the tag
        left: rect.left + rect.width / 2 // Center horizontally
      });
    }
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
    updateTooltipPosition();
    onHover?.(order.id);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    onHover?.(null);
  };

  useEffect(() => {
    if (showTooltip) {
      updateTooltipPosition();
    }
  }, [showTooltip]);
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500';
      case 'in-progress':
        return 'bg-blue-500 text-white border-blue-500';
      case 'cancelled':
        return 'bg-gray-500 text-white border-gray-500';
      case 'planned':
        return 'border-2 border-yellow-500 text-yellow-700 bg-yellow-50';
      case 'pending':
        return 'border-2 border-yellow-500 text-yellow-700 bg-yellow-50';
      case 'approved':
        return 'bg-green-500 text-white border-green-500';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-200';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(order.id);
  };

  return (
    <>
      <div
        ref={tagRef}
        className={`
          text-xs px-2 py-1 rounded mb-1 cursor-pointer transition-all duration-200 
          border relative group
          ${getStatusStyle(order.status)}
          ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
          ${isHovered !== undefined && !isHovered ? 'opacity-30' : 'opacity-100'}
          hover:shadow-sm transform hover:scale-[1.02]
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        title={`${order.orderNumber} - ${order.status} (${order.duration} days)`}
      >
      <div className="flex items-center justify-between">
        <span className="font-medium truncate">
          {order.orderNumber}
        </span>
        {order.progress > 0 && (
          <span className="text-[10px] ml-1 opacity-75">
            {order.progress}%
          </span>
        )}
      </div>

      </div>

      {/* Fixed positioned tooltip */}
      {showTooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap shadow-xl border border-gray-700 max-w-xs">
            <div className="font-medium">{order.orderNumber}</div>
            <div className="opacity-75">
              Status: {order.status} • {order.duration} days
            </div>
            <div className="opacity-75">
              Area: {order.area}
            </div>
            <div className="opacity-75">
              Progress: {order.progress}%
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </>
  );
};
