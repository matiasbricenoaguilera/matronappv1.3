import React from 'react';
import { formatearEstadoPrescripcion } from '../../utils/formatters';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  customText?: string;
  customColor?: string;
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  customText,
  customColor,
  showIcon = false,
  className = ''
}) => {
  const { texto: defaultText, color } = formatearEstadoPrescripcion(status);
  const text = customText || defaultText;
  const finalColor = customColor || color;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseClasses = 'inline-flex items-center gap-1 font-medium rounded-full';
  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${finalColor} ${className}`;

  // Iconos por estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enviada':
        return '📤';
      case 'asignada':
        return '👩‍⚕️';
      case 'en_revision':
        return '🔍';
      case 'aprobada':
        return '✅';
      case 'rechazada':
        return '❌';
      default:
        return '📄';
    }
  };

  return (
    <span className={finalClasses}>
      {showIcon && (
        <span className="text-xs">
          {getStatusIcon(status)}
        </span>
      )}
      {text}
    </span>
  );
};

interface StatusIndicatorProps {
  status: string;
  label?: string;
  description?: string;
  showProgress?: boolean;
  progress?: number;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  description,
  showProgress = false,
  progress = 0
}) => {
  const { texto: statusText, color } = formatearEstadoPrescripcion(status);
  
  const progressSteps = {
    'enviada': 20,
    'asignada': 40,
    'en_revision': 70,
    'aprobada': 100,
    'rechazada': 0
  };

  const currentProgress = progress || progressSteps[status as keyof typeof progressSteps] || 0;

  return (
    <div className="flex items-start gap-3">
      {/* Status Dot */}
      <div className="flex items-center gap-2 mt-1">
        <div className={`w-3 h-3 rounded-full ${color.includes('green') ? 'bg-green-500' : 
                                                  color.includes('blue') ? 'bg-blue-500' :
                                                  color.includes('yellow') ? 'bg-yellow-500' :
                                                  color.includes('orange') ? 'bg-orange-500' :
                                                  color.includes('red') ? 'bg-red-500' : 'bg-gray-500'}`} />
        <StatusBadge status={status} size="sm" />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        {label && (
          <div className="font-medium text-gray-900 mb-1">
            {label}
          </div>
        )}
        
        {description && (
          <div className="text-sm text-gray-600 mb-2">
            {description}
          </div>
        )}
        
        {showProgress && (
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progreso</span>
              <span>{currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentProgress === 100 ? 'bg-green-500' :
                  currentProgress >= 70 ? 'bg-orange-500' :
                  currentProgress >= 40 ? 'bg-yellow-500' :
                  currentProgress >= 20 ? 'bg-blue-500' : 'bg-gray-400'
                }`}
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBadge; 