import { format, formatDistance, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear precio en pesos chilenos
export const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(precio);
};

// Formatear fecha en formato legible
export const formatearFecha = (fecha: Date | string): string => {
  const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  return format(fechaObj, "d 'de' MMMM 'de' yyyy", { locale: es });
};

// Formatear fecha con hora
export const formatearFechaConHora = (fecha: Date | string): string => {
  const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  return format(fechaObj, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
};

// Tiempo relativo (hace 2 horas, etc.)
export const tiempoRelativo = (fecha: Date | string): string => {
  const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  return formatDistance(fechaObj, new Date(), { 
    addSuffix: true, 
    locale: es 
  });
};

// Formatear número de teléfono para mostrar
export const formatearTelefonoMostrar = (telefono: string): string => {
  const telefonoLimpio = telefono.replace(/[\s\-\+]/g, '');
  
  if (telefonoLimpio.startsWith('569')) {
    const numero = telefonoLimpio.slice(3);
    return `+56 9 ${numero.slice(0, 4)} ${numero.slice(4)}`;
  }
  
  return telefono;
};

// Capitalizar primera letra
export const capitalizar = (texto: string): string => {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

// Obtener iniciales del nombre
export const obtenerIniciales = (nombre: string, apellido: string): string => {
  return `${nombre.charAt(0).toUpperCase()}${apellido.charAt(0).toUpperCase()}`;
};

// Formatear estado de prescripción para mostrar
export const formatearEstadoPrescripcion = (estado: string): { texto: string; color: string } => {
  const estados = {
    'enviada': { texto: 'Enviada', color: 'text-blue-600 bg-blue-100' },
    'asignada': { texto: 'Asignada', color: 'text-yellow-600 bg-yellow-100' },
    'en_revision': { texto: 'En Revisión', color: 'text-orange-600 bg-orange-100' },
    'aprobada': { texto: 'Aprobada', color: 'text-green-600 bg-green-100' },
    'rechazada': { texto: 'Rechazada', color: 'text-red-600 bg-red-100' }
  };
  
  return estados[estado as keyof typeof estados] || { texto: estado, color: 'text-gray-600 bg-gray-100' };
};

// Generar número de receta
export const generarNumeroReceta = (id: number): string => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const idFormateado = id.toString().padStart(4, '0');
  
  return `REC-${año}${mes}-${idFormateado}`;
};

// Validar edad mínima
export const calcularEdad = (fechaNacimiento: Date): number => {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = fechaNacimiento.getMonth();
  
  if (mesNacimiento > mesActual || (mesNacimiento === mesActual && fechaNacimiento.getDate() > hoy.getDate())) {
    edad--;
  }
  
  return edad;
};

// Generar colores para avatar basado en nombre
export const generarColorAvatar = (nombre: string): string => {
  const colores = [
    'bg-pink-500', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-purple-500', 'bg-indigo-500',
    'bg-red-500', 'bg-teal-500'
  ];
  
  const indice = nombre.charCodeAt(0) % colores.length;
  return colores[indice];
}; 