export interface RegistroData {
  nombre: string;
  apellido: string;
  rut: string;
  fechaNacimiento: Date;
  telefono: string;
  email: string;
  direccion: {
    calle: string;
    numero: string;
    comuna: string;
    ciudad: string;
  };
  password: string;
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  fechaNacimiento: Date;
  telefono: string;
  email: string;
  direccion: {
    calle: string;
    numero: string;
    comuna: string;
    ciudad: string;
  };
  fechaRegistro: Date;
  estado: 'activo' | 'inactivo' | 'pendiente';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaRegistro: Date;
  perfilCompleto?: boolean;
  tipo?: 'paciente' | 'matrona';
  token?: string;
} 