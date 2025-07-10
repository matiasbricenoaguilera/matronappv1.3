import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthUser, LoginData, RegistroData, ApiResponse } from '../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegistroData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si hay un usuario guardado en localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('matronapp_user');
    const savedToken = localStorage.getItem('matronapp_token');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: { ...user, token: savedToken } });
      } catch (error) {
        // Si hay error al parsear, limpiar el localStorage
        localStorage.removeItem('matronapp_user');
        localStorage.removeItem('matronapp_token');
      }
    }
  }, []);

  const login = async (loginData: LoginData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login - en una app real esto sería una llamada a la API
      if (loginData.email === 'maria@email.com' && loginData.password === 'password123') {
        const user: AuthUser = {
          id: 1,
          nombre: 'María José',
          apellido: 'González',
          email: loginData.email,
          fechaRegistro: new Date('2024-01-15'),
          tipo: 'paciente',
          token: 'mock-jwt-token-123'
        };
        
        // Guardar en localStorage
        localStorage.setItem('matronapp_user', JSON.stringify({
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          tipo: user.tipo
        }));
        localStorage.setItem('matronapp_token', user.token!);
        
        dispatch({ type: 'SET_USER', payload: user });
        return true;
      } else if (loginData.email === 'patricia.morales@matronapp.cl' && loginData.password === 'matrona123') {
        // Login de matrona
        const user: AuthUser = {
          id: 100,
          nombre: 'Patricia',
          apellido: 'Morales',
          email: loginData.email,
          fechaRegistro: new Date('2024-01-10'),
          tipo: 'matrona',
          token: 'mock-jwt-token-matrona-123'
        };
        
        localStorage.setItem('matronapp_user', JSON.stringify({
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          tipo: user.tipo
        }));
        localStorage.setItem('matronapp_token', user.token!);
        
        dispatch({ type: 'SET_USER', payload: user });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Email o contraseña incorrectos' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al iniciar sesión' });
      return false;
    }
  };

  const register = async (registerData: RegistroData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock register - en una app real esto sería una llamada a la API
      const user: AuthUser = {
        id: Date.now(), // ID temporal
        nombre: registerData.nombre,
        apellido: registerData.apellido,
        email: registerData.email,
        fechaRegistro: new Date(),
        tipo: 'paciente',
        token: `mock-jwt-token-${Date.now()}`
      };
      
      // Guardar en localStorage
      localStorage.setItem('matronapp_user', JSON.stringify({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        tipo: user.tipo
      }));
      localStorage.setItem('matronapp_token', user.token!);
      
      dispatch({ type: 'SET_USER', payload: user });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al registrar usuario' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('matronapp_user');
    localStorage.removeItem('matronapp_token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext; 