export interface PaymentData {
  nombre: string;
  email: string;
  telefono: string;
  tarjeta: {
    numero: string;
    vencimiento: string;
    cvv: string;
    titular: string;
  };
}

export interface Payment {
  id: number;
  prescriptionId: number;
  usuarioId: number;
  monto: number;
  estado: 'pendiente' | 'procesando' | 'completado' | 'fallido' | 'reembolsado';
  metodoPago: 'webpay' | 'transferencia' | 'credito';
  fechaCreacion: Date;
  fechaProceso?: Date;
  transactionId?: string;
  errorMessage?: string;
  datosFacturacion: {
    nombre: string;
    rut: string;
    direccion: string;
    email: string;
  };
}

export interface PaymentSummary {
  subtotal: number;
  impuestos: number;
  total: number;
  descripcion: string;
  servicio: 'receta_anticonceptivos';
} 