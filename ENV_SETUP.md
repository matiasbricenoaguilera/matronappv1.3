# 🔧 Método 1: Configuración de Variables de Entorno - MatronApp

## ✅ **IMPLEMENTADO EXITOSAMENTE**

### **Archivos Creados/Modificados:**

1. ✅ `env.production` - Archivo de variables de entorno para producción
2. ✅ `backend/index.php` - Modificado para cargar variables automáticamente
3. ✅ `test-env.php` - Archivo de prueba para verificar configuración

## 📋 **Pasos para Configurar en el Servidor:**

### **1. Subir archivos al servidor**

```bash
# Subir estos archivos a tu servidor cPanel:
- env.production → renombrar a .env
- backend/index.php (ya modificado)
- test-env.php (para verificación)
```

### **2. Configurar archivo .env**

En tu servidor, renombra `env.production` a `.env` y actualiza las variables:

```env
# Base de datos (ACTUALIZAR CON TUS DATOS REALES)
DB_HOST=localhost
DB_NAME=matronapp_db
DB_USER=matronapp_user
DB_PASSWORD=TU_PASSWORD_REAL_AQUI
CPANEL_PREFIX=cuiden

# JWT (GENERAR CLAVE SEGURA)
JWT_SECRET=TU_CLAVE_SECRETA_UNICA_Y_SEGURA_2024

# API
REACT_APP_API_URL=https://cuiden.cl/api
REACT_APP_ENVIRONMENT=production
```

### **3. Verificar configuración**

Accede a: `https://cuiden.cl/test-env.php`

Deberías ver:
- ✅ Archivo cargado exitosamente
- ✅ Variables de base de datos configuradas
- ✅ Nombres finales en cPanel calculados

### **4. Probar conexión a BD**

Accede a: `https://cuiden.cl/backend/test-db.php`

Deberías ver:
- ✅ Conexión exitosa a la base de datos
- ✅ Tablas creadas correctamente
- ✅ Datos de prueba insertados

## 🔍 **Verificación de Funcionamiento:**

### **Variables que se cargan automáticamente:**

- **Base de datos**: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `CPANEL_PREFIX`
- **JWT**: `JWT_SECRET`
- **API**: `REACT_APP_API_URL`, `REACT_APP_ENVIRONMENT`
- **Configuración**: `APP_DEBUG`, `APP_TIMEZONE`, `UPLOAD_MAX_SIZE`, `SESSION_LIFETIME`

### **Nombres finales en cPanel:**

Con `CPANEL_PREFIX=cuiden`:
- Base de datos: `cuiden_matronapp_db`
- Usuario: `cuiden_matronapp_user`

## 🚀 **Próximos Pasos:**

1. **Crear base de datos** en cPanel con los nombres calculados
2. **Actualizar contraseñas** en el archivo `.env`
3. **Generar JWT_SECRET** seguro
4. **Probar API endpoints** con `https://cuiden.cl/api/health`
5. **Eliminar archivos de prueba** por seguridad

## ⚠️ **Importante:**

- El archivo `.env` NO debe subirse a Git
- Eliminar `test-env.php` después de la verificación
- Mantener copia de seguridad de las variables
- Usar contraseñas seguras y únicas

---

**✅ Método 1 implementado y listo para usar en producción.** 