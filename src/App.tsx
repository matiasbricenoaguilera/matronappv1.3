import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { CuestionarioPage } from './pages/CuestionarioPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="App">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Páginas informativas */}
              <Route path="/como-funciona" element={<div>Página en construcción</div>} />
              <Route path="/precios" element={<div>Página en construcción</div>} />
              <Route path="/matronas" element={<div>Página en construcción</div>} />
              <Route path="/contacto" element={<div>Página en construcción</div>} />
              
              {/* Autenticación */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegistroPage />} />
              
              {/* Cuestionario Médico */}
              <Route path="/cuestionario" element={<CuestionarioPage />} />
              
              {/* Dashboard Usuario */}
              <Route path="/dashboard" element={<div>Dashboard en construcción</div>} />
              <Route path="/nueva-receta" element={<div>Nueva receta en construcción</div>} />
              <Route path="/historial" element={<div>Historial en construcción</div>} />
              
              {/* Panel Matrona */}
              <Route path="/matrona/dashboard" element={<div>Panel matrona en construcción</div>} />
              <Route path="/matrona/solicitudes" element={<div>Solicitudes en construcción</div>} />
              
              {/* Páginas legales */}
              <Route path="/privacidad" element={<div>Privacidad en construcción</div>} />
              <Route path="/terminos" element={<div>Términos en construcción</div>} />
              <Route path="/cookies" element={<div>Cookies en construcción</div>} />
              <Route path="/legal" element={<div>Legal en construcción</div>} />
              
              {/* 404 */}
              <Route path="*" element={<div>Página no encontrada</div>} />
            </Routes>
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
