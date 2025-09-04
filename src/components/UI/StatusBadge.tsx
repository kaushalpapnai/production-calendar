import React from 'react';
import type { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { 
  color: string; 
  bgColor: string; 
  text: string;
  dotColor: string;
}> = {
  'completed': { 
    color: 'text-green-800', 
    bgColor: 'bg-green-100', 
    text: 'COMPLETE',
    dotColor: 'bg-green-500'
  },
  'in-progress': { 
    color: 'text-blue-800', 
    bgColor: 'bg-blue-100', 
    text: 'IN PROGRESS',
    dotColor: 'bg-blue-500'
  },
  'cancelled': { 
    color: 'text-gray-800', 
    bgColor: 'bg-gray-100', 
    text: 'CANCELLED',
    dotColor: 'bg-gray-500'
  },
  'planned': { 
    color: 'text-yellow-800', 
    bgColor: 'bg-yellow-100', 
    text: 'PLANNED',
    dotColor: 'bg-yellow-500'
  },
  'pending': { 
    color: 'text-yellow-800', 
    bgColor: 'bg-yellow-100', 
    text: 'PENDING',
    dotColor: 'bg-yellow-500'
  },
  'approved': { 
    color: 'text-green-800', 
    bgColor: 'bg-green-100', 
    text: 'APPROVED',
    dotColor: 'bg-green-500'
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const config = statusConfig[status];
  
  return (
    <div className={`
      inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
      ${config.color} ${config.bgColor} ${className}
    `}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.text}</span>
    </div>
  );
};
