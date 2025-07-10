import { z } from 'zod';

// Validación RUT chileno
export const validarRut = (rut: string): boolean => {
  // Limpiar el RUT de puntos y guión
  const rutLimpio = rut.replace(/[.-]/g, '');
  
  if (rutLimpio.length < 8 || rutLimpio.length > 9) {
    return false;
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toLowerCase();

  // Verificar que el cuerpo sea numérico
  if (!/^\d+$/.test(cuerpo)) {
    return false;
  }

  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();

  return dv === dvCalculado;
};

// Formatear RUT con puntos y guión
export const formatearRut = (rut: string): string => {
  const rutLimpio = rut.replace(/[.-]/g, '');
  
  if (rutLimpio.length < 2) return rutLimpio;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  
  // Agregar puntos cada 3 dígitos desde la derecha
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${cuerpoFormateado}-${dv}`;
};

// Validación de teléfono chileno
export const validarTelefono = (telefono: string): boolean => {
  const telefonoLimpio = telefono.replace(/[\s\-+]/g, '');
  // Formato: +56 9 xxxx xxxx o 569xxxxxxxx
  return /^(\+?56)?9\d{8}$/.test(telefonoLimpio);
};

// Formatear teléfono
export const formatearTelefono = (telefono: string): string => {
  const telefonoLimpio = telefono.replace(/[\s\-+]/g, '');
  
  if (telefonoLimpio.startsWith('569')) {
    const numero = telefonoLimpio.slice(3);
    return `+56 9 ${numero.slice(0, 4)} ${numero.slice(4)}`;
  }
  
  if (telefonoLimpio.startsWith('9') && telefonoLimpio.length === 9) {
    return `+56 9 ${telefonoLimpio.slice(1, 5)} ${telefonoLimpio.slice(5)}`;
  }
  
  return telefono;
};

// Esquemas de validación con Zod
export const registroSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  
  apellido: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
  
  rut: z.string()
    .refine(validarRut, 'RUT inválido'),
  
  fechaNacimiento: z.date()
    .refine((fecha) => {
      const edad = new Date().getFullYear() - fecha.getFullYear();
      return edad >= 18;
    }, 'Debes ser mayor de 18 años'),
  
  telefono: z.string()
    .refine(validarTelefono, 'Formato de teléfono inválido'),
  
  email: z.string()
    .email('Email inválido'),
  
  direccion: z.object({
    calle: z.string().min(1, 'La calle es requerida'),
    numero: z.string().min(1, 'El número es requerido'),
    comuna: z.string().min(1, 'La comuna es requerida'),
    ciudad: z.string().min(1, 'La ciudad es requerida')
  }),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

export const cuestionarioSchema = z.object({
  usaAnticonceptivos: z.boolean(),
  marcaActual: z.string().optional(),
  tieneAlergias: z.boolean(),
  detalleAlergias: z.string().optional(),
  fuma: z.boolean(),
  cigarrillosDiarios: z.number().optional(),
  presionAlta: z.boolean(),
  antecedentesTrambosis: z.boolean(),
  estaEmbarazada: z.boolean(),
  amamantando: z.boolean(),
  otrosMedicamentos: z.boolean(),
  detalleOtrosMedicamentos: z.string().optional()
}).refine((data) => {
  // Si usa anticonceptivos, debe especificar la marca
  if (data.usaAnticonceptivos && !data.marcaActual) {
    return false;
  }
  // Si tiene alergias, debe especificar cuáles
  if (data.tieneAlergias && !data.detalleAlergias) {
    return false;
  }
  // Si fuma, debe especificar cantidad
  if (data.fuma && !data.cigarrillosDiarios) {
    return false;
  }
  // Si toma otros medicamentos, debe especificar cuáles
  if (data.otrosMedicamentos && !data.detalleOtrosMedicamentos) {
    return false;
  }
  return true;
}, {
  message: "Faltan campos obligatorios según las respuestas"
}); 