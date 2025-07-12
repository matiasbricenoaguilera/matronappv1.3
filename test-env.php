<?php
// Cargar variables de entorno (mismo código que en index.php)
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue; // Comentarios
        if (empty(trim($line))) continue; // Líneas vacías
        
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            
            // Remover comillas si existen
            if (preg_match('/^(["\'])(.*)\1$/', $value, $matches)) {
                $value = $matches[2];
            }
            
            $_ENV[$name] = $value;
            putenv("$name=$value");
        }
    }
    return true;
}

// Intentar cargar .env desde diferentes ubicaciones
$envLoaded = false;
$possiblePaths = [
    __DIR__ . '/.env',              // En la raíz
    __DIR__ . '/env.production',    // Archivo de producción
    __DIR__ . '/backend/.env',      // En el directorio backend
    __DIR__ . '/backend/../.env',   // Un nivel arriba
];

$loadedFrom = 'No se encontró archivo .env';

foreach ($possiblePaths as $path) {
    if (loadEnv($path)) {
        $envLoaded = true;
        $loadedFrom = $path;
        break;
    }
}

// Si no se encontró .env, usar valores por defecto
if (!$envLoaded) {
    $_ENV['DB_HOST'] = $_ENV['DB_HOST'] ?? 'localhost';
    $_ENV['DB_NAME'] = $_ENV['DB_NAME'] ?? 'matronapp_db';
    $_ENV['DB_USER'] = $_ENV['DB_USER'] ?? 'matronapp_user';
    $_ENV['DB_PASSWORD'] = $_ENV['DB_PASSWORD'] ?? '';
    $_ENV['CPANEL_PREFIX'] = $_ENV['CPANEL_PREFIX'] ?? '';
    $_ENV['JWT_SECRET'] = $_ENV['JWT_SECRET'] ?? 'matronapp_secret_key_2024';
    $_ENV['REACT_APP_API_URL'] = $_ENV['REACT_APP_API_URL'] ?? 'https://cuiden.cl/api';
    $_ENV['REACT_APP_ENVIRONMENT'] = $_ENV['REACT_APP_ENVIRONMENT'] ?? 'production';
    $_ENV['APP_DEBUG'] = $_ENV['APP_DEBUG'] ?? 'false';
    $_ENV['APP_TIMEZONE'] = $_ENV['APP_TIMEZONE'] ?? 'America/Santiago';
}

echo "<!DOCTYPE html>";
echo "<html lang='es'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "<title>Verificación de Variables de Entorno - MatronApp</title>";
echo "<style>";
echo "body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }";
echo ".container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }";
echo "h1 { color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px; }";
echo "h2 { color: #34495e; margin-top: 30px; }";
echo ".success { background-color: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0; }";
echo ".warning { background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; margin: 10px 0; }";
echo ".error { background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin: 10px 0; }";
echo "ul { list-style-type: none; padding: 0; }";
echo "li { padding: 8px 0; border-bottom: 1px solid #eee; }";
echo "li:last-child { border-bottom: none; }";
echo ".label { font-weight: bold; color: #2c3e50; }";
echo ".value { color: #7f8c8d; }";
echo ".secret { color: #e74c3c; }";
echo ".info { background-color: #d1ecf1; color: #0c5460; padding: 10px; border-radius: 5px; margin: 10px 0; }";
echo "</style>";
echo "</head>";
echo "<body>";
echo "<div class='container'>";

echo "<h1>🔧 Verificación de Variables de Entorno - MatronApp</h1>";

// Información del archivo cargado
if ($envLoaded) {
    echo "<div class='success'>";
    echo "✅ <strong>Archivo cargado exitosamente desde:</strong> $loadedFrom";
    echo "</div>";
} else {
    echo "<div class='warning'>";
    echo "⚠️ <strong>No se encontró archivo .env, usando valores por defecto</strong>";
    echo "</div>";
}

echo "<h2>📊 Variables de Base de Datos</h2>";
echo "<ul>";
echo "<li><span class='label'>DB_HOST:</span> <span class='value'>" . ($_ENV['DB_HOST'] ?? 'NO CONFIGURADO') . "</span></li>";
echo "<li><span class='label'>DB_NAME:</span> <span class='value'>" . ($_ENV['DB_NAME'] ?? 'NO CONFIGURADO') . "</span></li>";
echo "<li><span class='label'>DB_USER:</span> <span class='value'>" . ($_ENV['DB_USER'] ?? 'NO CONFIGURADO') . "</span></li>";
echo "<li><span class='label'>DB_PASSWORD:</span> <span class='secret'>" . (empty($_ENV['DB_PASSWORD']) ? 'NO CONFIGURADO' : 'CONFIGURADO ✓') . "</span></li>";
echo "<li><span class='label'>CPANEL_PREFIX:</span> <span class='value'>" . ($_ENV['CPANEL_PREFIX'] ?? 'NO CONFIGURADO') . "</span></li>";
echo "</ul>";

