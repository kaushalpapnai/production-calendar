export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'in-progress':
        return 'bg-cyan-100 text-cyan-800 border border-cyan-300';
      case 'planned':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <span className={`inline-block w-25 px-1 py-1 text-center text-xs font-medium rounded-md uppercase tracking-tight leading-tight ${getStatusStyle(status)}`}>
      {status === 'in-progress' ? 'in progress' : status}
    </span>
  );
};