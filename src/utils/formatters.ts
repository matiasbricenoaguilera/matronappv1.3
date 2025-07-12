import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un precio en pesos chilenos
 */
export const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
};

/**
 * Formatea una fecha de forma legible
 */
export const formatearFecha = (fecha: Date): string => {
  if (isToday(fecha)) {
    return `Hoy ${format(fecha, 'HH:mm', { locale: es })}`;
  }
  
  if (isYesterday(fecha)) {
    return `Ayer ${format(fecha, 'HH:mm', { locale: es })}`;
  }
  
  return format(fecha, 'dd MMM yyyy', { locale: es });
};

/**
 * Formatea una fecha completa
 */
export const formatearFechaCompleta = (fecha: Date): string => {
  return format(fecha, 'dd MMMM yyyy', { locale: es });
};

/**
 * Formatea tiempo transcurrido desde una fecha
 */
export const formatearTiempoTranscurrido = (fecha: Date): string => {
  return formatDistanceToNow(fecha, { 
    addSuffix: true, 
    locale: es 
  });
};

/**
 * Formatea un RUT chileno
 */
export const formatearRut = (rut: string): string => {
  // Eliminar puntos y guiones
  const cleanRut = rut.replace(/[.-]/g, '');
  
  // Agregar puntos y guión
  const rutBody = cleanRut.slice(0, -1);
  const rutDv = cleanRut.slice(-1);
  
  // Agregar puntos cada 3 dígitos
  const formattedBody = rutBody.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  
  return `${formattedBody}-${rutDv}`;
};

/**
 * Formatea un número de teléfono chileno
 */
export const formatearTelefono = (telefono: string): string => {
  // Eliminar espacios y caracteres especiales
  const cleanPhone = telefono.replace(/[\s\-()]/g, '');
  
  // Formato típico chileno: +56 9 XXXX XXXX
  if (cleanPhone.startsWith('+56')) {
    const number = cleanPhone.substring(3);
    if (number.length === 9) {
      return `+56 ${number.substring(0, 1)} ${number.substring(1, 5)} ${number.substring(5)}`;
  }
  }
  
  // Si no tiene formato internacional, asumimos que es nacional
  if (cleanPhone.length === 9) {
    return `+56 ${cleanPhone.substring(0, 1)} ${cleanPhone.substring(1, 5)} ${cleanPhone.substring(5)}`;
  }
  
  return telefono; // Retornar original si no coincide con formatos esperados
};

/**
 * Formatea el nombre completo
 */
export const formatearNombreCompleto = (nombre: string, apellido: string): string => {
  return `${nombre} ${apellido}`;
};

/**
 * Formatea el estado de una prescripción
 */
export const formatearEstadoPrescripcion = (estado: string): { texto: string; color: string } => {
  switch (estado) {
    case 'enviada':
      return { texto: 'Enviada', color: 'bg-blue-100 text-blue-800' };
    case 'asignada':
      return { texto: 'Asignada', color: 'bg-purple-100 text-purple-800' };
    case 'en_revision':
      return { texto: 'En Revisión', color: 'bg-yellow-100 text-yellow-800' };
    case 'aprobada':
      return { texto: 'Aprobada', color: 'bg-green-100 text-green-800' };
    case 'rechazada':
      return { texto: 'Rechazada', color: 'bg-red-100 text-red-800' };
    case 'completada':
      return { texto: 'Completada', color: 'bg-green-100 text-green-800' };
    default:
      return { texto: 'Pendiente', color: 'bg-gray-100 text-gray-800' };
  }
};

/**
 * Formatea un número con separadores de miles
 */
export const formatearNumero = (numero: number): string => {
  return new Intl.NumberFormat('es-CL').format(numero);
};

/**
 * Formatea un porcentaje
 */
export const formatearPorcentaje = (valor: number, decimales = 1): string => {
  return `${valor.toFixed(decimales)}%`;
};

/**
 * Trunca un texto a una longitud específica
 */
export const truncarTexto = (texto: string, longitud: number): string => {
  if (texto.length <= longitud) {
    return texto;
  }
  return `${texto.substring(0, longitud)}...`;
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizarPalabras = (texto: string): string => {
  return texto.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

/**
 * Valida y formatea un email
 */
export const formatearEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Formatea una dirección
 */
export const formatearDireccion = (direccion: {
  calle: string;
  numero: string;
  comuna: string;
  ciudad: string;
}): string => {
  const { calle, numero, comuna, ciudad } = direccion;
  return `${calle} ${numero}, ${comuna}, ${ciudad}`;
};

/**
 * Formatea duración en minutos a texto legible
 */
export const formatearDuracion = (minutos: number): string => {
  if (minutos < 60) {
    return `${minutos} minutos`;
  }
  
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  
  if (minutosRestantes === 0) {
    return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  }
  
  return `${horas} ${horas === 1 ? 'hora' : 'horas'} y ${minutosRestantes} minutos`;
};

/**
 * Formatea un tamaño de archivo
 */
export const formatearTamanoArchivo = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(1)} ${sizes[i]}`;
}; 