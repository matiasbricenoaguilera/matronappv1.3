import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { DashboardLayout } from '../components/layout/Layout';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  User, 
  Save, 
  Eye, 
  EyeOff, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  ArrowLeft
} from 'lucide-react';

interface ConfiguracionForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  passwordActual: string;
  passwordNueva: string;
  confirmarPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  appointmentReminders: boolean;
}

export const ConfiguracionPage: React.FC = () => {
  const { user, actualizarPerfil } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'notificaciones' | 'privacidad'>('perfil');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState<ConfiguracionForm>({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    passwordActual: '',
    passwordNueva: '',
    confirmarPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    appointmentReminders: true
  });

  const handleInputChange = (field: keyof ConfiguracionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      
      const updatedUser = {
        ...user!,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono
      };

      actualizarPerfil(updatedUser);
      showSuccess('Perfil actualizado', 'Tus datos han sido guardados exitosamente');
    } catch (error) {
      showError('Error al actualizar', 'No se pudo actualizar el perfil. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.passwordNueva !== formData.confirmarPassword) {
      showError('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (formData.passwordNueva.length < 6) {
      showError('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      showSuccess('Contraseña actualizada', 'Tu contraseña ha sido cambiada exitosamente');
      setFormData(prev => ({ ...prev, passwordActual: '', passwordNueva: '', confirmarPassword: '' }));
    } catch (error) {
      showError('Error al cambiar contraseña', 'No se pudo cambiar la contraseña. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      showSuccess('Preferencias guardadas', 'Tus preferencias de notificación han sido actualizadas');
    } catch (error) {
      showError('Error', 'No se pudieron guardar las preferencias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const userData = {
      nombre: user?.nombre,
      apellido: user?.apellido,
      email: user?.email,
      telefono: user?.telefono,
      fechaRegistro: user?.fechaRegistro,
      tipo: user?.tipo
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `matronapp-datos-${user?.nombre}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSuccess('Datos exportados', 'Tus datos han sido descargados exitosamente');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      showError('Función no disponible', 'Esta funcionalidad estará disponible próximamente');
    }
  };

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'privacidad', label: 'Privacidad', icon: Eye }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Información Personal</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <Input
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      placeholder="Tu apellido"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <Input
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      placeholder="+56 9 XXXX XXXX"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        );

      case 'seguridad':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.passwordActual}
                        onChange={(e) => handleInputChange('passwordActual', e.target.value)}
                        placeholder="Tu contraseña actual"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={formData.passwordNueva}
                        onChange={(e) => handleInputChange('passwordNueva', e.target.value)}
                        placeholder="Tu nueva contraseña"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmarPassword}
                      onChange={(e) => handleInputChange('confirmarPassword', e.target.value)}
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading || !formData.passwordActual || !formData.passwordNueva}
                    className="flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        );

      case 'notificaciones':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Preferencias de Notificación</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {key === 'emailNotifications' && 'Notificaciones por Email'}
                          {key === 'smsNotifications' && 'Notificaciones por SMS'}
                          {key === 'pushNotifications' && 'Notificaciones Push'}
                          {key === 'marketingEmails' && 'Emails de Marketing'}
                          {key === 'appointmentReminders' && 'Recordatorios de Citas'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Recibir notificaciones por correo electrónico'}
                          {key === 'smsNotifications' && 'Recibir notificaciones por mensaje de texto'}
                          {key === 'pushNotifications' && 'Recibir notificaciones push en el navegador'}
                          {key === 'marketingEmails' && 'Recibir ofertas y promociones'}
                          {key === 'appointmentReminders' && 'Recordatorios de citas médicas'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(key as keyof NotificationSettings, !value)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${value ? 'bg-primary' : 'bg-gray-200'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${value ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Guardando...' : 'Guardar Preferencias'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        );

      case 'privacidad':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Privacidad y Datos</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Exportar Datos</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Descarga una copia de todos tus datos personales almacenados en MatronApp.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Mis Datos
                    </Button>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-red-900 mb-2">Eliminar Cuenta</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. 
                      Esta acción no se puede deshacer.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleDeleteAccount}
                      className="flex items-center text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar Cuenta
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="Configuración"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de navegación */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}; 