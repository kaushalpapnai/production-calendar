import { StatusBadge } from "../UI/StatusBadge";


const ProgressCircle: React.FC<{ progress: number; status: string }> = ({ progress, status }) => {
  const getCircleColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'approved': return '#10B981';
      case 'in-progress': return '#06B6D4';
      case 'planned': return '#8B5CF6';
      default: return '#E5E7EB';
    }
  };

  const color = getCircleColor(status);
  const circumference = 2 * Math.PI * 8; // radius = 8
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-6 h-6">
      <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 20 20">
        {/* Background circle */}
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="#E5E7EB"
          strokeWidth="2"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke={color}
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const OrderItem: React.FC<{
  order: any;
  isSelected: boolean;
  onClick: (id: string) => void;
  index: number;
}> = ({ order, isSelected, onClick, index }) => {
  return (
    <div
      className={`grid grid-cols-4 gap-4 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={() => onClick(order.id)}
    >
      {/* Plan/Order */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-blue-600">#{index}</span>
        <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
      </div>

      {/* Status */}
      <div className="flex justify-center">
        <StatusBadge status={order.status} />
      </div>

      {/* Duration */}
      <div className="flex justify-center">
        <span className="text-sm text-gray-600">
          {order.duration} day{order.duration !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Progress */}
      <div className="flex justify-center items-center space-x-2">
        <span className="text-sm text-gray-600 w-8 text-right">{order.progress}</span>
        <ProgressCircle progress={order.progress} status={order.status} />
      </div>
    </div>
  );
};