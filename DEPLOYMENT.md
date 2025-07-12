# 🚀 Guía de Despliegue - MatronApp

## 📋 Resumen

Esta guía te ayudará a desplegar MatronApp en cPanel usando GitHub Actions para automatización completa.

## 🎯 Opciones de Despliegue

### 1. **Despliegue Automático con GitHub Actions** (Recomendado)
### 2. **Despliegue Manual con Script**
### 3. **Despliegue Manual Tradicional**

---

## 🚀 OPCIÓN 1: Despliegue Automático con GitHub Actions

### **Paso 1: Configurar Secrets en GitHub**

Ve a tu repositorio en GitHub → **Settings** → **Secrets and variables** → **Actions**

Agrega estos secrets:

```
FTP_SERVER=ftp.cuiden.cl
FTP_USERNAME=tu_usuario_cpanelmatronapp@cuiden.cl
FTP_PASSWORD=Mimisu-4062636263
FTP_SERVER_DIR=public_html/
REACT_APP_API_URL=https://cuiden.cl/api
SITE_URL=cuiden.cl
```

### **Paso 2: Configurar Base de Datos en cPanel**

1. Ve a **"Bases de datos MySQL"** en cPanel
2. Crea una nueva base de datos: `matronapp_db`
3. Crea un usuario: `matronapp_user`
4. Asigna todos los permisos al usuario en la base de datos
5. Anota los datos de conexión

### **Paso 3: Configurar Variables de Entorno**

Crea un archivo `.env` en el directorio raíz de tu hosting con:

```env
DB_HOST=localhost
DB_NAME=tu_prefijo_matronapp_db
DB_USER=tu_prefijo_matronapp_user
DB_PASSWORD=tu_password_db
JWT_SECRET=tu_clave_secreta_muy_segura
```

### **Paso 4: Activar el Despliegue**

1. Haz un commit y push a la rama `main`
2. GitHub Actions se ejecutará automáticamente
3. Verifica el progreso en la pestaña **Actions** de tu repositorio

### **Paso 5: Inicializar Base de Datos**

Visita: `https://tudominio.com/api/install` para crear las tablas automáticamente.

---

## 🛠 OPCIÓN 2: Despliegue Manual con Script

### **Paso 1: Ejecutar Script de Despliegue**

```bash
# Hacer el script ejecutable
chmod +x scripts/deploy.sh

# Ejecutar el script
./scripts/deploy.sh
```

### **Paso 2: Subir Archivos**

1. Se creará un archivo `matronapp-build.zip`
2. Sube este archivo a tu cPanel
3. Extrae el contenido en `public_html/`

### **Paso 3: Configurar Base de Datos**

Sigue los pasos de configuración de base de datos de la Opción 1.

---

## 📁 OPCIÓN 3: Despliegue Manual Tradicional

### **Paso 1: Construir la Aplicación**

```bash
npm install
npm run build
```

### **Paso 2: Preparar Backend**

```bash
mkdir build/api
cp -r backend/* build/api/
```

### **Paso 3: Crear .htaccess**

Crea `build/.htaccess` con:

```apache
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
```

### **Paso 4: Subir Archivos**

Sube todo el contenido de `build/` a `public_html/` en tu cPanel.

---

## 🗄️ Configuración de Base de Datos

### **Script SQL para Crear Tablas**

