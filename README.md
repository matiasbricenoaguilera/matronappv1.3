# 🩺 MatronApp - MVP

Plataforma digital que conecta mujeres con matronas certificadas para obtener recetas anticonceptivas **en 5 minutos o menos** - ideal para cuando estás en la farmacia.

## 🚀 Estado del Proyecto

### ✅ **COMPLETADO - Fase 1 & 2**

#### **Setup y Base Técnica**
- ✅ React 18+ con TypeScript
- ✅ Tailwind CSS configurado con colores personalizados
- ✅ React Router v6 para navegación
- ✅ React Hook Form + Zod para formularios
- ✅ Lucide React para iconos
- ✅ Axios para HTTP requests
- ✅ Context API para estado global

#### **Tipos TypeScript Completos**
- ✅ `User`, `RegistroData`, `LoginData`, `AuthUser`
- ✅ `CuestionarioMedico`, `Prescription`, `Matrona`
- ✅ `PaymentData`, `Payment`, `PaymentSummary`
- ✅ `Comuna`, `Notification`, `ApiResponse`

#### **Componentes UI Base (8 componentes)**
- ✅ `Button` - 3 variantes, 3 tamaños, loading state
- ✅ `Input` - Con validaciones, iconos, show/hide password
- ✅ `Card` - Flexible con header, body, footer
- ✅ `Modal` - Con overlay, escape, tamaños
- ✅ `RutInput` - Validación y formato automático RUT chileno
- ✅ `ComunaSelect` - Dropdown con comunas chilenas agrupadas
- ✅ `StepperProgress` - Indicador de progreso por pasos
- ✅ `StatusBadge` - Badges de estado con colores

#### **Validaciones Robustas**
- ✅ Algoritmo validación RUT chileno completo
- ✅ Validación teléfono formato chileno (+56 9)
- ✅ Esquemas Zod para formularios
- ✅ Formateo automático de datos

#### **Utilidades Completas**
- ✅ Formateo de fechas en español
- ✅ Formateo de precios en pesos chilenos
- ✅ Formateo de estados con colores
- ✅ Generación de números de receta
- ✅ Cálculo de edad y validaciones

#### **Context API**
- ✅ `AuthContext` - Autenticación con localStorage
- ✅ `AppContext` - Estado global de la aplicación

#### **Layout System**
- ✅ `Header` - Navegación responsive con transparencia
- ✅ `Footer` - Completo con links legales y contacto
- ✅ `Layout` - Sistema flexible para diferentes páginas
- ✅ `AuthLayout`, `DashboardLayout`, `PageLayout`

#### **Landing Page Conversion-Optimizada**
- ✅ Hero section con gradiente rosa-azul
- ✅ Comparación precio: $4.990 vs $25.000
- ✅ Testimonios reales simulados
- ✅ FAQ section interactiva
- ✅ CTA "Obtener Mi Receta Ahora"
- ✅ Sección "¿Cómo funciona?" con 4 pasos
- ✅ Responsive mobile-first
- ✅ Animaciones sutiles CSS

#### **Datos Mock Realistas**
- ✅ Usuarios y matronas de ejemplo
- ✅ 40+ comunas chilenas organizadas
- ✅ Testimonios con ratings
- ✅ Prescripciones de ejemplo

## 🎨 **Diseño Visual**

### **Paleta de Colores**
- **Primary**: `#E91E63` (Rosa principal)
- **Primary Dark**: `#C2185B`
- **Secondary**: `#00BCD4` (Azul secundario)
- **Success**: `#4CAF50`
- **Warning**: `#FF9800`
- **Error**: `#F44336`

### **Tipografía**
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

## 📱 **Funcionalidades MVP**

### **Landing Page**
- [x] Hero conversion-optimizada
- [x] Comparación de precios
- [x] Testimonios de usuarias
- [x] FAQ interactivas
- [x] CTAs estratégicos

### **Próximas Fases**

#### **📝 Fase 3 - Autenticación (Siguiente)**
- [ ] Formulario de registro completo
- [ ] Formulario de login
- [ ] Validación de email único
- [ ] Protección de rutas privadas
- [ ] Recuperación de contraseña

#### **📋 Fase 4 - Cuestionario Médico**
- [ ] Formulario multi-step
- [ ] Lógica condicional (ej: si fuma → cantidad)
- [ ] Validación por pasos
- [ ] Guardado de progreso
- [ ] Navegación hacia atrás

#### **💳 Fase 5 - Sistema de Pago**
- [ ] Integración WebPay simulada
- [ ] Resumen de pedido
- [ ] Confirmación de pago
- [ ] Estados: pendiente, procesando, completado

#### **📊 Fase 6 - Dashboard Usuario**
- [ ] Estado de solicitudes en tiempo real
- [ ] Timeline de progreso
- [ ] Información de matrona asignada
- [ ] Descarga de recetas PDF
- [ ] Historial completo

#### **👩‍⚕️ Fase 7 - Panel Matrona**
- [ ] Login independiente para matronas
- [ ] Lista de solicitudes pendientes
- [ ] Revisar cuestionarios médicos
- [ ] Aprobar/rechazar con comentarios
- [ ] Generar recetas PDF

## 🚀 **Ejecutar el Proyecto**

```bash
# Clonar el repositorio
cd matronapp

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 **Estructura del Proyecto**

```
src/
├── components/
│   ├── ui/              # Componentes base (8 componentes)
│   ├── forms/           # Formularios específicos (próxima fase)
│   └── layout/          # Header, Footer, Layout
├── pages/               # LandingPage (más páginas próximas)
├── hooks/               # Custom hooks (próxima fase)
├── services/            # API services (próxima fase)
├── types/               # Tipos TypeScript completos
├── utils/               # Validaciones y formatters
├── context/             # AuthContext, AppContext
└── data/                # Mock data realista
```

## 🔐 **Usuarios de Prueba**

### **Paciente**
- Email: `maria@email.com`
- Password: `password123`

### **Matrona**
- Email: `patricia.morales@matronapp.cl`
- Password: `matrona123`

## 🎯 **Métricas de Conversión Objetivo**

- **Landing → Registro**: >15%
- **Registro → Cuestionario Completo**: >80%
- **Cuestionario → Pago**: >70%
- **Tiempo Promedio Receta**: <5 minutos
- **Satisfacción Usuario**: >4.5/5

## 📝 **Próximos Pasos Inmediatos**

1. **Crear formulario de registro** con validaciones completas
2. **Implementar sistema de login** con manejo de errores
3. **Proteger rutas privadas** con guards
4. **Crear cuestionario médico** multi-step
5. **Implementar dashboard** con estados en tiempo real

## 🔧 **Tecnologías Usadas**

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **State**: Context API + useReducer
- **Icons**: Lucide React
- **HTTP**: Axios
- **Dates**: date-fns
- **Build**: Create React App

## 💡 **Notas de Desarrollo**

- **Mobile-First**: Diseñado para móviles primero
- **TypeScript Strict**: Tipado estricto en toda la aplicación
- **Validaciones Client-Side**: Validación robusta en el frontend
- **Datos Mock**: Simulación realista para el MVP
- **Responsive**: Breakpoints: 640px, 1024px, 1280px

---

**🩺 MatronApp - Conectando mujeres con matronas certificadas**
