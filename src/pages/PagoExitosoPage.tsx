import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Clock, 
  Heart,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StepperProgress } from '../components/ui/StepperProgress';
import { formatearPrecio, formatearFecha } from '../utils/formatters';

export const PagoExitosoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Datos del pago desde la página anterior
  const analysis = location.state?.analysis;
  const precio = location.state?.precio || 4990;
  const numeroOrden = location.state?.numeroOrden || '123456';
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos en segundos
  const [recetaLista, setRecetaLista] = useState(false);

  // Countdown para mostrar cuándo estará lista la receta
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRecetaLista(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formatear tiempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Pasos del proceso
  const steps = [
    { id: "registro", title: "Registro", description: "Cuenta creada" },
    { id: "cuestionario", title: "Cuestionario", description: "Información médica" },
    { id: "recomendacion", title: "Recomendación", description: "Análisis completado" },
    { id: "pago", title: "Pago", description: "Pago procesado" },
    { id: "receta", title: "Receta Lista", description: "¡Disponible!" }
  ];

  const currentStep = recetaLista ? 4 : 3;
  const completedSteps = recetaLista ? [0, 1, 2, 3] : [0, 1, 2];

  if (!user || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">No se encontraron datos del pedido.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MatronApp</span>
            </div>
            
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
          
          {/* Progress Stepper */}
          <div className="mb-8">
            <StepperProgress 
              steps={steps} 
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          {/* Confirmación de pago */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Pago Procesado Exitosamente!
            </h1>
            
            <p className="text-lg text-gray-600 mb-4">
              Tu receta {recetaLista ? 'está lista' : 'estará lista en'}
            </p>
            
            {!recetaLista && (
              <div className="text-4xl font-bold text-primary mb-2">
                {formatTime(timeLeft)}
              </div>
            )}
            
            <p className="text-gray-600">
              Orden #{numeroOrden} • {formatearFecha(new Date())}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Detalles del pedido */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalles del Pedido
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Anticonceptivo Recomendado</p>
                      <p className="font-semibold text-gray-900">
                        {analysis.recomendacion.anticonceptivoRecomendado}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Precio Pagado</p>
                      <p className="font-semibold text-gray-900">
                        {formatearPrecio(precio)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Método de Pago</p>
                      <p className="font-semibold text-gray-900">WebPay Plus</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estado</p>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600 font-medium">Pagado</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Instrucciones */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Instrucciones de Uso
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-primary font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Descarga tu receta</h4>
                        <p className="text-gray-600 text-sm">
                          Una vez lista, podrás descargar tu receta en formato PDF
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-primary font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Lleva la receta a la farmacia</h4>
                        <p className="text-gray-600 text-sm">
                          Presenta la receta digital en cualquier farmacia
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-primary font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Compra tu anticonceptivo</h4>
                        <p className="text-gray-600 text-sm">
                          La receta es válida por 30 días desde la fecha de emisión
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Información de contacto */}
              <Card className="bg-blue-50 border-blue-200">
                <CardBody>
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">¿Necesitas ayuda?</p>
                      <p className="text-sm text-blue-700">
                        Llámanos al +56 9 1234 5678 o escríbenos a soporte@matronapp.cl
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Estado de la receta */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Estado de la Receta
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="text-center">
                    {recetaLista ? (
                      <div>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="font-semibold text-green-600 mb-4">
                          ¡Receta Lista!
                        </p>
                        <Button variant="primary" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar PDF
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                        <p className="font-semibold text-yellow-600 mb-2">
                          Preparando Receta
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          Tiempo restante: {formatTime(timeLeft)}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${((300 - timeLeft) / 300) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Próximos pasos */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Próximos Pasos
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">
                        Recibirás un email de confirmación
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">
                        Recordatorio 5 días antes del vencimiento
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">
                        Opción de renovación automática
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  Ir al Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/nueva-receta')}
                >
                  Nueva Receta
                </Button>
              </div>

              {/* Calificación */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardBody>
                  <div className="text-center">
                    <p className="font-medium text-gray-900 mb-2">
                      ¿Cómo fue tu experiencia?
                    </p>
                    <div className="flex justify-center space-x-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-6 h-6 text-yellow-400 fill-current cursor-pointer hover:text-yellow-500"
                        />
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Calificar Servicio
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 