import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CuestionarioMedicoForm } from '../components/forms/CuestionarioMedicoForm';
import { StepperProgress } from '../components/ui/StepperProgress';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { CuestionarioMedico } from '../types';
import { analizarCuestionarioMedico, MedicalAnalysis } from '../utils/medicalRecommendations';
import { CheckCircle, AlertTriangle, Clock, Heart, ArrowRight, User } from 'lucide-react';

export const CuestionarioPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MedicalAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Mensaje de bienvenida si viene del registro
  const successMessage = location.state?.message;

  const handleSubmit = async (data: CuestionarioMedico) => {
    setIsLoading(true);

    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analizar cuestionario
      const medicalAnalysis = analizarCuestionarioMedico(data);
      setAnalysis(medicalAnalysis);
      
      // Guardar cuestionario (simular)
      localStorage.setItem('matronapp_cuestionario', JSON.stringify({
        usuarioId: user?.id,
        cuestionario: data,
        analysis: medicalAnalysis,
        fecha: new Date().toISOString()
      }));

      setShowResults(true);
      
    } catch (error) {
      console.error('Error al procesar cuestionario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinuarPago = () => {
    if (analysis?.esApta) {
      navigate('/pago', { 
        state: { 
          analysis,
          precio: 4990 
        }
      });
    } else {
      navigate('/contacto-matrona', { 
        state: { 
          analysis,
          requiereAtencionEspecial: true 
        }
      });
    }
  };

  // Pasos del proceso
  const steps = [
    { id: "registro", title: "Registro", description: "Cuenta creada" },
    { id: "cuestionario", title: "Cuestionario Médico", description: "Preguntas de salud" },
    { id: "recomendacion", title: "Recomendación", description: "Análisis médico" },
    { id: "pago", title: "Pago", description: "Confirmar pedido" },
    { id: "receta", title: "Receta Lista", description: "¡En 5 minutos!" }
  ];

  const currentStep = showResults ? 2 : 1;
  const completedSteps = [0]; // Registro completado

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder al cuestionario.</p>
          <Button onClick={() => navigate('/login')}>
            Iniciar Sesión
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MatronApp</span>
            </a>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-1" />
                {user.nombre} {user.apellido}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Mi Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Message */}
          {successMessage && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <p className="text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Progress Stepper */}
          <div className="mb-8">
            <StepperProgress 
              steps={steps} 
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          {!showResults ? (
            /* Cuestionario Form */
            <Card className="p-8">
              <CuestionarioMedicoForm 
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </Card>
          ) : (
            /* Results View */
            <div className="space-y-8">
              {/* Header de Resultados */}
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  analysis?.esApta 
                    ? 'bg-green-100' 
                    : 'bg-yellow-100'
                }`}>
                  {analysis?.esApta ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {analysis?.esApta ? '¡Análisis Completado!' : 'Revisión Especializada Requerida'}
                </h2>
                
                <p className="text-lg text-gray-600">
                  {analysis?.esApta 
                    ? 'Hemos encontrado la mejor opción anticonceptiva para ti'
                    : 'Tu caso requiere atención personalizada de nuestras matronas'
                  }
                </p>
              </div>

              {/* Recomendación Principal */}
              <Card className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Recomendación Principal
                    </h3>
                    <div className="bg-primary/5 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-primary text-lg">
                        {analysis?.recomendacion.anticonceptivoRecomendado}
                      </h4>
                      <p className="text-gray-700 mt-2">
                        {analysis?.recomendacion.razon}
                      </p>
                    </div>
                    
                    {analysis?.recomendacion.alternativas && analysis.recomendacion.alternativas.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Alternativas:</h5>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {analysis.recomendacion.alternativas.map((alt, index) => (
                            <li key={index}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Tiempo de Respuesta */}
              <Card className="p-6">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-secondary mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tiempo Estimado de Respuesta
                    </h3>
                    <p className="text-secondary font-medium text-xl">
                      {analysis?.tiempoEstimadoRespuesta}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Una matrona certificada revisará tu caso
                    </p>
                  </div>
                </div>
              </Card>

              {/* Comentarios de la Matrona */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Comentarios de Nuestras Matronas
                </h3>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-800 leading-relaxed">
                    {analysis?.comentariosMatrona}
                  </p>
                </div>
              </Card>

              {/* Advertencias y Contraindicaciones */}
              {(analysis?.recomendacion.advertencias.length || analysis?.recomendacion.contraindicaciones.length) && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Consideraciones Importantes
                  </h3>
                  
                  {analysis.recomendacion.contraindicaciones.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-800 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Contraindicaciones:
                      </h4>
                      <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                        {analysis.recomendacion.contraindicaciones.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.recomendacion.advertencias.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Advertencias:
                      </h4>
                      <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                        {analysis.recomendacion.advertencias.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              )}

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowResults(false)}
                >
                  Revisar Respuestas
                </Button>
                
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleContinuarPago}
                >
                  {analysis?.esApta ? 'Continuar con el Pago' : 'Contactar Matrona'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Precio */}
              {analysis?.esApta && (
                <div className="text-center">
                  <div className="inline-flex items-center bg-secondary/10 rounded-lg px-6 py-3">
                    <span className="text-secondary font-semibold text-lg">
                      Precio: $4.990
                    </span>
                    <span className="text-gray-600 text-sm ml-2">
                      (vs $25.000 consulta tradicional)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 