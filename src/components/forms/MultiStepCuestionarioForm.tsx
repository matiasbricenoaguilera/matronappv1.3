import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Heart, 
  AlertTriangle, 
  Cigarette, 
  Pill, 
  Baby, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Activity
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { CuestionarioMedico } from '../../types';

// Schemas para cada paso
const step1Schema = z.object({
  usaAnticonceptivos: z.boolean(),
  marcaActual: z.string().optional(),
  tiempoUso: z.string().optional(),
  motivoCambio: z.string().optional()
}).refine((data) => {
  if (data.usaAnticonceptivos && (!data.marcaActual || !data.tiempoUso)) {
    return false;
  }
  return true;
}, {
  message: "Completa todos los campos requeridos",
  path: ["general"]
});

const step2Schema = z.object({
  tieneAlergias: z.boolean(),
  detalleAlergias: z.string().optional(),
  otrosMedicamentos: z.boolean(),
  detalleOtrosMedicamentos: z.string().optional()
}).refine((data) => {
  if (data.tieneAlergias && !data.detalleAlergias) {
    return false;
  }
  if (data.otrosMedicamentos && !data.detalleOtrosMedicamentos) {
    return false;
  }
  return true;
}, {
  message: "Completa todos los campos requeridos",
  path: ["general"]
});

const step3Schema = z.object({
  fuma: z.boolean(),
  cigarrillosDiarios: z.number().min(0).max(100).optional(),
  bebeAlcohol: z.boolean(),
  frecuenciaAlcohol: z.string().optional(),
  haceEjercicio: z.boolean(),
  frecuenciaEjercicio: z.string().optional()
}).refine((data) => {
  if (data.fuma && !data.cigarrillosDiarios) {
    return false;
  }
  if (data.bebeAlcohol && !data.frecuenciaAlcohol) {
    return false;
  }
  if (data.haceEjercicio && !data.frecuenciaEjercicio) {
    return false;
  }
  return true;
}, {
  message: "Completa todos los campos requeridos",
  path: ["general"]
});

const step4Schema = z.object({
  presionAlta: z.boolean(),
  diabetes: z.boolean(),
  antecedentesTrambosis: z.boolean(),
  enfermedadCardiaca: z.boolean(),
  cancer: z.boolean(),
  detalleCancer: z.string().optional(),
  migranas: z.boolean(),
  detalleMigranas: z.string().optional()
}).refine((data) => {
  if (data.cancer && !data.detalleCancer) {
    return false;
  }
  if (data.migranas && !data.detalleMigranas) {
    return false;
  }
  return true;
}, {
  message: "Completa todos los campos requeridos",
  path: ["general"]
});

const step5Schema = z.object({
  estaEmbarazada: z.boolean(),
  amamantando: z.boolean(),
  ultimaRegla: z.string().optional(),
  cicloRegular: z.boolean(),
  embarazosAnteriores: z.number().min(0).max(20),
  problemasFertilidad: z.boolean(),
  detalleProblemasFertilidad: z.string().optional()
}).refine((data) => {
  if (data.problemasFertilidad && !data.detalleProblemasFertilidad) {
    return false;
  }
  return true;
}, {
  message: "Completa todos los campos requeridos",
  path: ["general"]
});

// Schema completo
const cuestionarioCompletoSchema = z.object({
  // Paso 1
  usaAnticonceptivos: z.boolean(),
  marcaActual: z.string().optional(),
  tiempoUso: z.string().optional(),
  motivoCambio: z.string().optional(),
  
  // Paso 2
  tieneAlergias: z.boolean(),
  detalleAlergias: z.string().optional(),
  otrosMedicamentos: z.boolean(),
  detalleOtrosMedicamentos: z.string().optional(),
  
  // Paso 3
  fuma: z.boolean(),
  cigarrillosDiarios: z.number().optional(),
  bebeAlcohol: z.boolean(),
  frecuenciaAlcohol: z.string().optional(),
  haceEjercicio: z.boolean(),
  frecuenciaEjercicio: z.string().optional(),
  
  // Paso 4
  presionAlta: z.boolean(),
  diabetes: z.boolean(),
  antecedentesTrambosis: z.boolean(),
  enfermedadCardiaca: z.boolean(),
  cancer: z.boolean(),
  detalleCancer: z.string().optional(),
  migranas: z.boolean(),
  detalleMigranas: z.string().optional(),
  
  // Paso 5
  estaEmbarazada: z.boolean(),
  amamantando: z.boolean(),
  ultimaRegla: z.string().optional(),
  cicloRegular: z.boolean(),
  embarazosAnteriores: z.number(),
  problemasFertilidad: z.boolean(),
  detalleProblemasFertilidad: z.string().optional()
});