// Calcular nombres finales con prefijo
$dbName = $_ENV['DB_NAME'] ?? 'matronapp_db';
$dbUser = $_ENV['DB_USER'] ?? 'matronapp_user';
$prefix = $_ENV['CPANEL_PREFIX'] ?? '';

if (!empty($prefix)) {
    $finalDbName = $prefix . '_' . $dbName;
    $finalDbUser = $prefix . '_' . $dbUser;
} else {
    $finalDbName = $dbName;
    $finalDbUser = $dbUser;
}

echo "<div class='info'>";
echo "<strong>📋 Nombres finales en cPanel:</strong><br>";
echo "Base de datos: <strong>$finalDbName</strong><br>";
echo "Usuario: <strong>$finalDbUser</strong>";
echo "</div>";

echo "<h2>🔐 Variables JWT</h2>";
echo "<ul>";
echo "<li><span class='label'>JWT_SECRET:</span> <span class='secret'>" . (empty($_ENV['JWT_SECRET']) ? 'NO CONFIGURADO' : 'CONFIGURADO ✓') . "</span></li>";
echo "</ul>";

echo "<h2>🌐 Variables API</h2>";
echo "<ul>";
echo "<li><span class='label'>REACT_APP_API_URL:</span> <span class='value'>" . ($_ENV['REACT_APP_API_URL'] ?? 'NO CONFIGURADO') . "</span></li>";
echo "<li><span class='label'>REACT_APP_ENVIRONMENT:</span> <span class='value'>" . ($_ENV['REACT_APP_ENVIRONMENT'] ?? 'NO CONFIGURADO') . "</span></li>";
echo "</ul>";

echo "<h2>⚙️ Configuración Adicional</h2>";
echo "<ul>";
echo "<li><span class='label'>APP_DEBUG:</span> <span class='value'>" . ($_ENV['APP_DEBUG'] ?? 'false') . "</span></li>";
echo "<li><span class='label'>APP_TIMEZONE:</span> <span class='value'>" . ($_ENV['APP_TIMEZONE'] ?? 'America/Santiago') . "</span></li>";
echo "<li><span class='label'>UPLOAD_MAX_SIZE:</span> <span class='value'>" . ($_ENV['UPLOAD_MAX_SIZE'] ?? '10485760') . "</span></li>";
echo "<li><span class='label'>SESSION_LIFETIME:</span> <span class='value'>" . ($_ENV['SESSION_LIFETIME'] ?? '1440') . "</span></li>";
echo "</ul>";

// Verificación de configuración
echo "<h2>✅ Verificación de Configuración</h2>";
$errors = [];
$warnings = [];

if (empty($_ENV['DB_PASSWORD'])) {
    $errors[] = "DB_PASSWORD no está configurado";
}

if (empty($_ENV['JWT_SECRET']) || $_ENV['JWT_SECRET'] === 'tu_clave_secreta_jwt_muy_segura_2024') {
    $warnings[] = "JWT_SECRET debe ser cambiado por una clave segura";
}

if (empty($_ENV['CPANEL_PREFIX'])) {
    $warnings[] = "CPANEL_PREFIX no está configurado (puede ser necesario para cPanel)";
}

if (empty($errors) && empty($warnings)) {
    echo "<div class='success'>";
    echo "✅ <strong>Todas las variables están configuradas correctamente</strong>";
    echo "</div>";
} else {
    if (!empty($errors)) {
        echo "<div class='error'>";
        echo "❌ <strong>Errores encontrados:</strong>";
        echo "<ul>";
        foreach ($errors as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
        echo "</div>";
    }
    
    if (!empty($warnings)) {
        echo "<div class='warning'>";
        echo "⚠️ <strong>Advertencias:</strong>";
        echo "<ul>";
        foreach ($warnings as $warning) {
            echo "<li>$warning</li>";
        }
        echo "</ul>";
        echo "</div>";
    }
}

echo "<h2>📝 Próximos Pasos</h2>";
echo "<div class='info'>";
echo "<ol>";
echo "<li><strong>Actualizar contraseñas:</strong> Cambia 'tu_password_aqui' por tu contraseña real de la base de datos</li>";
echo "<li><strong>Cambiar JWT_SECRET:</strong> Genera una clave secreta única y segura</li>";
echo "<li><strong>Verificar CPANEL_PREFIX:</strong> Confirma que el prefijo sea correcto para tu hosting</li>";
echo "<li><strong>Probar conexión:</strong> Ejecuta <code>backend/test-db.php</code> para verificar la conexión a la BD</li>";
echo "<li><strong>Eliminar archivo de prueba:</strong> Elimina este archivo por seguridad después de la verificación</li>";
echo "</ol>";
echo "</div>";

echo "<div class='warning'>";
echo "<strong>⚠️ IMPORTANTE:</strong> Elimina este archivo después de verificar la configuración por seguridad.";
echo "</div>";

echo "</div>";
echo "</body>";
echo "</html>";
?> 