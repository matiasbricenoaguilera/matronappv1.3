import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  User, 
  Calendar,
  Pill,
  FileText,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { DashboardLayout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatearFecha, formatearPrecio } from '../utils/formatters';

type TipoSolicitud = 'nueva' | 'renovar' | null;

interface RecetaAnterior {
  id: number;
  fecha: Date;
  anticonceptivo: string;
  precio: number;
  matrona: string;
  vigencia: Date;
}

export const NuevaRecetaPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tipoSolicitud] = useState<TipoSolicitud>(null);
  const [cargando, setCargando] = useState(false);

  // Datos simulados de receta anterior
  const recetaAnterior: RecetaAnterior = {
    id: 1,
    fecha: new Date('2024-01-15'),
    anticonceptivo: 'Yasmin 21',
    precio: 4990,
    matrona: 'Dra. Patricia Morales',
    vigencia: new Date('2024-02-15')
  };

  const esUsuarioRecurrente = Boolean(recetaAnterior);
  const diasParaVencer = Math.ceil((recetaAnterior.vigencia.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const recetaProximaAVencer = diasParaVencer <= 7;

  const handleSolicitudNueva = async () => {
    setCargando(true);
    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast({
        type: 'success',
        title: 'Iniciando nueva solicitud',
        message: 'Te dirigiremos al cuestionario médico'
      });
      
      navigate('/cuestionario');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo procesar la solicitud. Intenta nuevamente.'
      });
    } finally {
      setCargando(false);
    }
  };

  const handleRenovarReceta = async () => {
    setCargando(true);
    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast({
        type: 'success',
        title: 'Renovando receta',
        message: 'Procesando renovación con tus datos anteriores'
      });
      
      // Navegar a cuestionario con datos pre-llenados
      navigate('/cuestionario', { 
        state: { 
          renovacion: true, 
          recetaAnterior: recetaAnterior 
        } 
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo renovar la receta. Intenta nuevamente.'
      });
    } finally {
      setCargando(false);
    }
  };

  if (!tipoSolicitud) {
    return (
      <DashboardLayout
        title="Nueva Receta"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Volver al Dashboard
          </Button>
        }
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Bienvenida */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Hola {user?.nombre}!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {esUsuarioRecurrente 
                ? "Te ayudamos a obtener tu nueva receta anticonceptiva rápidamente"
                : "Bienvenida a MatronApp. Obtén tu primera receta anticonceptiva en minutos"
              }
            </p>
          </div>

          {/* Alerta de receta próxima a vencer */}
          {esUsuarioRecurrente && recetaProximaAVencer && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-amber-800">
                    Tu receta vence en {diasParaVencer} día{diasParaVencer !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-amber-700">
                    Te recomendamos renovarla para evitar quedarte sin medicamento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Opciones para usuario recurrente */}
          {esUsuarioRecurrente && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Renovar receta anterior */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Recomendado
                  </span>
                </div>
                <CardBody className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Renovar Receta Anterior
                      </h3>
                      <p className="text-sm text-green-600 font-medium">
                        Más rápido y fácil
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Pill className="w-4 h-4 mr-2" />
                      <span>{recetaAnterior.anticonceptivo}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>{recetaAnterior.matrona}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Última receta: {formatearFecha(recetaAnterior.fecha)}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Datos médicos pre-llenados</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Proceso más rápido</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Misma matrona disponible</span>
                    </li>
                  </ul>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Precio</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatearPrecio(recetaAnterior.precio)}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleRenovarReceta}
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Renovar Receta
                      </>
                    )}
                  </Button>
                </CardBody>
              </Card>

              {/* Nueva receta diferente */}
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Nueva Receta
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        Anticonceptivo diferente
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    ¿Quieres cambiar de anticonceptivo o necesitas una evaluación médica completa?
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                      <span>Evaluación médica completa</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                      <span>Opciones de anticonceptivos</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                      <span>Consulta personalizada</span>
                    </li>
                  </ul>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Precio</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatearPrecio(4990)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSolicitudNueva}
                    disabled={cargando}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Receta
                  </Button>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Opciones para usuario nuevo */}
          {!esUsuarioRecurrente && (
            <Card className="max-w-2xl mx-auto">
              <CardBody className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tu Primera Receta Anticonceptiva
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Completa nuestro cuestionario médico seguro para que una matrona profesional pueda evaluarte y emitir tu receta.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm text-gray-600">Cuestionario médico</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm text-gray-600">Revisión profesional</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm text-gray-600">Receta en 5 minutos</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Precio total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatearPrecio(4990)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Incluye consulta médica y receta digital
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleSolicitudNueva}
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    <>
                      Comenzar Cuestionario
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardBody>
            </Card>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <h4 className="font-semibold text-blue-900 mb-2">
              ¿Por qué elegir MatronApp?
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Matronas profesionales certificadas</li>
              <li>• Proceso 100% digital y seguro</li>
              <li>• Respuesta en 5 minutos o menos</li>
              <li>• Recetas válidas en todas las farmacias</li>
              <li>• Soporte médico continuo</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return null;
}; 