Ejecuta este script en phpMyAdmin:

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    tipo ENUM('paciente', 'matrona') DEFAULT 'paciente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    perfil_completo BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar matrona de prueba
INSERT INTO users (nombre, apellido, rut, email, password, tipo) VALUES 
('Patricia', 'Morales', '98765432-1', 'patricia.morales@matronapp.cl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'matrona');
```

---

## 🔧 Configuración del Servidor

### **Variables de Entorno (.env)**

```env
# Base de datos
DB_HOST=localhost
DB_NAME=matronapp_db
DB_USER=matronapp_user
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_clave_secreta_jwt

# Configuración adicional
APP_DEBUG=false
APP_TIMEZONE=America/Santiago
```

### **Permisos de Archivos**

```bash
# Archivos PHP
chmod 644 api/*.php
chmod 644 api/*/*.php

# Directorio de uploads (si aplica)
chmod 755 uploads/

# .htaccess
chmod 644 .htaccess
```

---

## 🧪 Verificación del Despliegue

### **1. Verificar Frontend**

Visita: `https://tudominio.com`

Deberías ver la página de inicio de MatronApp.

### **2. Verificar Backend**

Visita: `https://tudominio.com/api`

Deberías ver:
```json
{
  "success": true,
  "message": "Bienvenido a MatronApp API",
  "version": "1.0.0"
}
```

### **3. Verificar Base de Datos**

Visita: `https://tudominio.com/api/health`

Deberías ver el estado de la conexión a la base de datos.

### **4. Probar Autenticación**

Intenta registrarte o iniciar sesión en la aplicación.

---

## 🐛 Solución de Problemas

### **Error 500 - Internal Server Error**

1. Verifica los logs de error en cPanel
2. Revisa la configuración de la base de datos
3. Verifica que PHP esté habilitado
4. Comprueba los permisos de archivos

### **Error de Conexión a Base de Datos**

1. Verifica las credenciales en `.env`
2. Asegúrate de que la base de datos existe
3. Verifica que el usuario tenga permisos
4. Revisa el host de la base de datos

### **Rutas de React no Funcionan**

1. Verifica que `.htaccess` esté en `public_html/`
2. Asegúrate de que mod_rewrite esté habilitado
3. Revisa la configuración de Apache

### **API no Responde**

1. Verifica que los archivos PHP estén en `public_html/api/`
2. Revisa los logs de PHP
3. Verifica la configuración de CORS

---

## 🔄 Actualizaciones Futuras

### **Con GitHub Actions**

1. Haz cambios en tu código
2. Commit y push a la rama `main`
3. GitHub Actions desplegará automáticamente

### **Manual**

1. Ejecuta `./scripts/deploy.sh`
2. Sube el nuevo `matronapp-build.zip`
3. Extrae y reemplaza archivos en cPanel

---

## 📊 Monitoreo

### **Logs de Aplicación**

- **Frontend**: Console del navegador
- **Backend**: Logs de PHP en cPanel
- **Base de datos**: Logs de MySQL

### **Métricas**

- **Tiempo de carga**: < 3 segundos
- **Disponibilidad**: 99.9%
- **Errores**: < 1%

---

## 🔒 Seguridad

### **Certificado SSL**

1. Activa SSL en cPanel
2. Configura redirección HTTPS
3. Verifica que todas las URLs usen HTTPS

### **Backup**

1. Configura backup automático en cPanel
2. Descarga backup de la base de datos regularmente
3. Mantén copias del código en GitHub

---

## ✅ Checklist de Despliegue

- [ ] Configurar secrets en GitHub
- [ ] Crear base de datos en cPanel
- [ ] Configurar variables de entorno
- [ ] Ejecutar despliegue (automático o manual)
- [ ] Verificar frontend
- [ ] Verificar backend/API
- [ ] Probar autenticación
- [ ] Configurar SSL
- [ ] Configurar backup
- [ ] Documentar credenciales

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de error
2. Verifica la configuración
3. Consulta la documentación de tu hosting
4. Contacta al soporte técnico de tu hosting

---

**🎉 ¡Felicitaciones! MatronApp está desplegada y lista para usar.** 

---

## 🟢 **PASOS PARA CONFIGURAR LA BASE DE DATOS EN CPANEL**

### 1. **Accede a cPanel**
- Ingresa a tu cPanel con tu usuario y contraseña.

---

### 2. **Ve a la sección “Bases de datos MySQL”**
- Busca el ícono o la opción que dice **“MySQL Databases”** o **“Bases de datos MySQL”**.

---

### 3. **Crea una nueva base de datos**
- En el campo **“Create New Database”** o **“Crear nueva base de datos”**, escribe el nombre, por ejemplo:  
  ```
  matronapp_db
  ```
- Haz clic en **“Create Database”**.

---

### 4. **Crea un usuario para la base de datos**
- Baja a la sección **“Add New User”** o **“Agregar nuevo usuario”**.
- Escribe un nombre de usuario, por ejemplo:  
  ```
  matronapp_user
  ```
- Escribe una contraseña segura (guárdala bien).
- Haz clic en **“Create User”**.

---

### 5. **Asigna el usuario a la base de datos**
- Baja a la sección **“Add User to Database”**.
- Selecciona el usuario y la base de datos que creaste.
- Haz clic en **“Add”**.
- En la siguiente pantalla, marca **“ALL PRIVILEGES”** (Todos los privilegios).
- Haz clic en **“Make Changes”** o **“Hacer cambios”**.

---

### 6. **Guarda los datos de conexión**
- **Nombre de la base de datos:**  
  Suele ser algo como `tuprefijo_matronapp_db`
- **Usuario de la base de datos:**  
  Suele ser algo como `tuprefijo_matronapp_user`
- **Contraseña:**  
  La que creaste
- **Host:**  
  Normalmente es `localhost`

---

### 7. **Configura las variables de entorno en tu hosting**
Crea o edita el archivo `.env` en tu servidor (o en el backend PHP) con estos datos:

```
<code_block_to_apply_changes_from>
DB_HOST=localhost
DB_NAME=tuprefijo_matronapp_db
DB_USER=tuprefijo_matronapp_user
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu_clave_secreta
```

---

### 8. **Carga las tablas (opcional)**
- Si tu backend tiene un script para crear las tablas, ejecútalo.
- O usa **phpMyAdmin** (en cPanel) para importar el script SQL que te proporcioné antes.

---

## 📝 **¿Qué sigue?**
- Cuando tu backend PHP se conecte, usará estos datos.
- Si tienes dudas con el nombre exacto de la base de datos o usuario, revisa la lista de bases de datos y usuarios en cPanel: siempre llevan el prefijo de tu cuenta.

---

¿Quieres que te ayude con el script SQL para crear las tablas, o tienes dudas en algún paso?  
¿Necesitas ayuda para editar el archivo `.env` en tu hosting? 