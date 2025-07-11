import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, RegistroData, LoginData } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegistroData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('matronapp_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('matronapp_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de registro
  const register = async (data: RegistroData): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificar si el email ya está registrado (simulado)
      const existingUsers = JSON.parse(localStorage.getItem('matronapp_users') || '[]');
      const emailExists = existingUsers.some((u: any) => u.email === data.email);
      
      if (emailExists) {
        throw new Error('Este email ya está registrado');
      }

      // Crear nuevo usuario
      const newUser: AuthUser = {
        id: Date.now(), // ID temporal
        nombre: data.nombre,
        apellido: data.apellido,
        rut: data.rut,
        email: data.email,
        telefono: data.telefono,
        fechaRegistro: new Date(),
        perfilCompleto: false // Aún falta el cuestionario médico
      };

      // Guardar en localStorage (simulando backend)
      const allUsers = [...existingUsers, { ...data, id: newUser.id }];
      localStorage.setItem('matronapp_users', JSON.stringify(allUsers));
      localStorage.setItem('matronapp_user', JSON.stringify(newUser));
      
      setUser(newUser);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de login
  const login = async (data: LoginData): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuario en localStorage (simulando backend)
      const existingUsers = JSON.parse(localStorage.getItem('matronapp_users') || '[]');
      const foundUser = existingUsers.find((u: any) => 
        u.email === data.email && u.password === data.password
      );
      
      if (!foundUser) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Crear sesión de usuario
      const authUser: AuthUser = {
        id: foundUser.id,
        nombre: foundUser.nombre,
        apellido: foundUser.apellido,
        rut: foundUser.rut,
        email: foundUser.email,
        telefono: foundUser.telefono,
        fechaRegistro: new Date(foundUser.fechaRegistro || Date.now()),
        perfilCompleto: foundUser.perfilCompleto || false
      };

      localStorage.setItem('matronapp_user', JSON.stringify(authUser));
      setUser(authUser);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('matronapp_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 