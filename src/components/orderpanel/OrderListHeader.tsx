
export const OrderListHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200">
        {/* Column Headers */}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-700">Plan/Order</span>
            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-600">?</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-700">Status</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-700">Duration</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-700">Progress</span>
          </div>
        </div>
      </div>
  );
};
