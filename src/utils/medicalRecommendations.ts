import { CuestionarioMedico } from '../types';

export interface MedicalRecommendation {
  anticonceptivoRecomendado: string;
  razon: string;
  contraindicaciones: string[];
  advertencias: string[];
  prioridad: 'alta' | 'media' | 'baja';
  requiereRevisionEspecial: boolean;
  alternativas: string[];
}

export interface MedicalAnalysis {
  esApta: boolean;
  riesgos: string[];
  recomendacion: MedicalRecommendation;
  comentariosMatrona: string;
  tiempoEstimadoRespuesta: string;
}

/**
 * Analiza el cuestionario médico y genera recomendaciones
 */
export const analizarCuestionarioMedico = (cuestionario: CuestionarioMedico): MedicalAnalysis => {
  const riesgos: string[] = [];
  const contraindicaciones: string[] = [];
  const advertencias: string[] = [];
  let requiereRevisionEspecial = false;
  let prioridad: 'alta' | 'media' | 'baja' = 'baja';

  // Análisis de factores de riesgo
  
  // Embarazo y lactancia
  if (cuestionario.estaEmbarazada) {
    return {
      esApta: false,
      riesgos: ['Embarazo confirmado'],
      recomendacion: {
        anticonceptivoRecomendado: 'No aplicable',
        razon: 'No se requieren anticonceptivos durante el embarazo',
        contraindicaciones: ['Embarazo'],
        advertencias: ['Consulta prenatal recomendada'],
        prioridad: 'alta',
        requiereRevisionEspecial: true,
        alternativas: []
      },
      comentariosMatrona: 'La paciente está embarazada. Se sugiere orientación sobre cuidados prenatales.',
      tiempoEstimadoRespuesta: 'Contacto inmediato'
    };
  }

  // Factores de riesgo cardiovascular
  if (cuestionario.presionAlta || cuestionario.antecedentesTrambosis) {
    riesgos.push('Riesgo cardiovascular');
    contraindicaciones.push('Anticonceptivos combinados (estrógeno + progestina)');
    requiereRevisionEspecial = true;
    prioridad = 'alta';
  }

  // Tabaquismo
  if (cuestionario.fuma && cuestionario.cigarrillosDiarios && cuestionario.cigarrillosDiarios > 15) {
    riesgos.push('Tabaquismo intenso');
    contraindicaciones.push('Anticonceptivos combinados');
    advertencias.push('Se recomienda cesación del tabaquismo');
    requiereRevisionEspecial = true;
    prioridad = 'alta';
  } else if (cuestionario.fuma && cuestionario.cigarrillosDiarios && cuestionario.cigarrillosDiarios > 0) {
    riesgos.push('Tabaquismo');
    advertencias.push('Considerar reducir o dejar de fumar');
    prioridad = 'media';
  }

  // Lactancia
  if (cuestionario.amamantando) {
    riesgos.push('Lactancia materna');
    contraindicaciones.push('Anticonceptivos combinados (pueden reducir producción de leche)');
    advertencias.push('Preferir métodos compatibles con lactancia');
    prioridad = 'media';
  }

  // Alergias
  if (cuestionario.tieneAlergias) {
    advertencias.push('Verificar componentes del anticonceptivo por alergias');
    if (cuestionario.detalleAlergias?.toLowerCase().includes('látex')) {
      contraindicaciones.push('Métodos con látex');
    }
  }

  // Medicamentos
  if (cuestionario.otrosMedicamentos) {
    advertencias.push('Verificar interacciones medicamentosas');
    requiereRevisionEspecial = true;
    prioridad = prioridad === 'baja' ? 'media' : prioridad;
  }

  // Generar recomendación basada en el perfil
  const recomendacion = generarRecomendacion(cuestionario, riesgos, contraindicaciones);

  // Determinar si es apta
  const esApta = !cuestionario.estaEmbarazada && riesgos.length < 3;

  // Comentarios de la matrona
  const comentariosMatrona = generarComentariosMatrona(cuestionario, riesgos, requiereRevisionEspecial);

  // Tiempo estimado de respuesta
  const tiempoEstimadoRespuesta = determinarTiempoRespuesta(prioridad, requiereRevisionEspecial);

  return {
    esApta,
    riesgos,
    recomendacion: {
      ...recomendacion,
      contraindicaciones,
      advertencias,
      prioridad,
      requiereRevisionEspecial
    },
    comentariosMatrona,
    tiempoEstimadoRespuesta
  };
};

/**
 * Genera recomendación específica de anticonceptivo
 */
