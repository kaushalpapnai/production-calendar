import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, User, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { calculateDuration } from '../../utils/dateUtils';
import type { OrderStatus } from '../../types';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const areas = [
  'Production Line A',
  'Production Line B', 
  'Production Line C',
  'Quality Control',
  'Packaging Department',
  'Shipping & Logistics',
  'Raw Materials',
  'Assembly Station 1',
  'Assembly Station 2',
  'Final Inspection'
];

const assignees = [
  'John Doe',
  'Jane Smith', 
  'Mike Johnson',
  'Sarah Wilson',
  'Tom Brown',
  'Lisa Davis',
  'David Miller',
  'Emma Garcia',
  'Chris Lee',
  'Amanda Taylor'
];

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { addOrder, orders } = useOrderStore();
  
  const [formData, setFormData] = useState({
    status: 'planned' as OrderStatus,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    area: '',
    assignee: '',
    progress: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        status: 'planned',
        startDate: today,
        endDate: today,
        area: '',
        assignee: '',
        progress: 0
      });
      setErrors({});
    }
  }, [isOpen]);

  // Updated conflict logic - only check same area
  const checkAreaConflict = (startDate: Date, endDate: Date, area: string): boolean => {
    return orders.some(order => {
      // Only check orders in the same area
      if (order.area !== area) return false;
      
      const orderStart = new Date(order.startDate);
      const orderEnd = new Date(order.endDate);
      
      return (
        (startDate >= orderStart && startDate <= orderEnd) ||
        (endDate >= orderStart && endDate <= orderEnd) ||
        (startDate <= orderStart && endDate >= orderEnd)
      );
    });
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Date validation
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate > endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Check for past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    // Required fields
    if (!formData.area) {
      newErrors.area = 'Please select an area';
    }

    if (!formData.assignee) {
      newErrors.assignee = 'Please select an assignee';
    }

    // Area-based collision detection
    if (!newErrors.startDate && !newErrors.endDate && formData.area) {
      if (checkAreaConflict(startDate, endDate, formData.area)) {
        newErrors.collision = `Order conflicts with existing order in the same area (${formData.area})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const duration = calculateDuration(startDate, endDate);

      await addOrder({
        ...formData,
        startDate,
        endDate,
        duration,
        orderNumber: '', // Will be generated in store with area prefix
        colorCode: '' // Will be set in store
      });

      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to create order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errors.collision) {
      setErrors(prev => ({ ...prev, collision: '' }));
    }
  };

  // Calculate duration for display
  const calculateDisplayDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start <= end) {
        return calculateDuration(start, end);
      }
    }
    return 0;
  };

  // Show how many orders exist in selected area
  const getAreaOrderCount = (area: string) => {
    return orders.filter(order => order.area === area).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
            <p className="text-sm text-gray-500 mt-1">
              Add a new production order to the calendar
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Global Error */}
          {(errors.submit || errors.collision) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start space-x-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm">{errors.submit || errors.collision}</span>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="planned">Planned</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
                required
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {formData.startDate && formData.endDate && !errors.startDate && !errors.endDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="text-sm text-blue-700">
                <strong>Duration:</strong> {calculateDisplayDuration()} day{calculateDisplayDuration() !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-1" />
              Production Area
            </label>
            <select
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.area ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
              required
            >
              <option value="">Select Production Area</option>
              {areas.map(area => (
                <option key={area} value={area}>
                  {area} ({getAreaOrderCount(area)} existing orders)
                </option>
              ))}
            </select>
            {errors.area && (
              <p className="mt-1 text-sm text-red-600">{errors.area}</p>
            )}
           {formData.area && (
  <p className="mt-1 text-sm text-gray-500">
    Next order will be: <strong>#{getAreaOrderCount(formData.area) + 1}{formData.area.charAt(0)} [8-digit-code]</strong>
  </p>
)}

          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-1" />
              Assignee
            </label>
            <select
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.assignee ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
              required
            >
              <option value="">Select Assignee</option>
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
            {errors.assignee && (
              <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
            )}
          </div>

          {/* Progress (for non-planned orders) */}
          {formData.status !== 'planned' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Progress
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {formData.progress}%
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
