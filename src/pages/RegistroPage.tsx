import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistroForm } from '../components/forms/RegistroForm';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { RegistroData } from '../types';

export const RegistroPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convertir datos del formulario al formato RegistroData
      const registroData: RegistroData = {
        nombre: data.nombre,
        apellido: data.apellido,
        rut: data.rut,
        fechaNacimiento: new Date(data.fechaNacimiento),
        email: data.email,
        telefono: data.telefono,
        password: data.password,
        direccion: {
          calle: data.direccion,
          numero: '',
          comuna: data.comuna,
          ciudad: 'Santiago'
        }
      };

      // Intentar registrar usuario
      await register(registroData);
      
      // Redirigir al cuestionario médico
      navigate('/cuestionario', { 
        replace: true,
        state: { message: '¡Cuenta creada exitosamente! Ahora completa tu perfil médico.' }
      });
      
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header Simple */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">MatronApp</span>
            </a>
            
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Únete a MatronApp
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Crea tu cuenta y obtén recetas anticonceptivas en 5 minutos
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-6 sm:p-8">
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
                      <p className="text-sm text-red-800">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario */}
              <RegistroForm 
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </Card>

            {/* Información Adicional */}
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ¿Por qué elegir MatronApp?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-medium">5 Minutos</p>
                    <p className="text-gray-600">Receta lista al instante</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <p className="font-medium">$4.990</p>
                    <p className="text-gray-600">vs $25.000 tradicional</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="font-medium">100% Seguro</p>
                    <p className="text-gray-600">Matronas certificadas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonios Rápidos */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="ml-2 text-gray-600">María José G.</span>
                </div>
                <p className="text-gray-700">"¡Estaba en la farmacia y en 3 minutos ya tenía mi receta!"</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="ml-2 text-gray-600">Francisca L.</span>
                </div>
                <p className="text-gray-700">"Me salvó la vida cuando necesitaba mi anticonceptivo urgente."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 