const generarRecomendacion = (
  cuestionario: CuestionarioMedico, 
  riesgos: string[], 
  contraindicaciones: string[]
): Omit<MedicalRecommendation, 'contraindicaciones' | 'advertencias' | 'prioridad' | 'requiereRevisionEspecial'> => {
  
  // Si hay contraindicaciones para combinados
  const evitarCombinados = contraindicaciones.some(c => 
    c.includes('combinados') || c.includes('estrógeno')
  );

  // Si está amamantando
  if (cuestionario.amamantando) {
    return {
      anticonceptivoRecomendado: 'Progestina sola (píldora de lactancia)',
      razon: 'Compatible con lactancia materna, no afecta la producción de leche',
      alternativas: ['DIU de cobre', 'Implante subdérmico', 'Inyección de progestina']
    };
  }

  // Si fuma intensamente o tiene factores cardiovasculares
  if (evitarCombinados) {
    return {
      anticonceptivoRecomendado: 'DIU de cobre',
      razon: 'Método no hormonal, alta eficacia, sin contraindicaciones cardiovasculares',
      alternativas: ['Progestina sola', 'Implante subdérmico', 'Métodos de barrera']
    };
  }

  // Si ya usa anticonceptivos
  if (cuestionario.usaAnticonceptivos && cuestionario.marcaActual) {
    return {
      anticonceptivoRecomendado: cuestionario.marcaActual,
      razon: 'Continuidad con método actual si está funcionando bien',
      alternativas: ['Evaluar cambio según necesidades específicas']
    };
  }

  // Recomendación general para perfil de bajo riesgo
  return {
    anticonceptivoRecomendado: 'Anticonceptivo combinado (píldora)',
    razon: 'Método efectivo, reversible, con beneficios adicionales como regulación del ciclo',
    alternativas: ['Parche anticonceptivo', 'Anillo vaginal', 'DIU hormonal']
  };
};

/**
 * Genera comentarios personalizados de la matrona
 */
const generarComentariosMatrona = (
  cuestionario: CuestionarioMedico, 
  riesgos: string[], 
  requiereRevisionEspecial: boolean
): string => {
  const comentarios: string[] = [];

  if (requiereRevisionEspecial) {
    comentarios.push('Este caso requiere evaluación personalizada por nuestro equipo médico.');
  }

  if (cuestionario.fuma) {
    comentarios.push('Se recomienda encarecidamente considerar programas de cesación del tabaquismo.');
  }

  if (cuestionario.presionAlta || cuestionario.antecedentesTrambosis) {
    comentarios.push('Se priorizarán métodos no hormonales o con baja dosis hormonal por tu historial médico.');
  }

  if (cuestionario.tieneAlergias) {
    comentarios.push('Revisaremos cuidadosamente los componentes del anticonceptivo para evitar reacciones alérgicas.');
  }

  if (cuestionario.amamantando) {
    comentarios.push('Nos aseguraremos de que el método elegido sea completamente compatible con la lactancia.');
  }

  if (riesgos.length === 0) {
    comentarios.push('Tienes un perfil de riesgo bajo, lo que nos da varias opciones anticonceptivas seguras.');
  }

  comentarios.push('Una matrona certificada revisará tu caso y te contactará para confirmar la mejor opción para ti.');

  return comentarios.join(' ');
};

/**
 * Determina el tiempo estimado de respuesta
 */
const determinarTiempoRespuesta = (prioridad: 'alta' | 'media' | 'baja', requiereRevision: boolean): string => {
  if (prioridad === 'alta' || requiereRevision) {
    return '2-3 minutos';
  }
  if (prioridad === 'media') {
    return '3-5 minutos';
  }
  return '5 minutos o menos';
};

/**
 * Obtiene recomendaciones específicas por edad
 */
export const obtenerRecomendacionesPorEdad = (edad: number): string[] => {
  if (edad < 20) {
    return [
      'Considerar métodos reversibles de larga duración',
      'Educación sobre uso correcto y consistente',
      'Seguimiento más frecuente'
    ];
  }
  if (edad > 35) {
    return [
      'Evaluar factores de riesgo cardiovascular',
      'Considerar métodos no hormonales',
      'Monitoreo de presión arterial'
    ];
  }
  return [
    'Múltiples opciones disponibles',
    'Elegir según estilo de vida y preferencias'
  ];
};

/**
 * Calcula score de riesgo general
 */
export const calcularScoreRiesgo = (cuestionario: CuestionarioMedico): number => {
  let score = 0;
  
  if (cuestionario.estaEmbarazada) return 100; // Máximo riesgo
  if (cuestionario.antecedentesTrambosis) score += 30;
  if (cuestionario.presionAlta) score += 20;
  if (cuestionario.fuma && cuestionario.cigarrillosDiarios && cuestionario.cigarrillosDiarios > 15) score += 25;
  if (cuestionario.fuma && cuestionario.cigarrillosDiarios && cuestionario.cigarrillosDiarios > 0) score += 10;
  if (cuestionario.amamantando) score += 5;
  if (cuestionario.tieneAlergias) score += 5;
  if (cuestionario.otrosMedicamentos) score += 10;

  return Math.min(score, 100);
}; 