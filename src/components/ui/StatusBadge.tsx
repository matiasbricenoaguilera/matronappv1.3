import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  icon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  icon = true 
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    if (!icon) return null;
    
    switch (status) {
      case 'success':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'warning':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'error':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'info':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {getStatusIcon()}
      {children}
    </span>
  );
};

export default StatusBadge; 