<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Cargar variables de entorno
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
    __DIR__ . '/../.env',           // Un nivel arriba (raíz del proyecto)
    __DIR__ . '/../env.production', // Archivo de producción
    __DIR__ . '/../../.env',        // Dos niveles arriba
    __DIR__ . '/../../../.env',     // Tres niveles arriba
    __DIR__ . '/.env'               // En el directorio backend
];

foreach ($possiblePaths as $path) {
    if (loadEnv($path)) {
        $envLoaded = true;
        error_log("MatronApp: Variables de entorno cargadas desde: $path");
        break;
    }
}

// Si no se encontró .env, usar valores por defecto
if (!$envLoaded) {
    error_log("MatronApp: No se encontró archivo .env, usando valores por defecto");
    
    // Variables de base de datos
    $_ENV['DB_HOST'] = $_ENV['DB_HOST'] ?? 'localhost';
    $_ENV['DB_NAME'] = $_ENV['DB_NAME'] ?? 'matronapp_db';
    $_ENV['DB_USER'] = $_ENV['DB_USER'] ?? 'matronapp_user';
    $_ENV['DB_PASSWORD'] = $_ENV['DB_PASSWORD'] ?? '';
    $_ENV['CPANEL_PREFIX'] = $_ENV['CPANEL_PREFIX'] ?? '';
    
    // JWT
    $_ENV['JWT_SECRET'] = $_ENV['JWT_SECRET'] ?? 'matronapp_secret_key_2024';
    
    // API
    $_ENV['REACT_APP_API_URL'] = $_ENV['REACT_APP_API_URL'] ?? 'https://cuiden.cl/api';
    $_ENV['REACT_APP_ENVIRONMENT'] = $_ENV['REACT_APP_ENVIRONMENT'] ?? 'production';
    
    // Configuración adicional
    $_ENV['APP_DEBUG'] = $_ENV['APP_DEBUG'] ?? 'false';
    $_ENV['APP_TIMEZONE'] = $_ENV['APP_TIMEZONE'] ?? 'America/Santiago';
    $_ENV['UPLOAD_MAX_SIZE'] = $_ENV['UPLOAD_MAX_SIZE'] ?? '10485760';
    $_ENV['SESSION_LIFETIME'] = $_ENV['SESSION_LIFETIME'] ?? '1440';
}

// Configurar zona horaria
date_default_timezone_set($_ENV['APP_TIMEZONE'] ?? 'America/Santiago');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Autoload de clases
spl_autoload_register(function ($class) {
    $directories = ['config', 'controllers', 'models', 'utils'];
    
    foreach ($directories as $dir) {
        $file = __DIR__ . '/' . $dir . '/' . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Obtener la ruta solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api/', '', $path);
$path = trim($path, '/');

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Obtener datos de entrada
$input = json_decode(file_get_contents('php://input'), true);
if ($input === null && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    $input = $_POST;
}

// Función para responder con JSON
function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Función para manejar errores
function handleError($message, $status = 500) {
    respond([
        'success' => false,
        'error' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ], $status);
}

try {
    // Rutas de la API
    switch ($path) {
        // Rutas de autenticación
        case 'auth/login':
            if ($method !== 'POST') {
                handleError('Método no permitido', 405);
            }
            $controller = new AuthController();
            $result = $controller->login($input);
            respond($result);
            break;
            
        case 'auth/register':
            if ($method !== 'POST') {
                handleError('Método no permitido', 405);
            }
            $controller = new AuthController();
            $result = $controller->register($input);
            respond($result);
            break;
            
        case 'auth/logout':
            if ($method !== 'POST') {
                handleError('Método no permitido', 405);
            }
            $controller = new AuthController();
            $result = $controller->logout();
            respond($result);
            break;
            
        // Rutas de usuarios
        case 'users/profile':
            $controller = new UserController();
            if ($method === 'GET') {
                $result = $controller->getProfile();
            } elseif ($method === 'PUT') {
                $result = $controller->updateProfile($input);
            } else {
                handleError('Método no permitido', 405);
            }
            respond($result);
            break;
            
        // Rutas de cuestionarios
        case 'cuestionario/submit':
            if ($method !== 'POST') {
                handleError('Método no permitido', 405);
            }
            $controller = new CuestionarioController();
            $result = $controller->submit($input);
            respond($result);
            break;
            
        // Rutas de solicitudes
        case 'solicitudes':
            $controller = new SolicitudController();
            if ($method === 'GET') {
                $result = $controller->getAll();
            } elseif ($method === 'POST') {
                $result = $controller->create($input);
            } else {
                handleError('Método no permitido', 405);
            }
            respond($result);
            break;
            
        case (preg_match('/^solicitudes\/(\d+)$/', $path, $matches) ? true : false):
            $id = $matches[1];
            $controller = new SolicitudController();
            if ($method === 'GET') {
                $result = $controller->getById($id);
            } elseif ($method === 'PUT') {
                $result = $controller->update($id, $input);
            } elseif ($method === 'DELETE') {
                $result = $controller->delete($id);
            } else {
                handleError('Método no permitido', 405);
            }
            respond($result);
            break;
            
        // Rutas de pagos
        case 'pagos':
            if ($method !== 'POST') {
                handleError('Método no permitido', 405);
            }
            $controller = new PagoController();
            $result = $controller->procesarPago($input);
            respond($result);
            break;
            
        case 'pagos/webhook':
            if ($method !== 'POST') {
                handleError('Método no permitido', 405);
            }
            $controller = new PagoController();
            $result = $controller->webhook($input);
            respond($result);
            break;
            
        // Ruta de estado de la API
        case 'health':
        case 'status':
            respond([
                'success' => true,
                'message' => 'MatronApp API funcionando correctamente',
                'version' => '1.0.0',
                'timestamp' => date('Y-m-d H:i:s'),
                'environment' => 'production'
            ]);
            break;
            
        // Ruta por defecto
        case '':
            respond([
                'success' => true,
                'message' => 'Bienvenido a MatronApp API',
                'version' => '1.0.0',
                'endpoints' => [
                    'POST /auth/login' => 'Iniciar sesión',
                    'POST /auth/register' => 'Registrar usuario',
                    'GET /users/profile' => 'Obtener perfil',
                    'POST /cuestionario/submit' => 'Enviar cuestionario',
                    'GET /solicitudes' => 'Obtener solicitudes',
                    'POST /solicitudes' => 'Crear solicitud',
                    'POST /pagos' => 'Procesar pago',
                    'GET /health' => 'Estado de la API'
                ]
            ]);
            break;
            
        default:
            handleError('Endpoint no encontrado: ' . $path, 404);
    }
    
} catch (Exception $e) {
    error_log('MatronApp API Error: ' . $e->getMessage());
    handleError('Error interno del servidor: ' . $e->getMessage(), 500);
}
?> 