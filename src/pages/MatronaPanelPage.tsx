import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Heart,
  User,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/Layout';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatearFecha } from '../utils/formatters';
import { descargarRecetaPDF, RecetaData } from '../utils/pdfGenerator';

interface SolicitudMedica {
  id: number;
  paciente: {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    email: string;
    telefono: string;
    edad: number;
  };
  fechaSolicitud: Date;
  estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada';
  prioridad: 'baja' | 'media' | 'alta';
  anticonceptivoSolicitado: string;
  motivoConsulta: string;
  cuestionarioMedico: {
    anticonceptivosActuales: string;
    alergias: string[];
    medicamentos: string[];
    fumadora: boolean;
    alcohol: string;
    ejercicio: string;
    antecedentesCardiovasculares: boolean;
    diabetes: boolean;
    cancer: boolean;
    migranas: boolean;
    embarazo: boolean;
    lactancia: boolean;
    cicloMenstrual: string;
  };
  tiempoLimite: Date;
  observaciones?: string;
}

export const MatronaPanelPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados
  const [solicitudes, setSolicitudes] = useState<SolicitudMedica[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState('');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudMedica | null>(null);
  const [procesando, setProcesando] = useState(false);

  // Verificar que el usuario es matrona
  useEffect(() => {
    if (!user || user.tipo !== 'matrona') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Datos simulados
  useEffect(() => {
    const solicitudesSimuladas: SolicitudMedica[] = [
      {
        id: 1,
        paciente: {
          id: 1,
          nombre: 'María José',
          apellido: 'González',
          rut: '12345678-9',
          email: 'maria@email.com',
          telefono: '+56 9 8765 4321',
          edad: 28
        },
        fechaSolicitud: new Date('2024-01-15T10:30:00'),
        estado: 'pendiente',
        prioridad: 'alta',
        anticonceptivoSolicitado: 'Yasmin 21',
        motivoConsulta: 'Renovación de receta habitual',
        cuestionarioMedico: {
          anticonceptivosActuales: 'Yasmin 21 (último año)',
          alergias: [],
          medicamentos: ['Ibuprofeno ocasional'],
          fumadora: false,
          alcohol: 'ocasional',
          ejercicio: 'regular',
          antecedentesCardiovasculares: false,
          diabetes: false,
          cancer: false,
          migranas: false,
          embarazo: false,
          lactancia: false,
          cicloMenstrual: 'regular'
        },
        tiempoLimite: new Date(Date.now() + 3 * 60 * 1000) // 3 minutos
      },
      {
        id: 2,
        paciente: {
          id: 2,
          nombre: 'Ana Carolina',
          apellido: 'Pérez',
          rut: '98765432-1',
          email: 'ana.perez@email.com',
          telefono: '+56 9 1234 5678',
          edad: 22
        },
        fechaSolicitud: new Date('2024-01-15T11:15:00'),
        estado: 'en_revision',
        prioridad: 'media',
        anticonceptivoSolicitado: 'Diane 35',
        motivoConsulta: 'Primera receta anticonceptiva',
        cuestionarioMedico: {
          anticonceptivosActuales: 'Ninguno',
          alergias: ['Penicilina'],
          medicamentos: [],
          fumadora: false,
          alcohol: 'nunca',
          ejercicio: 'moderado',
          antecedentesCardiovasculares: false,
          diabetes: false,
          cancer: false,
          migranas: true,
          embarazo: false,
          lactancia: false,
          cicloMenstrual: 'irregular'
        },
        tiempoLimite: new Date(Date.now() + 2 * 60 * 1000) // 2 minutos
      },
      {
        id: 3,
        paciente: {
          id: 3,
          nombre: 'Sofía',
          apellido: 'Martínez',
          rut: '11223344-5',
          email: 'sofia.martinez@email.com',
          telefono: '+56 9 5555 6666',
          edad: 35
        },
        fechaSolicitud: new Date('2024-01-15T09:45:00'),
        estado: 'aprobada',
        prioridad: 'baja',
        anticonceptivoSolicitado: 'Mirena DIU',
        motivoConsulta: 'Cambio de método anticonceptivo',
        cuestionarioMedico: {
          anticonceptivosActuales: 'Pastillas anticonceptivas',
          alergias: [],
          medicamentos: ['Vitamina D'],
          fumadora: false,
          alcohol: 'ocasional',
          ejercicio: 'regular',
          antecedentesCardiovasculares: false,
          diabetes: false,
          cancer: false,
          migranas: false,
          embarazo: false,
          lactancia: false,
          cicloMenstrual: 'regular'
        },
        tiempoLimite: new Date(Date.now() - 10 * 60 * 1000) // Completada hace 10 minutos
      }
    ];
    
    setSolicitudes(solicitudesSimuladas);
  }, []);

  // Filtrar solicitudes
  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    const cumpleFiltroEstado = filtroEstado === 'todas' || solicitud.estado === filtroEstado;
    const cumpleBusqueda = busqueda === '' || 
      solicitud.paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.paciente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.paciente.rut.includes(busqueda);
    
    return cumpleFiltroEstado && cumpleBusqueda;
  });

  // Manejar acciones de solicitud
  const manejarAccion = async (solicitudId: number, accion: 'aprobar' | 'rechazar', observaciones?: string) => {
    setProcesando(true);
    
    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const solicitudProcesada = solicitudes.find(s => s.id === solicitudId);
      
      if (accion === 'aprobar' && solicitudProcesada && user) {
        // Generar PDF de la receta
        const recetaData: RecetaData = {
          numeroReceta: `REC-${Date.now()}`,
          paciente: {
            nombre: solicitudProcesada.paciente.nombre,
            apellido: solicitudProcesada.paciente.apellido,
            rut: solicitudProcesada.paciente.rut,
            email: solicitudProcesada.paciente.email,
            telefono: solicitudProcesada.paciente.telefono,
            edad: solicitudProcesada.paciente.edad,
            direccion: 'Dirección del paciente' // En una app real vendría del perfil
          },
          matrona: {
            nombre: user.nombre,
            apellido: user.apellido,
            rut: user.rut,
            registroProfesional: 'MAT-2024-001',
            email: user.email || 'matrona@matronapp.cl',
            telefono: '+56 2 2345 6789'
          },
          medicamento: {
            nombre: solicitudProcesada.anticonceptivoSolicitado,
            concentracion: '3mg/0.03mg',
            forma: 'Comprimidos recubiertos',
            cantidad: '3 blísters (63 comprimidos)',
            posologia: '1 comprimido diario por vía oral, preferiblemente a la misma hora',
            duracion: '3 meses',
            observaciones: 'Tomar sin interrupción durante 21 días, luego 7 días de descanso. Repetir el ciclo.'
          },
          fechaEmision: new Date(),
          fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          diagnostico: 'Anticoncepción hormonal',
          indicaciones: [
            'Tomar el comprimido siempre a la misma hora.',
            'Si olvida una dosis, tomarla en cuanto se acuerde.',
            'No suspender el tratamiento sin consultar con su matrona.',
            'Realizar controles médicos cada 6 meses.',
            'Consultar inmediatamente si presenta dolor abdominal severo, dolor torácico o dificultad respiratoria.'
          ],
          centroMedico: {
            nombre: 'MatronApp - Salud Digital',
            direccion: 'Av. Apoquindo 4501, Las Condes, Santiago',
            telefono: '+56 2 2345 6789',
            email: 'contacto@matronapp.cl'
          }
        };
        
        // Descargar PDF automáticamente
        descargarRecetaPDF(recetaData);
      }
      
      setSolicitudes(prev => 
        prev.map(s => 
          s.id === solicitudId 
            ? { ...s, estado: accion === 'aprobar' ? 'aprobada' : 'rechazada', observaciones }
            : s
        )
      );
      
      setSolicitudSeleccionada(null);
      
    } catch (error) {
      console.error('Error al procesar solicitud:', error);
    } finally {
      setProcesando(false);
    }
  };

  // Obtener color de prioridad
  const getColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obtener tiempo restante
  const getTiempoRestante = (tiempoLimite: Date) => {
    const ahora = new Date();
    const diferencia = tiempoLimite.getTime() - ahora.getTime();
    
    if (diferencia <= 0) return 'Vencido';
    
    const minutos = Math.floor(diferencia / 60000);
    const segundos = Math.floor((diferencia % 60000) / 1000);
    
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  // Estadísticas
  const stats = {
    pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
    enRevision: solicitudes.filter(s => s.estado === 'en_revision').length,
    aprobadas: solicitudes.filter(s => s.estado === 'aprobada').length,
    rechazadas: solicitudes.filter(s => s.estado === 'rechazada').length
  };

  if (!user || user.tipo !== 'matrona') {
    return null;
  }

  return (
    <DashboardLayout
      title="Panel de Matrona"
      actions={
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <User className="w-4 h-4 mr-2" />
            Mi Perfil
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
                ¡Bienvenida, {user.nombre}!
              </h2>
              <p className="text-gray-600">
                Gestiona las solicitudes de recetas y ayuda a las pacientes a obtener sus anticonceptivos en tiempo récord.
              </p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-primary/30" />
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendientes}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Revisión</p>
                <p className="text-2xl font-bold text-blue-600">{stats.enRevision}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.aprobadas}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rechazadas</p>
                <p className="text-2xl font-bold text-red-600">{stats.rechazadas}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Solicitudes de Recetas</h3>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre o RUT..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <select 
                  value={filtroEstado} 
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="todas">Todas</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="aprobada">Aprobadas</option>
                  <option value="rechazada">Rechazadas</option>
                </select>
              </div>
            </div>
          </CardHeader>
          
          <CardBody>
            {solicitudesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron solicitudes.
              </div>
            ) : (
              <div className="space-y-4">
                {solicitudesFiltradas.map(solicitud => (
                  <div 
                    key={solicitud.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {solicitud.paciente.nombre} {solicitud.paciente.apellido}
                          </h4>
                          <StatusBadge status={
                            solicitud.estado === 'pendiente' ? 'warning' :
                            solicitud.estado === 'en_revision' ? 'info' :
                            solicitud.estado === 'aprobada' ? 'success' : 'error'
                          }>
                            {solicitud.estado === 'pendiente' ? 'Pendiente' :
                             solicitud.estado === 'en_revision' ? 'En Revisión' :
                             solicitud.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                          </StatusBadge>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getColorPrioridad(solicitud.prioridad)}`}>
                            {solicitud.prioridad.charAt(0).toUpperCase() + solicitud.prioridad.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">RUT:</span> {solicitud.paciente.rut}
                          </div>
                          <div>
                            <span className="font-medium">Edad:</span> {solicitud.paciente.edad} años
                          </div>
                          <div>
                            <span className="font-medium">Solicitud:</span> {solicitud.anticonceptivoSolicitado}
                          </div>
                          <div>
                            <span className="font-medium">Tiempo:</span> {getTiempoRestante(solicitud.tiempoLimite)}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Motivo:</span> {solicitud.motivoConsulta}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSolicitudSeleccionada(solicitud)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Revisar
                        </Button>
                        
                        {(solicitud.estado === 'pendiente' || solicitud.estado === 'en_revision') && (
                          <>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => manejarAccion(solicitud.id, 'aprobar')}
                              disabled={procesando}
                              className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => manejarAccion(solicitud.id, 'rechazar')}
                              disabled={procesando}
                              className="border-red-600 text-red-600 hover:bg-red-600 focus:ring-red-500"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rechazar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Modal de detalle de solicitud */}
      {solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalle de Solicitud #{solicitudSeleccionada.id}
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSolicitudSeleccionada(null)}
                >
                  Cerrar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del paciente */}
                <Card>
                  <CardHeader>
                    <h4 className="font-medium text-gray-900">Información del Paciente</h4>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Nombre completo</p>
                      <p className="font-medium">{solicitudSeleccionada.paciente.nombre} {solicitudSeleccionada.paciente.apellido}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">RUT</p>
                      <p className="font-medium">{solicitudSeleccionada.paciente.rut}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Edad</p>
                      <p className="font-medium">{solicitudSeleccionada.paciente.edad} años</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-medium">{solicitudSeleccionada.paciente.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-medium">{solicitudSeleccionada.paciente.telefono}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                
                {/* Información de la solicitud */}
                <Card>
                  <CardHeader>
                    <h4 className="font-medium text-gray-900">Información de la Solicitud</h4>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Fecha de solicitud</p>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-medium">{formatearFecha(solicitudSeleccionada.fechaSolicitud)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <StatusBadge status={
                        solicitudSeleccionada.estado === 'pendiente' ? 'warning' :
                        solicitudSeleccionada.estado === 'en_revision' ? 'info' :
                        solicitudSeleccionada.estado === 'aprobada' ? 'success' : 'error'
                      }>
                        {solicitudSeleccionada.estado === 'pendiente' ? 'Pendiente' :
                         solicitudSeleccionada.estado === 'en_revision' ? 'En Revisión' :
                         solicitudSeleccionada.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                      </StatusBadge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prioridad</p>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getColorPrioridad(solicitudSeleccionada.prioridad)}`}>
                        {solicitudSeleccionada.prioridad.charAt(0).toUpperCase() + solicitudSeleccionada.prioridad.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Anticonceptivo solicitado</p>
                      <p className="font-medium">{solicitudSeleccionada.anticonceptivoSolicitado}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tiempo restante</p>
                      <p className="font-medium">{getTiempoRestante(solicitudSeleccionada.tiempoLimite)}</p>
                    </div>
                  </CardBody>
                </Card>
              </div>
              
              {/* Cuestionario médico */}
              <Card className="mt-6">
                <CardHeader>
                  <h4 className="font-medium text-gray-900">Cuestionario Médico</h4>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Anticonceptivos actuales</p>
                      <p className="font-medium">{solicitudSeleccionada.cuestionarioMedico.anticonceptivosActuales}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Alergias</p>
                      <p className="font-medium">
                        {solicitudSeleccionada.cuestionarioMedico.alergias.length > 0 
                          ? solicitudSeleccionada.cuestionarioMedico.alergias.join(', ')
                          : 'Ninguna'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Medicamentos</p>
                      <p className="font-medium">
                        {solicitudSeleccionada.cuestionarioMedico.medicamentos.length > 0 
                          ? solicitudSeleccionada.cuestionarioMedico.medicamentos.join(', ')
                          : 'Ninguno'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fumadora</p>
                      <p className="font-medium">{solicitudSeleccionada.cuestionarioMedico.fumadora ? 'Sí' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Consumo de alcohol</p>
                      <p className="font-medium">{solicitudSeleccionada.cuestionarioMedico.alcohol}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ejercicio</p>
                      <p className="font-medium">{solicitudSeleccionada.cuestionarioMedico.ejercicio}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ciclo menstrual</p>
                      <p className="font-medium">{solicitudSeleccionada.cuestionarioMedico.cicloMenstrual}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Embarazo/Lactancia</p>
                      <p className="font-medium">
                        {solicitudSeleccionada.cuestionarioMedico.embarazo ? 'Embarazo' : 
                         solicitudSeleccionada.cuestionarioMedico.lactancia ? 'Lactancia' : 'No'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Condiciones médicas */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Condiciones médicas</p>
                    <div className="flex flex-wrap gap-2">
                      {solicitudSeleccionada.cuestionarioMedico.antecedentesCardiovasculares && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Cardiovasculares
                        </span>
                      )}
                      {solicitudSeleccionada.cuestionarioMedico.diabetes && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                          Diabetes
                        </span>
                      )}
                      {solicitudSeleccionada.cuestionarioMedico.cancer && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          Cáncer
                        </span>
                      )}
                      {solicitudSeleccionada.cuestionarioMedico.migranas && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Migrañas
                        </span>
                      )}
                      {!solicitudSeleccionada.cuestionarioMedico.antecedentesCardiovasculares && 
                       !solicitudSeleccionada.cuestionarioMedico.diabetes && 
                       !solicitudSeleccionada.cuestionarioMedico.cancer && 
                       !solicitudSeleccionada.cuestionarioMedico.migranas && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Sin condiciones médicas reportadas
                        </span>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              {/* Acciones */}
              {(solicitudSeleccionada.estado === 'pendiente' || solicitudSeleccionada.estado === 'en_revision') && (
                <div className="mt-6 flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => manejarAccion(solicitudSeleccionada.id, 'rechazar')}
                    disabled={procesando}
                    className="border-red-600 text-red-600 hover:bg-red-600 focus:ring-red-500"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar Solicitud
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => manejarAccion(solicitudSeleccionada.id, 'aprobar')}
                    disabled={procesando}
                    className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar y Generar Receta
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}; 