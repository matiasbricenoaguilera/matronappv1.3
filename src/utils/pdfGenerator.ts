import { jsPDF } from 'jspdf';
import { formatearFecha } from './formatters';

export interface RecetaData {
  numeroReceta: string;
  paciente: {
    nombre: string;
    apellido: string;
    rut: string;
    email: string;
    telefono: string;
    edad: number;
    direccion?: string;
  };
  matrona: {
    nombre: string;
    apellido: string;
    rut: string;
    registroProfesional: string;
    email: string;
    telefono: string;
  };
  medicamento: {
    nombre: string;
    concentracion: string;
    forma: string;
    cantidad: string;
    posologia: string;
    duracion: string;
    observaciones?: string;
  };
  fechaEmision: Date;
  fechaVencimiento: Date;
  diagnostico: string;
  indicaciones: string[];
  centroMedico: {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
  };
}

export class RecetaPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private lineHeight: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 20;
    this.currentY = this.margin;
    this.lineHeight = 6;
  }

  public generarRecetaPDF(data: RecetaData): string {
    this.currentY = this.margin;
    
    // Encabezado
    this.dibujarEncabezado(data);
    
    // Información del centro médico
    this.dibujarCentroMedico(data.centroMedico);
    
    // Información del profesional
    this.dibujarProfesional(data.matrona);
    
    // Información del paciente
    this.dibujarPaciente(data.paciente);
    
    // Receta médica
    this.dibujarReceta(data);
    
    // Indicaciones
    this.dibujarIndicaciones(data.indicaciones);
    
    // Pie de página
    this.dibujarPiePagina(data);
    
    // Devolver el PDF como string base64
    return this.doc.output('datauristring');
  }

  private dibujarEncabezado(data: RecetaData): void {
    // Logo o título principal
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECETA MÉDICA DIGITAL', this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 10;

    // Línea divisoria
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 8;

    // Información de la receta
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Receta N°: ${data.numeroReceta}`, this.margin, this.currentY);
    this.doc.text(`Fecha: ${formatearFecha(data.fechaEmision)}`, this.pageWidth - this.margin - 30, this.currentY);
    this.currentY += 8;
  }

  private dibujarCentroMedico(centro: RecetaData['centroMedico']): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CENTRO MÉDICO', this.margin, this.currentY);
    this.currentY += 6;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(centro.nombre, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text(centro.direccion, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text(`Tel: ${centro.telefono} | Email: ${centro.email}`, this.margin, this.currentY);
    this.currentY += 10;
  }

  private dibujarProfesional(matrona: RecetaData['matrona']): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PROFESIONAL TRATANTE', this.margin, this.currentY);
    this.currentY += 6;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Nombre: ${matrona.nombre} ${matrona.apellido}`, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text(`RUT: ${matrona.rut}`, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text(`Registro Profesional: ${matrona.registroProfesional}`, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text(`Contacto: ${matrona.telefono} | ${matrona.email}`, this.margin, this.currentY);
    this.currentY += 10;
  }

  private dibujarPaciente(paciente: RecetaData['paciente']): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DATOS DEL PACIENTE', this.margin, this.currentY);
    this.currentY += 6;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Nombre: ${paciente.nombre} ${paciente.apellido}`, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text(`RUT: ${paciente.rut}`, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text(`Edad: ${paciente.edad} años`, this.margin, this.currentY);
    this.currentY += 4;
    
    if (paciente.direccion) {
      this.doc.text(`Dirección: ${paciente.direccion}`, this.margin, this.currentY);
      this.currentY += 4;
    }
    
    this.doc.text(`Contacto: ${paciente.telefono} | ${paciente.email}`, this.margin, this.currentY);
    this.currentY += 10;
  }

  private dibujarReceta(data: RecetaData): void {
    // Título de la receta
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PRESCRIPCIÓN MÉDICA', this.margin, this.currentY);
    this.currentY += 8;

    // Diagnóstico
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Diagnóstico:', this.margin, this.currentY);
    this.currentY += 4;
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(data.diagnostico, this.margin + 5, this.currentY);
    this.currentY += 8;

    // Medicamento
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Medicamento prescrito:', this.margin, this.currentY);
    this.currentY += 6;

    // Recuadro para el medicamento
    const recuadroY = this.currentY;
    const recuadroHeight = 35;
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, recuadroY, this.pageWidth - 2 * this.margin, recuadroHeight);
    
    this.currentY += 4;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.text(data.medicamento.nombre, this.margin + 5, this.currentY);
    this.currentY += 5;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.text(`Concentración: ${data.medicamento.concentracion}`, this.margin + 5, this.currentY);
    this.currentY += 4;
    this.doc.text(`Forma farmacéutica: ${data.medicamento.forma}`, this.margin + 5, this.currentY);
    this.currentY += 4;
    this.doc.text(`Cantidad: ${data.medicamento.cantidad}`, this.margin + 5, this.currentY);
    this.currentY += 4;
    this.doc.text(`Posología: ${data.medicamento.posologia}`, this.margin + 5, this.currentY);
    this.currentY += 4;
    this.doc.text(`Duración del tratamiento: ${data.medicamento.duracion}`, this.margin + 5, this.currentY);
    
    this.currentY = recuadroY + recuadroHeight + 8;

    // Observaciones del medicamento
    if (data.medicamento.observaciones) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Observaciones:', this.margin, this.currentY);
      this.currentY += 4;
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(data.medicamento.observaciones, this.margin + 5, this.currentY);
      this.currentY += 8;
    }
  }

  private dibujarIndicaciones(indicaciones: string[]): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('INDICACIONES GENERALES', this.margin, this.currentY);
    this.currentY += 8;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    indicaciones.forEach((indicacion, index) => {
      this.doc.text(`${index + 1}. ${indicacion}`, this.margin, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 5;
  }

  private dibujarPiePagina(data: RecetaData): void {
    // Información de validez
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('VALIDEZ DE LA RECETA', this.margin, this.currentY);
    this.currentY += 4;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Válida hasta: ${formatearFecha(data.fechaVencimiento)}`, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text('Esta receta es válida por 30 días desde su emisión.', this.margin, this.currentY);
    this.currentY += 8;

    // Firma digital
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FIRMA DIGITAL', this.margin, this.currentY);
    this.currentY += 4;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Firmado digitalmente por: ${data.matrona.nombre} ${data.matrona.apellido}`, this.margin, this.currentY);
    this.currentY += 4;
    this.doc.text(`Fecha y hora: ${formatearFecha(data.fechaEmision)}`, this.margin, this.currentY);
    this.currentY += 8;

    // Información adicional
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Esta receta fue generada digitalmente por MatronApp - Recetas anticonceptivas en 5 minutos', 
      this.pageWidth / 2, this.pageHeight - 15, { align: 'center' });
    this.doc.text('Para verificar la autenticidad, visite: www.matronapp.cl/verificar', 
      this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
  }
}

// Función helper para generar receta rápida
export const generarRecetaPDF = (data: RecetaData): string => {
  const generator = new RecetaPDFGenerator();
  return generator.generarRecetaPDF(data);
};

// Función para descargar PDF
export const descargarRecetaPDF = (data: RecetaData, nombreArchivo?: string): void => {
  const generator = new RecetaPDFGenerator();
  const pdfDataUri = generator.generarRecetaPDF(data);
  
  // Crear enlace de descarga
  const link = document.createElement('a');
  link.href = pdfDataUri;
  link.download = nombreArchivo || `receta_${data.numeroReceta}_${data.paciente.rut}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Datos de ejemplo para testing
export const datosRecetaEjemplo: RecetaData = {
  numeroReceta: 'REC-2024-001',
  paciente: {
    nombre: 'María José',
    apellido: 'González',
    rut: '12345678-9',
    email: 'maria@email.com',
    telefono: '+56 9 8765 4321',
    edad: 28,
    direccion: 'Av. Providencia 123, Santiago'
  },
  matrona: {
    nombre: 'Patricia',
    apellido: 'Morales',
    rut: '98765432-1',
    registroProfesional: 'MAT-2024-456',
    email: 'patricia.morales@matronapp.cl',
    telefono: '+56 9 1234 5678'
  },
  medicamento: {
    nombre: 'Yasmin® 21',
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