type CuestionarioFormData = z.infer<typeof cuestionarioCompletoSchema>;

interface MultiStepCuestionarioFormProps {
  onSubmit: (data: CuestionarioMedico) => void | Promise<void>;
  isLoading?: boolean;
  esRenovacion?: boolean;
  recetaAnterior?: any;
}

export const MultiStepCuestionarioForm: React.FC<MultiStepCuestionarioFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  esRenovacion = false,
  recetaAnterior 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Valores por defecto para renovación
  const getDefaultValues = () => {
    const baseDefaults = {
      usaAnticonceptivos: false,
      tieneAlergias: false,
      fuma: false,
      bebeAlcohol: false,
      haceEjercicio: false,
      presionAlta: false,
      diabetes: false,
      antecedentesTrambosis: false,
      enfermedadCardiaca: false,
      cancer: false,
      migranas: false,
      estaEmbarazada: false,
      amamantando: false,
      cicloRegular: false,
      embarazosAnteriores: 0,
      problemasFertilidad: false
    };

    if (esRenovacion && recetaAnterior) {
      return {
        ...baseDefaults,
        usaAnticonceptivos: true,
        marcaActual: recetaAnterior.anticonceptivo,
        tiempoUso: "Más de 6 meses",
        motivoCambio: "Renovación de receta"
      };
    }

    return baseDefaults;
  };

    const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    getValues
  } = useForm<CuestionarioFormData>({
    resolver: zodResolver(cuestionarioCompletoSchema),
    mode: 'onChange',
    defaultValues: getDefaultValues()
  });

  const watchedValues = watch();

  const steps = [
    {
      id: 'anticonceptivos',
      title: 'Anticonceptivos Actuales',
      description: 'Información sobre tu método actual',
      icon: <Pill className="w-5 h-5" />,
      schema: step1Schema
    },
    {
      id: 'alergias',
      title: 'Alergias y Medicamentos',
      description: 'Medicamentos y alergias conocidas',
      icon: <AlertTriangle className="w-5 h-5" />,
      schema: step2Schema
    },
    {
      id: 'habitos',
      title: 'Hábitos de Vida',
      description: 'Tabaco, alcohol y ejercicio',
      icon: <Cigarette className="w-5 h-5" />,
      schema: step3Schema
    },
    {
      id: 'salud',
      title: 'Historial Médico',
      description: 'Condiciones de salud importantes',
      icon: <Activity className="w-5 h-5" />,
      schema: step4Schema
    },
    {
      id: 'reproductiva',
      title: 'Salud Reproductiva',
      description: 'Embarazo, ciclo menstrual',
      icon: <Baby className="w-5 h-5" />,
      schema: step5Schema
    }
  ];

  const validateCurrentStep = async () => {
    const currentStepData = getStepData(currentStep);
    const stepSchema = steps[currentStep].schema;
    
    try {
      stepSchema.parse(currentStepData);
      return true;
    } catch (error) {
      await trigger();
      return false;
    }
  };

  const getStepData = (stepIndex: number) => {
    const allValues = getValues();
    
    switch (stepIndex) {
      case 0:
        return {
          usaAnticonceptivos: allValues.usaAnticonceptivos,
          marcaActual: allValues.marcaActual,
          tiempoUso: allValues.tiempoUso,
          motivoCambio: allValues.motivoCambio
        };
      case 1:
        return {
          tieneAlergias: allValues.tieneAlergias,
          detalleAlergias: allValues.detalleAlergias,
          otrosMedicamentos: allValues.otrosMedicamentos,
          detalleOtrosMedicamentos: allValues.detalleOtrosMedicamentos
        };
      case 2:
        return {
          fuma: allValues.fuma,
          cigarrillosDiarios: allValues.cigarrillosDiarios,
          bebeAlcohol: allValues.bebeAlcohol,
          frecuenciaAlcohol: allValues.frecuenciaAlcohol,
          haceEjercicio: allValues.haceEjercicio,
          frecuenciaEjercicio: allValues.frecuenciaEjercicio
        };
      case 3:
        return {
          presionAlta: allValues.presionAlta,
          diabetes: allValues.diabetes,
          antecedentesTrambosis: allValues.antecedentesTrambosis,
          enfermedadCardiaca: allValues.enfermedadCardiaca,
          cancer: allValues.cancer,
          detalleCancer: allValues.detalleCancer,
          migranas: allValues.migranas,
          detalleMigranas: allValues.detalleMigranas
        };
      case 4:
        return {
          estaEmbarazada: allValues.estaEmbarazada,
          amamantando: allValues.amamantando,
          ultimaRegla: allValues.ultimaRegla,
          cicloRegular: allValues.cicloRegular,
          embarazosAnteriores: allValues.embarazosAnteriores,
          problemasFertilidad: allValues.problemasFertilidad,
          detalleProblemasFertilidad: allValues.detalleProblemasFertilidad
        };
      default:
        return {};
    }
  };

  const handleNext = async () => {
    const isStepValid = await validateCurrentStep();
    
    if (isStepValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step1Content register={register} errors={errors} watchedValues={watchedValues} />;
      case 1:
        return <Step2Content register={register} errors={errors} watchedValues={watchedValues} />;
      case 2:
        return <Step3Content register={register} errors={errors} watchedValues={watchedValues} />;
      case 3:
        return <Step4Content register={register} errors={errors} watchedValues={watchedValues} />;
      case 4:
        return <Step5Content register={register} errors={errors} watchedValues={watchedValues} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center cursor-pointer transition-all ${
              index <= currentStep || completedSteps.includes(index)
                ? 'opacity-100' 
                : 'opacity-50'
            }`}
            onClick={() => handleStepClick(index)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              index === currentStep 
                ? 'bg-primary border-primary text-white' 
                : completedSteps.includes(index)
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {completedSteps.includes(index) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-900">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h3>
          <p className="text-gray-600">
            {steps[currentStep].description}
          </p>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? 'Enviando...' : 'Completar Cuestionario'}
              <Heart className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

// Componentes para cada paso
const Step1Content: React.FC<{
  register: any;
  errors: any;
  watchedValues: any;
}> = ({ register, errors, watchedValues }) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('usaAnticonceptivos')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700 font-medium">Actualmente uso anticonceptivos</span>
        </label>
      </div>

      {watchedValues.usaAnticonceptivos && (
        <div className="space-y-4 pl-8 border-l-2 border-primary/20">
          <Input
            {...register('marcaActual')}
            label="¿Qué marca/tipo de anticonceptivo usas? *"
            placeholder="Ej: Yasmin, Belara, DIU de cobre, etc."
            error={errors.marcaActual?.message}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Hace cuánto lo usas? *
              </label>
              <select
                {...register('tiempoUso')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Selecciona...</option>
                <option value="menos-3-meses">Menos de 3 meses</option>
                <option value="3-6-meses">3-6 meses</option>
                <option value="6-12-meses">6-12 meses</option>
                <option value="1-2-anos">1-2 años</option>
                <option value="mas-2-anos">Más de 2 años</option>
              </select>
            </div>
            
            <Input
              {...register('motivoCambio')}
              label="¿Por qué quieres cambiar? (opcional)"
              placeholder="Ej: Efectos secundarios, olvidos..."
              error={errors.motivoCambio?.message}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

const Step2Content: React.FC<{
  register: any;
  errors: any;
  watchedValues: any;
}> = ({ register, errors, watchedValues }) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('tieneAlergias')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700 font-medium">Tengo alergias a medicamentos o sustancias</span>
        </label>
      </div>

      {watchedValues.tieneAlergias && (
        <div className="pl-8 border-l-2 border-yellow-200">
          <Input
            {...register('detalleAlergias')}
            label="Describe tus alergias *"
            placeholder="Ej: Alergia a la penicilina, látex, etc."
            error={errors.detalleAlergias?.message}
          />
        </div>
      )}
    </div>

    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('otrosMedicamentos')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700 font-medium">Tomo otros medicamentos regularmente</span>
        </label>
      </div>

      {watchedValues.otrosMedicamentos && (
        <div className="pl-8 border-l-2 border-blue-200">
          <Input
            {...register('detalleOtrosMedicamentos')}
            label="¿Qué medicamentos tomas? *"
            placeholder="Ej: Antidepresivos, anticoagulantes, etc."
            error={errors.detalleOtrosMedicamentos?.message}
          />
        </div>
      )}
    </div>
  </div>
);

const Step3Content: React.FC<{
  register: any;
  errors: any;
  watchedValues: any;
}> = ({ register, errors, watchedValues }) => (
  <div className="space-y-6">
    {/* Tabaco */}
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('fuma')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700 font-medium">Fumo cigarrillos</span>
        </label>
      </div>

      {watchedValues.fuma && (
        <div className="pl-8 border-l-2 border-red-200">
          <Input
            {...register('cigarrillosDiarios', { valueAsNumber: true })}
            type="number"
            label="¿Cuántos cigarrillos fumas al día? *"
            placeholder="Ej: 5"
            min="1"
            max="100"
            error={errors.cigarrillosDiarios?.message}
          />
        </div>
      )}
    </div>

    {/* Alcohol */}
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('bebeAlcohol')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700 font-medium">Consumo alcohol</span>
        </label>
      </div>

      {watchedValues.bebeAlcohol && (
        <div className="pl-8 border-l-2 border-purple-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Con qué frecuencia? *
            </label>
            <select
              {...register('frecuenciaAlcohol')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Selecciona...</option>
              <option value="ocasional">Ocasional (1-2 veces al mes)</option>
              <option value="moderado">Moderado (1-2 veces por semana)</option>
              <option value="frecuente">Frecuente (3-4 veces por semana)</option>
              <option value="diario">Diario</option>
            </select>
          </div>
        </div>
      )}
    </div>

    {/* Ejercicio */}
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('haceEjercicio')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700 font-medium">Hago ejercicio regularmente</span>
        </label>
      </div>

      {watchedValues.haceEjercicio && (
        <div className="pl-8 border-l-2 border-green-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Con qué frecuencia? *
            </label>
            <select
              {...register('frecuenciaEjercicio')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Selecciona...</option>
              <option value="1-2-semana">1-2 veces por semana</option>
              <option value="3-4-semana">3-4 veces por semana</option>
              <option value="5-6-semana">5-6 veces por semana</option>
              <option value="diario">Diario</option>
            </select>
          </div>
        </div>
      )}
    </div>
  </div>
);

const Step4Content: React.FC<{
  register: any;
  errors: any;
  watchedValues: any;
}> = ({ register, errors, watchedValues }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Condiciones Cardiovasculares</h4>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('presionAlta')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Presión arterial alta</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('antecedentesTrambosis')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Antecedentes de trombosis</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('enfermedadCardiaca')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Enfermedad cardíaca</span>
        </label>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Otras Condiciones</h4>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('diabetes')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Diabetes</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('cancer')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Cáncer (actual o pasado)</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('migranas')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Migrañas frecuentes</span>
        </label>
      </div>
    </div>

    {watchedValues.cancer && (
      <div className="border-l-4 border-red-200 pl-4">
        <Input
          {...register('detalleCancer')}
          label="Detalle del cáncer *"
          placeholder="Ej: Cáncer de mama, hace 3 años..."
          error={errors.detalleCancer?.message}
        />
      </div>
    )}

    {watchedValues.migranas && (
      <div className="border-l-4 border-orange-200 pl-4">
        <Input
          {...register('detalleMigranas')}
          label="Detalle de las migrañas *"
          placeholder="Ej: Con aura, frecuencia semanal..."
          error={errors.detalleMigranas?.message}
        />
      </div>
    )}
  </div>
);

const Step5Content: React.FC<{
  register: any;
  errors: any;
  watchedValues: any;
}> = ({ register, errors, watchedValues }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Estado Actual</h4>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('estaEmbarazada')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Estoy embarazada</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('amamantando')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Estoy amamantando</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('cicloRegular')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Tengo ciclo menstrual regular</span>
        </label>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Historial</h4>
        
        <Input
          {...register('embarazosAnteriores', { valueAsNumber: true })}
          type="number"
          label="Número de embarazos anteriores"
          placeholder="0"
          min="0"
          max="20"
          error={errors.embarazosAnteriores?.message}
        />
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            {...register('problemasFertilidad')}
            type="checkbox"
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-gray-700">Problemas de fertilidad</span>
        </label>
      </div>
    </div>

    {!watchedValues.estaEmbarazada && !watchedValues.amamantando && (
      <div className="border-l-4 border-blue-200 pl-4">
        <Input
          {...register('ultimaRegla')}
          type="date"
          label="Fecha de última regla (opcional)"
          error={errors.ultimaRegla?.message}
        />
      </div>
    )}

    {watchedValues.problemasFertilidad && (
      <div className="border-l-4 border-purple-200 pl-4">
        <Input
          {...register('detalleProblemasFertilidad')}
          label="Detalle de problemas de fertilidad *"
          placeholder="Ej: SOP, endometriosis..."
          error={errors.detalleProblemasFertilidad?.message}
        />
      </div>
    )}
  </div>
);

export default MultiStepCuestionarioForm; 