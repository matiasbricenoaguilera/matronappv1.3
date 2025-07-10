import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, AlertTriangle, Cigarette, Pill, Baby, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { CuestionarioMedico } from '../../types';

// Schema de validación con Zod
const cuestionarioSchema = z.object({
  usaAnticonceptivos: z.boolean(),
  marcaActual: z.string().optional(),
  tieneAlergias: z.boolean(),
  detalleAlergias: z.string().optional(),
  fuma: z.boolean(),
  cigarrillosDiarios: z.number().min(0).max(100).optional(),
  presionAlta: z.boolean(),
  antecedentesTrambosis: z.boolean(),
  estaEmbarazada: z.boolean(),
  amamantando: z.boolean(),
  otrosMedicamentos: z.boolean(),
  detalleOtrosMedicamentos: z.string().optional()
}).refine((data) => {
  if (data.usaAnticonceptivos && !data.marcaActual) {
    return false;
  }
  if (data.tieneAlergias && !data.detalleAlergias) {
    return false;
  }
  if (data.fuma && !data.cigarrillosDiarios) {
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

type CuestionarioFormData = z.infer<typeof cuestionarioSchema>;

interface CuestionarioMedicoFormProps {
  onSubmit: (data: CuestionarioMedico) => void | Promise<void>;
  isLoading?: boolean;
}

export const CuestionarioMedicoForm: React.FC<CuestionarioMedicoFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<CuestionarioFormData>({
    resolver: zodResolver(cuestionarioSchema),
    mode: 'onChange',
    defaultValues: {
      usaAnticonceptivos: false,
      tieneAlergias: false,
      fuma: false,
      presionAlta: false,
      antecedentesTrambosis: false,
      estaEmbarazada: false,
      amamantando: false,
      otrosMedicamentos: false
    }
  });

  const watchedValues = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Introducción */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Cuestionario Médico
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Responde estas preguntas para que nuestra matrona pueda evaluar la mejor opción anticonceptiva para ti. 
          Toda la información es confidencial y segura.
        </p>
      </div>

      {/* Anticonceptivos Actuales */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Pill className="w-6 h-6 text-primary mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Anticonceptivos Actuales</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('usaAnticonceptivos')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-gray-700">Actualmente uso anticonceptivos</span>
            </label>
          </div>

          {watchedValues.usaAnticonceptivos && (
            <Input
              {...register('marcaActual')}
              label="¿Qué marca/tipo de anticonceptivo usas? *"
              placeholder="Ej: Yasmin, Belara, DIU de cobre, etc."
              error={errors.marcaActual?.message}
            />
          )}
        </div>
      </Card>

      {/* Alergias */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Alergias y Medicamentos</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('tieneAlergias')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-gray-700">Tengo alergias a medicamentos o sustancias</span>
            </label>
          </div>

          {watchedValues.tieneAlergias && (
            <div className="pl-6">
              <Input
                {...register('detalleAlergias')}
                label="Describe tus alergias *"
                placeholder="Ej: Alergia a la penicilina, látex, etc."
                error={errors.detalleAlergias?.message}
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('otrosMedicamentos')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-gray-700">Tomo otros medicamentos regularmente</span>
            </label>
          </div>

          {watchedValues.otrosMedicamentos && (
            <div className="pl-6">
              <Input
                {...register('detalleOtrosMedicamentos')}
                label="¿Qué medicamentos tomas? *"
                placeholder="Ej: Antidepresivos, anticoagulantes, etc."
                error={errors.detalleOtrosMedicamentos?.message}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Hábitos */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Cigarette className="w-6 h-6 text-red-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Hábitos de Vida</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('fuma')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-gray-700">Fumo cigarrillos</span>
            </label>
          </div>

          {watchedValues.fuma && (
            <div className="pl-6">
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
      </Card>

      {/* Condiciones Médicas */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Heart className="w-6 h-6 text-red-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Condiciones Médicas</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('presionAlta')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-gray-700">Tengo presión arterial alta</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('antecedentesTrambosis')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-gray-700">Antecedentes de trombosis</span>
            </label>
          </div>

          {(watchedValues.presionAlta || watchedValues.antecedentesTrambosis) && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Estas condiciones requieren evaluación especial. 
                    La matrona revisará cuidadosamente tu caso antes de recomendar un anticonceptivo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Estado Reproductivo */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Baby className="w-6 h-6 text-pink-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Estado Reproductivo</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('estaEmbarazada')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-gray-700">Estoy embarazada</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('amamantando')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-gray-700">Estoy amamantando</span>
            </label>
          </div>

          {(watchedValues.estaEmbarazada || watchedValues.amamantando) && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <Baby className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    {watchedValues.estaEmbarazada ? (
                      <>
                        <strong>Embarazo detectado:</strong> Los anticonceptivos hormonales no son 
                        necesarios durante el embarazo. Te contactaremos para orientarte.
                      </>
                    ) : (
                      <>
                        <strong>Lactancia materna:</strong> Consideraremos anticonceptivos compatibles 
                        con la lactancia que no afecten la producción de leche.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Aviso Médico */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-start">
          <FileText className="w-6 h-6 text-gray-500 mr-3 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Aviso Médico Importante</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Esta información será revisada por una matrona certificada. Si tienes alguna 
              condición médica grave o tomas medicamentos específicos, te recomendamos consultar 
              presencialmente con un profesional de la salud antes de iniciar cualquier método anticonceptivo.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => window.history.back()}
        >
          Volver
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          loading={isLoading}
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Enviando...' : 'Continuar con el Pago'}
          <Heart className="w-5 h-5 ml-2" />
        </Button>
      </div>


    </form>
  );
}; 