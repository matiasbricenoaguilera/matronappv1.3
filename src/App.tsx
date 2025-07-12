import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute, PublicRoute } from './components/auth';
import LandingPage from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { CuestionarioPage } from './pages/CuestionarioPage';
import { RecuperarPasswordPage } from './pages/RecuperarPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { PagoPage } from './pages/PagoPage';
import { PagoExitosoPage } from './pages/PagoExitosoPage';
import { MatronaPanelPage } from './pages/MatronaPanelPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { NuevaRecetaPage } from './pages/NuevaRecetaPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
          <div className="App">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Páginas informativas */}
              <Route path="/como-funciona" element={<div>Página en construcción</div>} />
              <Route path="/precios" element={<div>Página en construcción</div>} />
              <Route path="/matronas" element={<div>Página en construcción</div>} />
              <Route path="/contacto" element={<div>Página en construcción</div>} />
              
                {/* Autenticación - Solo para usuarios no autenticados */}
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/registro" element={
                  <PublicRoute>
                    <RegistroPage />
                  </PublicRoute>
                } />
                <Route path="/recuperar-password" element={
                  <PublicRoute>
                    <RecuperarPasswordPage />
                  </PublicRoute>
                } />
              
                {/* Cuestionario Médico - Requiere autenticación */}
                <Route path="/cuestionario" element={
                  <ProtectedRoute>
                    <CuestionarioPage />
                  </ProtectedRoute>
                } />
                
                {/* Pago - Requiere autenticación */}
                <Route path="/pago" element={
                  <ProtectedRoute>
                    <PagoPage />
                  </ProtectedRoute>
                } />
                <Route path="/pago-exitoso" element={
                  <ProtectedRoute>
                    <PagoExitosoPage />
                  </ProtectedRoute>
                } />
              
                {/* Dashboard Usuario - Requiere autenticación */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/configuracion" element={
                  <ProtectedRoute>
                    <ConfiguracionPage />
                  </ProtectedRoute>
                } />
                <Route path="/nueva-receta" element={
                  <ProtectedRoute>
                    <NuevaRecetaPage />
                  </ProtectedRoute>
                } />
                <Route path="/historial" element={
                  <ProtectedRoute>
                    <div>Historial en construcción</div>
                  </ProtectedRoute>
                } />
              
                {/* Panel Matrona - Requiere autenticación */}
                <Route path="/matrona/dashboard" element={
                  <ProtectedRoute>
                    <MatronaPanelPage />
                  </ProtectedRoute>
                } />
                <Route path="/matrona/solicitudes" element={
                  <ProtectedRoute>
                    <MatronaPanelPage />
                  </ProtectedRoute>
                } />
              
              {/* Páginas legales */}
              <Route path="/privacidad" element={<div>Privacidad en construcción</div>} />
              <Route path="/terminos" element={<div>Términos en construcción</div>} />
              <Route path="/cookies" element={<div>Cookies en construcción</div>} />
              <Route path="/legal" element={<div>Legal en construcción</div>} />
              
              {/* 404 */}
              <Route path="*" element={<div>Página no encontrada</div>} />
            </Routes>
          </div>
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
