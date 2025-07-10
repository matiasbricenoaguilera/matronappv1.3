import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell, Heart } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const headerClasses = transparent 
    ? 'bg-transparent absolute top-0 left-0 right-0 z-50'
    : 'bg-white shadow-sm border-b border-gray-100';

  const linkClasses = transparent
    ? 'text-white hover:text-gray-200'
    : 'text-gray-700 hover:text-primary';

  return (
    <header className={`w-full transition-all duration-300 ${headerClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${transparent ? 'text-white' : 'text-gray-900'}`}>
              MatronApp
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link to="/como-funciona" className={`font-medium transition-colors ${linkClasses}`}>
                  ¿Cómo funciona?
                </Link>
                <Link to="/precios" className={`font-medium transition-colors ${linkClasses}`}>
                  Precios
                </Link>
                <Link to="/matronas" className={`font-medium transition-colors ${linkClasses}`}>
                  Nuestras Matronas
                </Link>
                <Link to="/contacto" className={`font-medium transition-colors ${linkClasses}`}>
                  Contacto
                </Link>
              </>
            ) : (
              <>
                {user?.tipo === 'paciente' ? (
                  <>
                    <Link to="/dashboard" className={`font-medium transition-colors ${linkClasses}`}>
                      Mi Dashboard
                    </Link>
                    <Link to="/nueva-receta" className={`font-medium transition-colors ${linkClasses}`}>
                      Nueva Receta
                    </Link>
                    <Link to="/historial" className={`font-medium transition-colors ${linkClasses}`}>
                      Historial
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/matrona/dashboard" className={`font-medium transition-colors ${linkClasses}`}>
                      Panel Matrona
                    </Link>
                    <Link to="/matrona/solicitudes" className={`font-medium transition-colors ${linkClasses}`}>
                      Solicitudes
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button variant="primary" size="sm">
                    Obtener Receta
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${transparent ? 'hover:bg-white/10' : ''}`}>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className={`font-medium ${transparent ? 'text-white' : 'text-gray-700'}`}>
                      {user?.nombre}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link to="/perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="w-4 h-4 mr-3" />
                        Mi Perfil
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 rounded-lg transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`py-4 border-t ${transparent ? 'border-white/20' : 'border-gray-200'}`}>
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <Link to="/como-funciona" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                    ¿Cómo funciona?
                  </Link>
                  <Link to="/precios" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                    Precios
                  </Link>
                  <Link to="/matronas" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                    Nuestras Matronas
                  </Link>
                  <Link to="/contacto" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                    Contacto
                  </Link>
                  <div className="pt-4 space-y-2">
                    <Link to="/login" onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/registro" onClick={closeMenu}>
                      <Button variant="primary" size="sm" className="w-full">
                        Obtener Receta
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {user?.tipo === 'paciente' ? (
                    <>
                      <Link to="/dashboard" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                        Mi Dashboard
                      </Link>
                      <Link to="/nueva-receta" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                        Nueva Receta
                      </Link>
                      <Link to="/historial" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                        Historial
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/matrona/dashboard" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                        Panel Matrona
                      </Link>
                      <Link to="/matrona/solicitudes" className={`block font-medium ${linkClasses}`} onClick={closeMenu}>
                        Solicitudes
                      </Link>
                    </>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={handleLogout}
                      className={`flex items-center w-full font-medium ${linkClasses}`}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 