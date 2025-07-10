import React, { createContext, useContext, useReducer } from 'react';
import { Prescription, CuestionarioMedico } from '../types';

interface AppState {
  currentStep: number;
  cuestionarioData: Partial<CuestionarioMedico>;
  prescriptions: Prescription[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_CUESTIONARIO'; payload: Partial<CuestionarioMedico> }
  | { type: 'CLEAR_CUESTIONARIO' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

interface AppContextType extends AppState {
  setCurrentStep: (step: number) => void;
  updateCuestionario: (data: Partial<CuestionarioMedico>) => void;
  clearCuestionario: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_CUESTIONARIO':
      return { 
        ...state, 
        cuestionarioData: { ...state.cuestionarioData, ...action.payload }
      };
    case 'CLEAR_CUESTIONARIO':
      return { ...state, cuestionarioData: {} };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState: AppState = {
  currentStep: 0,
  cuestionarioData: {},
  prescriptions: [],
  loading: false,
  error: null
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const updateCuestionario = (data: Partial<CuestionarioMedico>) => {
    dispatch({ type: 'UPDATE_CUESTIONARIO', payload: data });
  };

  const clearCuestionario = () => {
    dispatch({ type: 'CLEAR_CUESTIONARIO' });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AppContextType = {
    ...state,
    setCurrentStep,
    updateCuestionario,
    clearCuestionario,
    setLoading,
    setError,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

export default AppContext; 