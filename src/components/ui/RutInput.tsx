import React, { forwardRef, useState } from 'react';
import { Input } from './Input';
import { validarRut, formatearRut } from '../../utils/validations';

interface RutInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  onRutChange?: (rut: string, isValid: boolean) => void;
}

export const RutInput = forwardRef<HTMLInputElement, RutInputProps>(({
  label = "RUT",
  error,
  helperText = "Ejemplo: 12.345.678-9",
  onChange,
  onRutChange,
  value = '',
  ...props
}, ref) => {
  const [rutValue, setRutValue] = useState(value?.toString() || '');
  const [rutError, setRutError] = useState(error || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remover caracteres no válidos (solo números, puntos, guiones y k/K)
    inputValue = inputValue.replace(/[^0-9kK.-]/g, '');
    
    // Limitar longitud máxima
    if (inputValue.replace(/[.-]/g, '').length > 9) {
      return;
    }
    
    // Formatear automáticamente mientras se escribe
    let formattedValue = inputValue;
    if (inputValue.length > 1) {
      // Solo formatear si tiene al menos 2 caracteres
      const rutLimpio = inputValue.replace(/[.-]/g, '');
      if (rutLimpio.length >= 2) {
        formattedValue = formatearRut(rutLimpio);
      }
    }
    
    setRutValue(formattedValue);
    
    // Validar RUT
    let newError = '';
    if (formattedValue.length > 0) {
      const rutLimpio = formattedValue.replace(/[.-]/g, '');
      if (rutLimpio.length >= 8) {
        const isValid = validarRut(formattedValue);
        if (!isValid) {
          newError = 'RUT inválido';
        }
        
        // Callback con el RUT y su validez
        if (onRutChange) {
          onRutChange(formattedValue, isValid);
        }
      }
    }
    
    setRutError(newError);
    
    // Llamar al onChange original si existe
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: formattedValue }
      };
      onChange(syntheticEvent);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Validación final al perder el foco
    if (rutValue.length > 0) {
      const rutLimpio = rutValue.replace(/[.-]/g, '');
      if (rutLimpio.length < 8) {
        setRutError('RUT incompleto');
      } else {
        const isValid = validarRut(rutValue);
        setRutError(isValid ? '' : 'RUT inválido');
        
        if (onRutChange) {
          onRutChange(rutValue, isValid);
        }
      }
    }
    
    // Llamar al onBlur original si existe
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Limpiar error al enfocar si está vacío
    if (rutValue.length === 0) {
      setRutError('');
    }
    
    // Llamar al onFocus original si existe
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  return (
    <Input
      ref={ref}
      type="text"
      label={label}
      error={error || rutError}
      helperText={helperText}
      value={rutValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder="12.345.678-9"
      maxLength={12} // Formato: 12.345.678-9
      {...props}
    />
  );
});

RutInput.displayName = 'RutInput';

export default RutInput; 