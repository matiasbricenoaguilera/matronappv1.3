import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Plus, 
  FileText, 
  Clock, 
  Calendar,
  Download,
  Phone,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/Layout';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatearFecha, formatearPrecio } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Datos simulados de solicitudes
  const solicitudes = [
    {
      id: 1,
      fecha: new Date('2024-01-15'),
      estado: 'completada',
      anticonceptivo: 'Yasmin 21',
      precio: 4990,
      matrona: 'Dra. Patricia Morales',
      tiempoRespuesta: '3 minutos'
    },
    {
      id: 2,
      fecha: new Date('2024-01-10'),
      estado: 'en_revision',
      anticonceptivo: 'Pendiente',
      precio: 4990,
      matrona: 'Dra. Carmen Silva',
      tiempoRespuesta: 'En proceso'
    }
  ];

  const stats = [
    {
      title: 'Recetas Obtenidas',
      value: '2',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Tiempo Promedio',
      value: '3 min',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Ahorro Total',
      value: '$40.020',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-primary/20 text-primary'
    }
  ];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'success';
      case 'en_revision':
        return 'warning';
      case 'rechazada':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'Completada';
      case 'en_revision':
        return 'En Revisión';
      case 'rechazada':
        return 'Rechazada';
      default:
        return 'Pendiente';
    }
  };

  return (
    <DashboardLayout
      title={`¡Hola, ${user?.nombre}!`}
      actions={
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/configuracion')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/historial')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver Historial
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/nueva-receta')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Receta
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Bienvenida */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                ¡Bienvenida a tu MatronApp!
              </h2>
              <p className="text-gray-600">
                Aquí puedes ver el estado de tus solicitudes y obtener nuevas recetas en minutos.
              </p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-primary/30" />
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Solicitudes Recientes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Mis Solicitudes Recientes
              </h3>
              <Link to="/historial" className="text-primary hover:text-primary/80 text-sm">
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {solicitudes.map((solicitud) => (
                <div
                  key={solicitud.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <StatusBadge status={getStatusColor(solicitud.estado)}>
                          {getStatusText(solicitud.estado)}
                        </StatusBadge>
                        <span className="text-sm text-gray-500">
                          {formatearFecha(solicitud.fecha)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Anticonceptivo</p>
                          <p className="font-medium">{solicitud.anticonceptivo}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Matrona</p>
                          <p className="font-medium">{solicitud.matrona}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tiempo de respuesta</p>
                          <p className="font-medium">{solicitud.tiempoRespuesta}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Precio</p>
                        <p className="font-semibold text-gray-900">
                          {formatearPrecio(solicitud.precio)}
                        </p>
                      </div>
                      
                      {solicitud.estado === 'completada' && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {solicitudes.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Aún no tienes solicitudes de recetas
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/nueva-receta')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear mi primera receta
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Nueva Receta
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              ¿Necesitas una nueva receta anticonceptiva? Obtén una en 5 minutos.
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/nueva-receta')}
            >
              Comenzar ahora
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">
                Soporte
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              ¿Tienes dudas? Nuestro equipo está aquí para ayudarte.
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/contacto')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat en línea
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open('tel:+56912345678')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Llamar: +56 9 1234 5678
              </Button>
            </div>
          </Card>
        </div>

        {/* Próxima Consulta */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  Renovación de Receta
                </h4>
                <p className="text-gray-600">
                  Tu receta actual vence el 15 de febrero. ¿Quieres renovarla?
                </p>
              </div>
              <Button variant="outline" size="sm">
                Renovar ahora
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}; 