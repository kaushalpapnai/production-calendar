import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../UI/StatusBadge';
import type { Order } from '../../types';

interface OrderItemProps {
  order: Order;
  isSelected: boolean;
  onClick: (orderId: string) => void;
  index: number;
}

export const OrderItem: React.FC<OrderItemProps> = ({ 
  order, 
  isSelected, 
  onClick,
  index 
}) => {
  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'text-green-600';
    if (progress > 50) return 'text-blue-600';
    if (progress > 0) return 'text-yellow-600';
    return 'text-gray-400';
  };

  const getProgressBgColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const handleClick = () => {
    onClick(order.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50
        ${isSelected 
          ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-sm' 
          : 'border-l-4 border-l-transparent'
        }
      `}
    >
      {/* Order Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-blue-600 font-medium">
              #{index}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {order.orderNumber}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {format(order.startDate, 'MMM dd')}
        </div>
      </div>

      {/* Status and Duration Row */}
      <div className="flex items-center justify-between mb-3">
        <StatusBadge status={order.status} />
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 font-medium">
            {order.duration} day{order.duration !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Progress Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getProgressColor(order.progress)}`}>
            {order.progress}%
          </span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressBgColor(order.progress)}`}
              style={{ width: `${order.progress}%` }}
            />
          </div>
        </div>
        
        {/* Progress Circle Indicator */}
        <div className="relative w-6 h-6">
          <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
            {/* Background circle */}
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              className="stroke-gray-200"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              className={
                order.progress === 100 ? 'stroke-green-500' :
                order.progress > 50 ? 'stroke-blue-500' :
                order.progress > 0 ? 'stroke-yellow-500' : 'stroke-gray-300'
              }
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 10}`}
              strokeDashoffset={`${2 * Math.PI * 10 * (1 - order.progress / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
        </div>
      </div>

      {/* Additional Details (shown when selected) */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Area:</span>
              <div className="font-medium text-gray-900">{order.area}</div>
            </div>
            <div>
              <span className="text-gray-500">Assignee:</span>
              <div className="font-medium text-gray-900">{order.assignee}</div>
            </div>
            <div>
              <span className="text-gray-500">Start Date:</span>
              <div className="font-medium text-gray-900">
                {format(order.startDate, 'MMM dd, yyyy')}
              </div>
            </div>
            <div>
              <span className="text-gray-500">End Date:</span>
              <div className="font-medium text-gray-900">
                {format(order.endDate, 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
