import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// Schema de validación con Zod
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email es requerido')
    .email('Email inválido'),
  
  password: z.string()
    .min(1, 'Contraseña es requerida'),
  
  recordarme: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Título del formulario */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenida de vuelta
        </h2>
        <p className="text-gray-600">
          Ingresa a tu cuenta para obtener tu receta al instante
        </p>
      </div>

      {/* Campos del formulario */}
      <div className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="tu@email.com"
          leftIcon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          autoComplete="email"
        />
        
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          placeholder="Tu contraseña"
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </div>

      {/* Opciones adicionales */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            {...register('recordarme')}
            type="checkbox"
            id="recordarme"
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="recordarme" className="ml-2 text-sm text-gray-600">
            Recordarme
          </label>
        </div>

        <a 
          href="/recuperar-password" 
          className="text-sm text-primary hover:text-primary/80 underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
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
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        {!isLoading && <LogIn className="w-5 h-5 ml-2" />}
      </Button>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">o</span>
        </div>
      </div>

      {/* Registro Link */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          ¿Primera vez en MatronApp?
        </p>
        
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => window.location.href = '/registro'}
        >
          Crear cuenta nueva
          <UserPlus className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Benefits Reminder */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mt-6">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center text-primary">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            5 minutos
          </div>
          <div className="flex items-center text-secondary">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            $4.990
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% seguro
          </div>
        </div>
      </div>
    </form>
  );
}; 