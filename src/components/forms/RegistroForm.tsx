import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RutInput } from '../ui/RutInput';
import { ComunaSelect } from '../ui/ComunaSelect';
import { validarRut, validarTelefono } from '../../utils/validations';

// Schema de validación con Zod
const registroSchema = z.object({
  nombre: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50, 'Nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  apellido: z.string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(50, 'Apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  rut: z.string()
    .min(1, 'RUT es requerido')
    .refine(validarRut, 'RUT inválido'),
  
  fechaNacimiento: z.string()
    .min(1, 'Fecha de nacimiento es requerida')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 60;
    }, 'Debes ser mayor de 18 años y menor de 60'),
  
  email: z.string()
    .min(1, 'Email es requerido')
    .email('Email inválido')
    .max(100, 'Email no puede exceder 100 caracteres'),
  
  telefono: z.string()
    .min(1, 'Teléfono es requerido')
    .refine(validarTelefono, 'Formato: +56 9 XXXX XXXX'),
  
  comuna: z.string()
    .min(1, 'Comuna es requerida'),
  
  direccion: z.string()
    .min(5, 'Dirección debe tener al menos 5 caracteres')
    .max(100, 'Dirección no puede exceder 100 caracteres'),
  
  password: z.string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .max(50, 'Contraseña no puede exceder 50 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener: minúscula, mayúscula y número'),
  
  confirmPassword: z.string()
    .min(1, 'Confirma tu contraseña'),
  
  aceptaTerminos: z.boolean()
    .refine((val) => val === true, 'Debes aceptar los términos y condiciones')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegistroFormData = z.infer<typeof registroSchema>;

interface RegistroFormProps {
  onSubmit: (data: RegistroFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export const RegistroForm: React.FC<RegistroFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    mode: 'onChange'
  });

  const watchedPassword = watch('password');

  const handleRutChange = async (rut: string, isValid: boolean) => {
    setValue('rut', rut);
    await trigger('rut');
  };

  const handleComunaChange = async (comuna: any) => {
    setValue('comuna', comuna?.codigo || '');
    await trigger('comuna');
  };

  const passwordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 2) return 'Débil';
    if (strength === 3) return 'Moderada';
    if (strength === 4) return 'Fuerte';
    return 'Muy fuerte';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información Personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Información Personal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('nombre')}
            label="Nombre *"
            placeholder="Tu nombre"
            leftIcon={<User className="w-5 h-5" />}
            error={errors.nombre?.message}
          />
          
          <Input
            {...register('apellido')}
            label="Apellido *"
            placeholder="Tu apellido"
            leftIcon={<User className="w-5 h-5" />}
            error={errors.apellido?.message}
          />
        </div>

        <RutInput
          label="RUT *"
          placeholder="12.345.678-9"
          onRutChange={handleRutChange}
          error={errors.rut?.message}
        />
        
        <Input
          {...register('fechaNacimiento')}
          type="date"
          label="Fecha de Nacimiento *"
          error={errors.fechaNacimiento?.message}
          max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
          min={new Date(new Date().getFullYear() - 60, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
        />
      </div>

      {/* Información de Contacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Información de Contacto
        </h3>
        
        <Input
          {...register('email')}
          type="email"
          label="Email *"
          placeholder="tu@email.com"
          leftIcon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
        />
        
        <Input
          {...register('telefono')}
          type="tel"
          label="Teléfono *"
          placeholder="+56 9 XXXX XXXX"
          leftIcon={<Phone className="w-5 h-5" />}
          error={errors.telefono?.message}
        />
      </div>

      {/* Dirección */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Dirección
        </h3>
        
        <ComunaSelect
          label="Comuna *"
          placeholder="Selecciona tu comuna"
          onComunaChange={handleComunaChange}
          error={errors.comuna?.message}
        />
        
        <Input
          {...register('direccion')}
          label="Dirección *"
          placeholder="Av. Providencia 123, Depto 45"
          error={errors.direccion?.message}
        />
      </div>

      {/* Contraseña */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Contraseña
        </h3>
        
        <div className="space-y-2">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Contraseña *"
            placeholder="Mínimo 8 caracteres"
            leftIcon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={errors.password?.message}
          />
          
          {/* Password Strength Indicator */}
          {watchedPassword && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fortaleza:</span>
                <span className={`font-medium ${
                  passwordStrength(watchedPassword) <= 2 ? 'text-red-600' :
                  passwordStrength(watchedPassword) === 3 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {getPasswordStrengthText(passwordStrength(watchedPassword))}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength(watchedPassword))}`}
                  style={{ width: `${(passwordStrength(watchedPassword) / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        <Input
          {...register('confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirmar Contraseña *"
          placeholder="Repite tu contraseña"
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          error={errors.confirmPassword?.message}
        />
      </div>

      {/* Términos y Condiciones */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            {...register('aceptaTerminos')}
            type="checkbox"
            id="aceptaTerminos"
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="aceptaTerminos" className="text-sm text-gray-600 leading-5">
            Acepto los{' '}
            <a href="/terminos" className="text-primary hover:text-primary/80 underline">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="/privacidad" className="text-primary hover:text-primary/80 underline">
              política de privacidad
            </a>{' '}
            de MatronApp *
          </label>
        </div>
        {errors.aceptaTerminos && (
          <p className="text-sm text-red-600">{errors.aceptaTerminos.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={isLoading}
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
        {!isLoading && <CheckCircle className="w-5 h-5 ml-2" />}
      </Button>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-primary hover:text-primary/80 font-medium underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </form>
  );
}; 