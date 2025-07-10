import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Clock } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  backButtonText = "Volver al inicio",
  backButtonHref = "/"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MatronApp</span>
            </Link>

            {/* Back Button */}
            {showBackButton && (
              <Link 
                to={backButtonHref}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {backButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-primary" />
                <span>5 minutos</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-secondary" />
                <span>100% seguro</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                <span>Miles de usuarias</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 MatronApp. Todos los derechos reservados.
            </div>
            <div className="flex space-x-4 text-sm">
              <Link to="/terminos" className="text-gray-500 hover:text-gray-700">
                Términos
              </Link>
              <Link to="/privacidad" className="text-gray-500 hover:text-gray-700">
                Privacidad
              </Link>
              <Link to="/ayuda" className="text-gray-500 hover:text-gray-700">
                Ayuda
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 