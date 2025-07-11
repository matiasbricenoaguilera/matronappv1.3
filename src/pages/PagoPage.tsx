import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Shield, 
  ArrowLeft, 
  Clock,
  Heart,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StepperProgress } from '../components/ui/StepperProgress';
import { formatearPrecio } from '../utils/formatters';

export const PagoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Datos del análisis médico desde la página anterior
  const analysis = location.state?.analysis;
  const precio = location.state?.precio || 4990;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('webpay');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Simular proceso de pago
  const handlePago = async () => {
    setIsProcessing(true);
    
    try {
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular éxito del pago
      navigate('/pago-exitoso', { 
        state: { 
          analysis,
          precio,
          numeroOrden: Math.floor(Math.random() * 1000000)
        }
      });
      
    } catch (error) {
      console.error('Error en el pago:', error);
      setIsProcessing(false);
    }
  };

  // Pasos del proceso
  const steps = [
    { id: "registro", title: "Registro", description: "Cuenta creada" },
    { id: "cuestionario", title: "Cuestionario", description: "Información médica" },
    { id: "recomendacion", title: "Recomendación", description: "Análisis completado" },
    { id: "pago", title: "Pago", description: "Confirmar pedido" },
    { id: "receta", title: "Receta Lista", description: "¡En 5 minutos!" }
  ];

  const currentStep = 3;
  const completedSteps = [0, 1, 2];

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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
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
        <div className="max-w-6xl mx-auto">
          
          {/* Progress Stepper */}
          <div className="mb-8">
            <StepperProgress 
              steps={steps} 
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Información del pedido */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Resumen del pedido */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resumen del Pedido
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {analysis.recomendacion.anticonceptivoRecomendado}
                        </p>
                        <p className="text-sm text-gray-600">
                          Receta digital válida por 30 días
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatearPrecio(precio)}
                        </p>
                        <p className="text-sm text-gray-500">
                          vs {formatearPrecio(25000)} tradicional
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Tiempo estimado: 5 minutos después del pago
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Información personal */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Información Personal
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Nombre</p>
                      <p className="font-medium">{user.nombre} {user.apellido}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">RUT</p>
                      <p className="font-medium">{user.rut}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Teléfono</p>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-medium">{user.telefono}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Métodos de pago */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Método de Pago
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {/* WebPay */}
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === 'webpay' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment('webpay')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={selectedPayment === 'webpay'}
                            onChange={() => setSelectedPayment('webpay')}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">WebPay Plus</p>
                            <p className="text-sm text-gray-600">
                              Tarjetas de crédito y débito
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img 
                            src="/api/placeholder/40/25" 
                            alt="WebPay" 
                            className="h-6"
                          />
                          <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Transferencia */}
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === 'transferencia' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment('transferencia')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={selectedPayment === 'transferencia'}
                            onChange={() => setSelectedPayment('transferencia')}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">Transferencia Bancaria</p>
                            <p className="text-sm text-gray-600">
                              Pago inmediato desde tu banco
                            </p>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          🏦
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Términos y condiciones */}
              <Card>
                <CardBody>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      He leído y acepto los{' '}
                      <a href="/terminos" className="text-primary hover:underline">
                        términos y condiciones
                      </a>{' '}
                      y la{' '}
                      <a href="/privacidad" className="text-primary hover:underline">
                        política de privacidad
                      </a>
                    </label>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Columna derecha - Resumen y pago */}
            <div className="space-y-6">
              
              {/* Resumen de pago */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resumen de Pago
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consulta médica</span>
                      <span className="font-medium">{formatearPrecio(precio)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Receta digital</span>
                      <span className="font-medium">Incluida</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatearPrecio(precio)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Seguridad */}
              <Card className="bg-green-50 border-green-200">
                <CardBody>
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">Pago Seguro</p>
                      <p className="text-sm text-green-700">
                        Protegido con encriptación SSL
                      </p>
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
                  onClick={handlePago}
                  disabled={!acceptedTerms || isProcessing}
                  loading={isProcessing}
                >
                  {isProcessing ? 'Procesando Pago...' : `Pagar ${formatearPrecio(precio)}`}
                  {!isProcessing && <CreditCard className="w-5 h-5 ml-2" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate(-1)}
                  disabled={isProcessing}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </div>

              {/* Garantía */}
              <div className="text-center text-sm text-gray-500">
                <p>💝 Garantía de satisfacción al 100%</p>
                <p>Si no estás satisfecha, te devolvemos tu dinero</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 