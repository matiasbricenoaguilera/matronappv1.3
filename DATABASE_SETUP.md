# 📊 Configuración de Base de Datos - MatronApp

## 🎯 Resumen de Verificación

✅ **Backend PHP**: Completamente implementado  
✅ **Controladores**: AuthController, UserController, CuestionarioController, SolicitudController, PagoController  
✅ **Clase Database**: Configurada con soporte para cPanel y prefijos  
✅ **Archivo de prueba**: `backend/test-db.php` creado para verificación  
✅ **Variables de entorno**: Configuradas en `env.example`  

## 🔧 Configuración Paso a Paso

### 1. Crear Base de Datos en cPanel

1. **Acceder a cPanel** → Bases de Datos MySQL
2. **Crear nueva base de datos**:
   - Nombre: `matronapp_db`
   - El sistema agregará automáticamente el prefijo (ej: `cuiden_matronapp_db`)

3. **Crear usuario de base de datos**:
   - Nombre: `matronapp_user`
   - Contraseña: **Generar contraseña segura**
   - El sistema agregará automáticamente el prefijo (ej: `cuiden_matronapp_user`)

4. **Asignar usuario a la base de datos**:
   - Seleccionar usuario: `cuiden_matronapp_user`
   - Seleccionar base de datos: `cuiden_matronapp_db`
   - Privilegios: **TODOS LOS PRIVILEGIOS** ✅

### 2. Configurar Variables de Entorno

Crear archivo `.env` en el servidor con:

```env
# Base de datos
DB_HOST=localhost
DB_NAME=matronapp_db
DB_USER=matronapp_user
DB_PASSWORD=TU_PASSWORD_SEGURA_AQUI
CPANEL_PREFIX=cuiden

# JWT
JWT_SECRET=tu_clave_secreta_jwt_muy_segura_2024

# API
REACT_APP_API_URL=https://cuiden.cl/api
```

### 3. Verificar Configuración

1. **Subir archivo de prueba**:
   ```bash
   # El archivo backend/test-db.php ya está creado
   ```

2. **Ejecutar en navegador**:
   ```
   https://cuiden.cl/backend/test-db.php
   ```

3. **Verificar resultados**:
   - ✅ Conexión exitosa
   - ✅ Tablas creadas
   - ✅ Datos de prueba insertados

4. **Eliminar archivo de prueba** (por seguridad):
   ```bash
   rm backend/test-db.php
   ```

## 📋 Estructura de Tablas

### Tabla `users`
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- nombre (VARCHAR(100), NOT NULL)
- apellido (VARCHAR(100), NOT NULL)
- rut (VARCHAR(20), UNIQUE, NOT NULL)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL)
- telefono (VARCHAR(20))
- tipo (ENUM: 'paciente', 'matrona')
- fecha_registro (TIMESTAMP)
- perfil_completo (BOOLEAN)
- activo (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### Tabla `cuestionarios`
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY → users.id)
- anticonceptivos_actuales (TEXT)
- alergias (JSON)
- medicamentos (JSON)
- fumadora (BOOLEAN)
- alcohol (ENUM: 'nunca', 'ocasional', 'regular', 'frecuente')
- ejercicio (ENUM: 'sedentario', 'ocasional', 'regular', 'intenso')
- antecedentes_cardio (BOOLEAN)
- diabetes (BOOLEAN)
- cancer (BOOLEAN)
- migranas (BOOLEAN)
- embarazo (BOOLEAN)
- lactancia (BOOLEAN)
- ciclo_menstrual (ENUM: 'regular', 'irregular', 'ausente')
- created_at, updated_at (TIMESTAMP)
```

### Tabla `solicitudes`
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY → users.id)
- cuestionario_id (INT, FOREIGN KEY → cuestionarios.id)
- matrona_id (INT, FOREIGN KEY → users.id)
- estado (ENUM: 'pendiente', 'en_revision', 'aprobada', 'rechazada')
- prioridad (ENUM: 'baja', 'media', 'alta')
- anticonceptivo_solicitado (VARCHAR(100))
- motivo_consulta (TEXT)
- precio (DECIMAL(10,2))
- fecha_solicitud (TIMESTAMP)
- fecha_revision (TIMESTAMP)
- tiempo_limite (TIMESTAMP)
- notas_matrona (TEXT)
- created_at, updated_at (TIMESTAMP)
```

### Tabla `recetas`
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- solicitud_id (INT, FOREIGN KEY → solicitudes.id)
- medicamento (VARCHAR(100), NOT NULL)
- posologia (TEXT, NOT NULL)
- indicaciones (TEXT)
- fecha_emision (TIMESTAMP)
- fecha_vencimiento (DATE)
- pdf_path (VARCHAR(255))
- activa (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### Tabla `pagos`
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- solicitud_id (INT, FOREIGN KEY → solicitudes.id)
- monto (DECIMAL(10,2), NOT NULL)
- metodo_pago (VARCHAR(50))
- estado (ENUM: 'pendiente', 'completado', 'fallido', 'reembolsado')
- transaction_id (VARCHAR(255))
- fecha_pago (TIMESTAMP)
- datos_pago (JSON)
- created_at, updated_at (TIMESTAMP)
```

## 🔐 Datos de Prueba

El sistema creará automáticamente:

**Matrona de Prueba:**
- Nombre: Patricia Morales
- RUT: 98765432-1
- Email: patricia.morales@matronapp.cl
- Contraseña: matrona123
- Tipo: matrona

## 🚀 Endpoints de API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil

### Cuestionarios
- `POST /api/cuestionario/submit` - Enviar cuestionario
- `GET /api/cuestionario/{id}` - Obtener cuestionario

### Solicitudes
- `GET /api/solicitudes` - Obtener solicitudes
- `POST /api/solicitudes` - Crear solicitud
- `GET /api/solicitudes/{id}` - Obtener solicitud específica
- `PUT /api/solicitudes/{id}` - Actualizar solicitud (solo matronas)

### Pagos
- `POST /api/pagos` - Procesar pago
- `POST /api/pagos/webhook` - Webhook de pago
- `GET /api/pagos/{id}` - Obtener pago específico

### Estado
- `GET /api/health` - Estado de la API
- `GET /api/status` - Estado de la API

## 🛠️ Troubleshooting

### Error de Conexión
```
❌ Error: SQLSTATE[HY000] [1045] Access denied
```
**Solución**: Verificar credenciales y prefijos en variables de entorno

### Error de Prefijo
```
❌ Error: Table 'matronapp_db.users' doesn't exist
```
**Solución**: Configurar `CPANEL_PREFIX` correctamente

### Error de Permisos
```
❌ Error: SELECT command denied to user
```
**Solución**: Asignar TODOS LOS PRIVILEGIOS al usuario

## ✅ Checklist de Verificación

- [ ] Base de datos creada en cPanel
- [ ] Usuario de BD creado con privilegios completos
- [ ] Variables de entorno configuradas
- [ ] Archivo test-db.php ejecutado exitosamente
- [ ] Tablas creadas correctamente
- [ ] Datos de prueba insertados
- [ ] Archivo test-db.php eliminado
- [ ] API endpoints respondiendo correctamente

## 🔄 Próximos Pasos

1. **Probar registro de usuario** desde la aplicación
2. **Probar login** con matrona de prueba
3. **Enviar cuestionario** de prueba
4. **Procesar pago** simulado
5. **Verificar flujo completo** de la aplicación

---

**⚠️ IMPORTANTE**: Eliminar `backend/test-db.php` después de la verificación por seguridad. 