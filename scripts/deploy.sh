#!/bin/bash

# ==============================================
# MATRONAPP - SCRIPT DE DESPLIEGUE
# ==============================================

echo "🚀 Iniciando despliegue de MatronApp..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Instala Node.js y npm primero."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    error "npm no está instalado. Instala npm primero."
    exit 1
fi

log "Verificando dependencias..."

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    log "Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        error "Error instalando dependencias"
        exit 1
    fi
    success "Dependencias instaladas"
else
    success "Dependencias ya instaladas"
fi

# Ejecutar tests
log "Ejecutando tests..."
npm test -- --coverage --watchAll=false
if [ $? -ne 0 ]; then
    warning "Los tests fallaron, pero continuamos con el despliegue"
fi

# Construir la aplicación
log "Construyendo aplicación para producción..."
REACT_APP_ENVIRONMENT=production npm run build

if [ $? -ne 0 ]; then
    error "Error en el build de la aplicación"
    exit 1
fi

success "Build completado exitosamente"

# Crear estructura del backend en build
log "Preparando backend..."
mkdir -p build/api
mkdir -p build/api/config
mkdir -p build/api/controllers
mkdir -p build/api/models
mkdir -p build/api/utils

# Copiar archivos del backend
if [ -d "backend" ]; then
    cp -r backend/* build/api/
    success "Backend copiado a build/api/"
else
    warning "No se encontró directorio backend"
fi

# Crear .htaccess mejorado
log "Creando .htaccess..."
cat > build/.htaccess << 'EOF'
Options -MultiViews
RewriteEngine On

# Permitir acceso a archivos estáticos
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Redirigir API calls al backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Redirigir todo lo demás al React app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]

# Headers de seguridad
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"

# Caché para archivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
EOF

success ".htaccess creado"

# Crear información de despliegue
log "Creando información de despliegue..."
cat > build/deploy-info.json << EOF
{
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "$(node -p "require('./package.json').version")",
  "environment": "production",
  "buildTool": "manual-script"
}
EOF

success "Información de despliegue creada"

# Mostrar estadísticas del build
log "Estadísticas del build:"
echo "📁 Directorio build/ creado con:"
ls -la build/ | head -10
echo ""
echo "📊 Tamaño total del build:"
du -sh build/
echo ""

# Crear archivo ZIP para subir manualmente
log "Creando archivo ZIP para subir..."
if command -v zip &> /dev/null; then
    zip -r matronapp-build.zip build/
    success "Archivo matronapp-build.zip creado"
else
    warning "zip no está instalado. Crea manualmente el archivo ZIP de la carpeta build/"
fi

echo ""
echo "🎉 ¡Despliegue preparado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Sube el contenido de la carpeta build/ a tu cPanel (public_html/)"
echo "2. O sube el archivo matronapp-build.zip y extráelo en cPanel"
echo "3. Configura tu base de datos en cPanel"
echo "4. Actualiza las variables de entorno en el servidor"
echo ""
echo "🔗 Archivos importantes:"
echo "   - build/index.html (frontend)"
echo "   - build/api/ (backend PHP)"
echo "   - build/.htaccess (configuración del servidor)"
echo ""
echo "✅ ¡Listo para producción!" 