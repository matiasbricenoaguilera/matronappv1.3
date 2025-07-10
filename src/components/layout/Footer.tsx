import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MatronApp</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Conectamos mujeres con matronas certificadas para obtener recetas anticonceptivas 
              de forma rápida, segura y conveniente.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/matronapp" 
                className="text-gray-400 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/matronapp" 
                className="text-gray-400 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/matronapp" 
                className="text-gray-400 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/receta-anticonceptivos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Receta Anticonceptivos
                </Link>
              </li>
              <li>
                <Link to="/consulta-online" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Consulta Online
                </Link>
              </li>
              <li>
                <Link to="/seguimiento" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Seguimiento Médico
                </Link>
              </li>
              <li>
                <Link to="/renovacion-receta" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Renovación de Receta
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/como-funciona" className="text-gray-400 hover:text-white transition-colors text-sm">
                  ¿Cómo funciona?
                </Link>
              </li>
              <li>
                <Link to="/preguntas-frecuentes" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/soporte" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Soporte Técnico
                </Link>
              </li>
              <li>
                <Link to="/centro-ayuda" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Centro de Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm">+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm">hola@matronapp.cl</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Av. Providencia 1234<br />
                  Providencia, Santiago<br />
                  Chile
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
              <p className="text-red-300 text-xs font-medium mb-1">
                Emergencias Médicas
              </p>
              <p className="text-red-200 text-sm">
                Para emergencias, contacta directamente al 131 (SAMU)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-start items-center space-x-6 text-sm">
              <Link to="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link to="/terminos" className="text-gray-400 hover:text-white transition-colors">
                Términos de Uso
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
              <Link to="/legal" className="text-gray-400 hover:text-white transition-colors">
                Aviso Legal
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {currentYear} MatronApp. Todos los derechos reservados.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Servicio médico certificado en Chile
              </p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="border-t border-gray-800 py-4">
          <div className="text-center">
            <p className="text-gray-500 text-xs leading-relaxed">
              <strong>Aviso Médico:</strong> MatronApp conecta usuarias con matronas certificadas. 
              Este servicio no reemplaza consultas médicas presenciales en casos complejos. 
              Consulta siempre con un profesional de la salud ante dudas específicas.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 