# MatronApp - Recetas Anticonceptivas en 5 Minutos

## 🚀 Descripción

MatronApp es una plataforma digital revolucionaria que permite a las mujeres chilenas obtener sus recetas anticonceptivas en **5 minutos o menos**. Nuestra propuesta de valor se centra en la **INMEDIATEZ total**, ideal para mujeres que están en la farmacia y necesitan su receta YA, no en 24 horas.

## ✨ Características Principales

### Para Pacientes
- **Registro rápido** con validación completa
- **Cuestionario médico inteligente** con lógica condicional
- **Pago seguro** con WebPay Plus integrado
- **Dashboard personalizado** con seguimiento de solicitudes
- **Recetas digitales** válidas por 30 días
- **Tiempo de respuesta garantizado**: 5 minutos o menos

### Para Matronas
- **Panel profesional** para revisar solicitudes
- **Sistema de prioridades** (alta, media, baja)
- **Generación automática de PDFs** con recetas profesionales
- **Filtrado y búsqueda** de solicitudes
- **Historial completo** de pacientes
- **Firma digital** integrada

## 🛠 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router 6
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📋 Requisitos

- Node.js >= 14.0.0
- npm >= 6.0.0

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/matronapp.git
cd matronapp
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm start
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 🏗 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/                 # Componentes de autenticación
│   ├── layout/              # Layouts y componentes de diseño
│   └── ui/                  # Componentes UI reutilizables
├── contexts/                # Context providers
├── pages/                   # Páginas de la aplicación
├── types/                   # Definiciones de tipos TypeScript
├── utils/                   # Utilidades y helpers
└── App.tsx                  # Componente principal
```

## 📱 Páginas Principales

### Usuarios (Pacientes)
- **Landing Page** (`/`) - Página de inicio con información del servicio
- **Registro** (`/registro`) - Formulario de registro de usuarios
- **Login** (`/login`) - Inicio de sesión
- **Cuestionario** (`/cuestionario`) - Cuestionario médico multi-step
- **Pago** (`/pago`) - Proceso de pago con WebPay
- **Dashboard** (`/dashboard`) - Panel de usuario con solicitudes

### Matronas
- **Panel de Matrona** (`/matrona/dashboard`) - Dashboard profesional
- **Solicitudes** (`/matrona/solicitudes`) - Gestión de solicitudes

## 🔐 Autenticación

### Usuarios de Prueba

**Paciente:**
- Email: `maria@email.com`
- Contraseña: `password123`

**Matrona:**
- Email: `patricia.morales@matronapp.cl`
- Contraseña: `matrona123`

## 🎯 Flujo de Usuario

1. **Registro/Login** - El usuario se registra o inicia sesión
2. **Cuestionario Médico** - Completa un cuestionario de 5 pasos
3. **Recomendación** - Recibe recomendación de anticonceptivo
4. **Pago** - Realiza el pago de $4.990 CLP
5. **Dashboard** - Puede ver el estado de sus solicitudes
6. **Revisión por Matrona** - Una matrona revisa y aprueba la solicitud
7. **Receta Digital** - Recibe la receta en formato PDF

## 📊 Características Técnicas

### Componentes UI
- **Button** - Botón reutilizable con variantes
- **Input** - Campo de entrada con validación
- **Card** - Tarjeta con header y body
- **StatusBadge** - Indicador de estado
- **StepperProgress** - Progreso de pasos

### Utilidades
- **Formatters** - Formateo de fechas, precios, RUT, teléfonos
- **PDF Generator** - Generación de recetas en PDF
- **Validators** - Validación de formularios

### Contextos
- **AuthContext** - Gestión de autenticación
- **AppContext** - Estado global de la aplicación

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start

# Construcción para producción
npm run build

# Ejecutar tests
npm test

# Análisis de bundle
npm run analyze
```

## 🎨 Diseño y UX

- **Diseño responsive** optimizado para mobile y desktop
- **Paleta de colores médica** (azul y verde)
- **Tipografía clara** y legible
- **Micro-interacciones** para mejorar la experiencia
- **Loading states** y feedback visual
- **Validación en tiempo real** de formularios

## 🔒 Seguridad

- **Validación de entrada** en frontend y backend simulado
- **Autenticación con tokens** JWT simulados
- **Protección de rutas** privadas
- **Validación de RUT** chileno
- **Sanitización de datos** de entrada

## 📈 Futuras Mejoras

- [ ] Integración con APIs reales
- [ ] Notificaciones push
- [ ] Chat en tiempo real con matronas
- [ ] Integración con farmacias
- [ ] App móvil nativa
- [ ] Telemedicina con video llamadas
- [ ] Recordatorios automáticos
- [ ] Integración con sistema de salud

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo Frontend**: React + TypeScript
- **Diseño UX/UI**: Tailwind CSS
- **Arquitectura**: Componentes reutilizables
- **Testing**: Jest + React Testing Library

## 📞 Contacto

- **Email**: contacto@matronapp.cl
- **Teléfono**: +56 2 2345 6789
- **Sitio Web**: https://matronapp.cl

---

**MatronApp** - Revolucionando el acceso a anticonceptivos en Chile 🇨🇱
