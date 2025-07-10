import { User, Matrona, Prescription, Comuna } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    nombre: "María José",
    apellido: "González",
    rut: "12.345.678-9",
    fechaNacimiento: new Date('1995-03-15'),
    telefono: "+56 9 8765 4321",
    email: "maria@email.com",
    direccion: {
      calle: "Av. Providencia",
      numero: "123",
      comuna: "Providencia",
      ciudad: "Santiago"
    },
    fechaRegistro: new Date('2024-01-15'),
    estado: 'activo'
  },
  {
    id: 2,
    nombre: "Francisca",
    apellido: "López",
    rut: "13.456.789-0",
    fechaNacimiento: new Date('1992-07-22'),
    telefono: "+56 9 7654 3210",
    email: "francisca@email.com",
    direccion: {
      calle: "Las Condes",
      numero: "456",
      comuna: "Las Condes",
      ciudad: "Santiago"
    },
    fechaRegistro: new Date('2024-02-01'),
    estado: 'activo'
  }
];

export const mockMatronas: Matrona[] = [
  {
    id: 1,
    nombre: "Patricia",
    apellido: "Morales",
    titulo: "Matrona UC",
    experiencia: "15 años",
    rating: 4.9,
    disponible: true,
    email: "patricia.morales@matronapp.cl",
    telefono: "+56 9 1234 5678",
    especialidades: ["Anticoncepción", "Salud Sexual", "Planificación Familiar"]
  },
  {
    id: 2,
    nombre: "Carmen",
    apellido: "Rodríguez",
    titulo: "Matrona PUC",
    experiencia: "12 años",
    rating: 4.8,
    disponible: true,
    email: "carmen.rodriguez@matronapp.cl",
    telefono: "+56 9 2345 6789",
    especialidades: ["Anticoncepción", "Cuidados Reproductivos"]
  },
  {
    id: 3,
    nombre: "Soledad",
    apellido: "Vargas",
    titulo: "Matrona U. de Chile",
    experiencia: "8 años",
    rating: 4.7,
    disponible: false,
    email: "soledad.vargas@matronapp.cl",
    telefono: "+56 9 3456 7890",
    especialidades: ["Salud Reproductiva", "Anticoncepción"]
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: 1,
    usuarioId: 1,
    matronaId: 1,
    cuestionarioMedico: {
      usaAnticonceptivos: true,
      marcaActual: "Yasmin",
      tieneAlergias: false,
      fuma: false,
      presionAlta: false,
      antecedentesTrambosis: false,
      estaEmbarazada: false,
      amamantando: false,
      otrosMedicamentos: false
    },
    estado: 'aprobada',
    fechaSolicitud: new Date('2024-01-20'),
    fechaAsignacion: new Date('2024-01-20'),
    fechaResolucion: new Date('2024-01-21'),
    medicamento: "Yasmin",
    dosis: "1 comprimido diario",
    instrucciones: "Tomar 1 comprimido diario a la misma hora durante 21 días, seguido de 7 días de descanso.",
    precio: 4990
  }
];

export const comunasChile: Comuna[] = [
  { codigo: "13101", nombre: "Santiago", region: "Región Metropolitana" },
  { codigo: "13102", nombre: "Cerrillos", region: "Región Metropolitana" },
  { codigo: "13103", nombre: "Cerro Navia", region: "Región Metropolitana" },
  { codigo: "13104", nombre: "Conchalí", region: "Región Metropolitana" },
  { codigo: "13105", nombre: "El Bosque", region: "Región Metropolitana" },
  { codigo: "13106", nombre: "Estación Central", region: "Región Metropolitana" },
  { codigo: "13107", nombre: "Huechuraba", region: "Región Metropolitana" },
  { codigo: "13108", nombre: "Independencia", region: "Región Metropolitana" },
  { codigo: "13109", nombre: "La Cisterna", region: "Región Metropolitana" },
  { codigo: "13110", nombre: "La Florida", region: "Región Metropolitana" },
  { codigo: "13111", nombre: "La Granja", region: "Región Metropolitana" },
  { codigo: "13112", nombre: "La Pintana", region: "Región Metropolitana" },
  { codigo: "13113", nombre: "La Reina", region: "Región Metropolitana" },
  { codigo: "13114", nombre: "Las Condes", region: "Región Metropolitana" },
  { codigo: "13115", nombre: "Lo Barnechea", region: "Región Metropolitana" },
  { codigo: "13116", nombre: "Lo Espejo", region: "Región Metropolitana" },
  { codigo: "13117", nombre: "Lo Prado", region: "Región Metropolitana" },
  { codigo: "13118", nombre: "Macul", region: "Región Metropolitana" },
  { codigo: "13119", nombre: "Maipú", region: "Región Metropolitana" },
  { codigo: "13120", nombre: "Ñuñoa", region: "Región Metropolitana" },
  { codigo: "13121", nombre: "Pedro Aguirre Cerda", region: "Región Metropolitana" },
  { codigo: "13122", nombre: "Peñalolén", region: "Región Metropolitana" },
  { codigo: "13123", nombre: "Providencia", region: "Región Metropolitana" },
  { codigo: "13124", nombre: "Pudahuel", region: "Región Metropolitana" },
  { codigo: "13125", nombre: "Quilicura", region: "Región Metropolitana" },
  { codigo: "13126", nombre: "Quinta Normal", region: "Región Metropolitana" },
  { codigo: "13127", nombre: "Recoleta", region: "Región Metropolitana" },
  { codigo: "13128", nombre: "Renca", region: "Región Metropolitana" },
  { codigo: "13129", nombre: "San Joaquín", region: "Región Metropolitana" },
  { codigo: "13130", nombre: "San Miguel", region: "Región Metropolitana" },
  { codigo: "13131", nombre: "San Ramón", region: "Región Metropolitana" },
  { codigo: "13132", nombre: "Vitacura", region: "Región Metropolitana" },
  { codigo: "05101", nombre: "Valparaíso", region: "Región de Valparaíso" },
  { codigo: "05102", nombre: "Viña del Mar", region: "Región de Valparaíso" },
  { codigo: "08101", nombre: "Concepción", region: "Región del Biobío" },
  { codigo: "09101", nombre: "Temuco", region: "Región de La Araucanía" },
  { codigo: "10101", nombre: "Puerto Montt", region: "Región de Los Lagos" },
  { codigo: "04101", nombre: "La Serena", region: "Región de Coquimbo" },
  { codigo: "02101", nombre: "Antofagasta", region: "Región de Antofagasta" },
  { codigo: "01101", nombre: "Iquique", region: "Región de Tarapacá" }
];

export const testimonios = [
  {
    id: 1,
    nombre: "María José G.",
    edad: 28,
    testimonio: "¡Increíble! Estaba en la farmacia sin receta y en 3 minutos ya la tenía. ¡Recomendado 100%!",
    rating: 5,
    fecha: "Enero 2024"
  },
  {
    id: 2,
    nombre: "Francisca L.",
    edad: 26,
    testimonio: "Me salvó la vida. Necesitaba mi anticonceptivo urgente y la matrona me ayudó al instante.",
    rating: 5,
    fecha: "Febrero 2024"
  },
  {
    id: 3,
    nombre: "Carolina M.",
    edad: 31,
    testimonio: "Súper conveniente. Ya no más esperas en consultorios, obtienes la receta al momento.",
    rating: 4,
    fecha: "Marzo 2024"
  }
]; 