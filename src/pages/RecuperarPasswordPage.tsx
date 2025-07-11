import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

// Schema de validación
const recuperarPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email es requerido')
    .email('Email inválido'),
});

type RecuperarPasswordData = z.infer<typeof recuperarPasswordSchema>;

export const RecuperarPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RecuperarPasswordData>({
    resolver: zodResolver(recuperarPasswordSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: RecuperarPasswordData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular llamada API para recuperación de contraseña
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular éxito
      setIsSuccess(true);
      
    } catch (err: any) {
      setError('Error al enviar el email. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        {/* Header Simple */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">MatronApp</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Success Content */}
        <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="p-6 sm:p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Email enviado!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Hemos enviado las instrucciones para restablecer tu contraseña a tu email. 
                Revisa tu bandeja de entrada y sigue los pasos indicados.
              </p>
              
              <div className="space-y-4">
                <Link to="/login">
                  <Button variant="primary" className="w-full">
                    Volver al login
                  </Button>
                </Link>
                
                <p className="text-sm text-gray-500">
                  ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="text-primary hover:underline"
                  >
                    inténtalo nuevamente
                  </button>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header Simple */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">MatronApp</span>
            </Link>
            
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Título */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Recuperar contraseña
                </h2>
                <p className="text-gray-600">
                  Ingresa tu email y te enviaremos las instrucciones para restablecer tu contraseña
                </p>
              </div>

              {/* Campo de email */}
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="tu@email.com"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                autoComplete="email"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isLoading}
                disabled={!isValid || isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
                {!isLoading && <Send className="w-5 h-5 ml-2" />}
              </Button>

              {/* Back to login */}
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver al login
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}; 