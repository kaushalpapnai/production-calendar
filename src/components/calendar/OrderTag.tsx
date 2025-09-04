import React from 'react';
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
    <div
      className={`
        text-xs px-2 py-1 rounded mb-1 cursor-pointer transition-all duration-200 
        border relative group
        ${getStatusStyle(order.status)}
        ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
        ${isHovered !== undefined && !isHovered ? 'opacity-30' : 'opacity-100'}
        hover:shadow-sm transform hover:scale-[1.02]
      `}
      onMouseEnter={() => onHover?.(order.id)}
      onMouseLeave={() => onHover?.(null)}
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

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-50">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
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
        </div>
      </div>
    </div>
  );
};
