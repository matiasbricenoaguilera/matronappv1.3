import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Shield, 
  Heart, 
  Star,
  DollarSign,
  ArrowRight,
  Phone,
  Calendar,
  Users,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Layout } from '../components/layout';
import { Button, Card } from '../components/ui';
import { testimonios } from '../data/mockData';
import { formatearPrecio } from '../utils/formatters';

export const LandingPage: React.FC = () => {
  const [faqOpen, setFaqOpen] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Cómo funciona el proceso de obtener una receta?",
      answer: "Es muy simple: 1) Te registras en MatronApp, 2) Completas un cuestionario médico, 3) Una matrona certificada revisa tu caso, 4) Recibes tu receta en 5 minutos o menos."
    },
    {
      question: "¿Es seguro obtener recetas anticonceptivas online?",
      answer: "Absolutamente. Todas nuestras matronas están certificadas y registradas en el Colegio de Matronas de Chile. El proceso cumple con todos los estándares médicos y regulaciones chilenas."
    },
    {
      question: "¿Qué anticonceptivos pueden recetar?",
      answer: "Nuestras matronas pueden recetar la mayoría de anticonceptivos orales (píldoras), siempre que sean apropiados para tu perfil médico según el cuestionario."
    },
    {
      question: "¿Qué pasa si mi solicitud es rechazada?",
      answer: "Si tu caso requiere una consulta presencial, te lo notificaremos inmediatamente y te reembolsaremos el 100% del pago. Tu salud es nuestra prioridad."
    },
    {
      question: "¿Puedo renovar mi receta?",
      answer: "¡Sí! Una vez que tengas tu primera receta, las renovaciones son aún más rápidas. Solo necesitas actualizar tu información si ha habido cambios."
    }
  ];

  return (
    <Layout transparentHeader>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Recetas anticonceptivas
                <span className="block text-secondary"> en 5 minutos</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-100 mb-8 leading-relaxed">
                ¿Estás en la farmacia y necesitas tu receta YA? Conectamos con matronas 
                certificadas para obtener recetas al instante.
              </p>

              {/* Price Comparison */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">
                      {formatearPrecio(4990)}
                    </div>
                    <div className="text-sm text-gray-200">MatronApp</div>
                  </div>
                  <div className="text-center opacity-60">
                    <div className="text-3xl font-bold line-through mb-2">
                      {formatearPrecio(25000)}
                    </div>
                    <div className="text-sm text-gray-300">Consulta tradicional</div>
                  </div>
                </div>
                <div className="text-center mt-4 text-secondary font-semibold">
                  ¡Recetas al instante desde la farmacia!
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm">5 minutos o menos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm">100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm">Matronas certificadas</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/registro">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white shadow-xl"
                  >
                    Obtener Receta en 5 Minutos
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/como-funciona">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary"
                  >
                    ¿Cómo funciona?
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="hidden lg:flex justify-center items-center animate-fade-in">
              <div className="relative">
                {/* Main Circle */}
                <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-60 h-60 bg-white/20 rounded-full flex items-center justify-center">
                    <Heart className="w-24 h-24 text-white" />
                  </div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-xl animate-pulse">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-gray-900">5min</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-xl animate-pulse" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-secondary" />
                    <span className="font-semibold text-gray-900">$4.990</span>
                  </div>
                </div>
                
                <div className="absolute top-16 -right-12 bg-white rounded-xl p-4 shadow-xl animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-gray-900">Seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Obtén tu receta anticonceptiva al instante en 4 simples pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Regístrate",
                description: "Crea tu cuenta con tus datos básicos",
                icon: <Users className="w-8 h-8" />
              },
              {
                step: "2", 
                title: "Cuestionario",
                description: "Completa un cuestionario médico seguro",
                icon: <CheckCircle className="w-8 h-8" />
              },
              {
                step: "3",
                title: "Revisión",
                description: "Una matrona certificada revisa tu caso",
                icon: <Award className="w-8 h-8" />
              },
              {
                step: "4",
                title: "Receta lista",
                description: "Recibe tu receta en 5 minutos o menos",
                icon: <Calendar className="w-8 h-8" />
              }
            ].map((item, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestras usuarias
            </h2>
            <p className="text-xl text-gray-600">
              Miles de mujeres ya confían en MatronApp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonios.map((testimonio) => (
              <Card key={testimonio.id} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonio.testimonio}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonio.nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonio.edad} años
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonio.fecha}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos tus dudas más comunes
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {faqOpen === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {faqOpen === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Necesitas tu receta ahora mismo?
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Miles de mujeres ya obtienen sus recetas al instante con MatronApp
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/registro">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-white shadow-xl"
              >
                Comenzar ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-gray-200">
              <Phone className="w-4 h-4" />
              <span className="text-sm">¿Dudas? Llámanos: +56 9 1234 5678</span>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-300">
            ✓ Matronas certificadas • ✓ 100% seguro • ✓ Garantía de satisfacción
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage; 