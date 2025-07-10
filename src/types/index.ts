export * from './User';
export * from './Prescription';
export * from './Payment';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Comuna {
  codigo: string;
  nombre: string;
  region: string;
}

export interface Notification {
  id: number;
  usuarioId: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  leida: boolean;
  fechaCreacion: Date;
} 