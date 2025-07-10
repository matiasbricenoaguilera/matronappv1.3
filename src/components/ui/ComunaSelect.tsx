import React, { forwardRef, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { comunasChile } from '../../data/mockData';
import { Comuna } from '../../types';

interface ComunaSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  onComunaChange?: (comuna: Comuna | null) => void;
}

export const ComunaSelect = forwardRef<HTMLSelectElement, ComunaSelectProps>(({
  label = "Comuna",
  error,
  helperText,
  placeholder = "Selecciona tu comuna",
  onChange,
  onComunaChange,
  value = '',
  className = '',
  disabled,
  ...props
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value?.toString() || '');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoValor = e.target.value;
    setSelectedValue(nuevoValor);
    
    // Encontrar la comuna seleccionada
    const comunaSeleccionada = nuevoValor 
      ? comunasChile.find(comuna => comuna.codigo === nuevoValor) || null
      : null;
    
    // Callback con la comuna completa
    if (onComunaChange) {
      onComunaChange(comunaSeleccionada);
    }
    
    // Llamar al onChange original si existe
    if (onChange) {
      onChange(e);
    }
  };

  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white';
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-primary focus:ring-primary hover:border-gray-400';
    
  const selectClasses = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <select
          ref={ref}
          value={selectedValue}
          onChange={handleChange}
          className={`${selectClasses} pl-10 pr-10`}
          disabled={disabled}
          {...props}
        >
          <option value="">{placeholder}</option>
          
          {/* Agrupar por región */}
          <optgroup label="Región Metropolitana">
            {comunasChile
              .filter(comuna => comuna.region === "Región Metropolitana")
              .map(comuna => (
                <option key={comuna.codigo} value={comuna.codigo}>
                  {comuna.nombre}
                </option>
              ))
            }
          </optgroup>
          
          <optgroup label="Región de Valparaíso">
            {comunasChile
              .filter(comuna => comuna.region === "Región de Valparaíso")
              .map(comuna => (
                <option key={comuna.codigo} value={comuna.codigo}>
                  {comuna.nombre}
                </option>
              ))
            }
          </optgroup>
          
          <optgroup label="Región del Biobío">
            {comunasChile
              .filter(comuna => comuna.region === "Región del Biobío")
              .map(comuna => (
                <option key={comuna.codigo} value={comuna.codigo}>
                  {comuna.nombre}
                </option>
              ))
            }
          </optgroup>
          
          <optgroup label="Otras Regiones">
            {comunasChile
              .filter(comuna => 
                !["Región Metropolitana", "Región de Valparaíso", "Región del Biobío"].includes(comuna.region)
              )
              .map(comuna => (
                <option key={comuna.codigo} value={comuna.codigo}>
                  {comuna.nombre}, {comuna.region}
                </option>
              ))
            }
          </optgroup>
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {error && (
        <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
          <MapPin className="h-4 w-4" />
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

ComunaSelect.displayName = 'ComunaSelect';

export default ComunaSelect; 