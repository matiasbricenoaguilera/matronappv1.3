export interface CuestionarioMedico {
  usaAnticonceptivos: boolean;
  marcaActual?: string;
  tieneAlergias: boolean;
  detalleAlergias?: string;
  fuma: boolean;
  cigarrillosDiarios?: number;
  presionAlta: boolean;
  antecedentesTrambosis: boolean;
  estaEmbarazada: boolean;
  amamantando: boolean;
  otrosMedicamentos: boolean;
  detalleOtrosMedicamentos?: string;
}

export interface Prescription {
  id: number;
  usuarioId: number;
  matronaId?: number;
  cuestionarioMedico: CuestionarioMedico;
  estado: 'enviada' | 'asignada' | 'en_revision' | 'aprobada' | 'rechazada';
  fechaSolicitud: Date;
  fechaAsignacion?: Date;
  fechaResolucion?: Date;
  comentarios?: string;
  medicamento?: string;
  dosis?: string;
  instrucciones?: string;
  pdfUrl?: string;
  precio: number;
}

export interface Matrona {
  id: number;
  nombre: string;
  apellido: string;
  titulo: string;
  experiencia: string;
  rating: number;
  disponible: boolean;
  email: string;
  telefono: string;
  especialidades: string[];
} 