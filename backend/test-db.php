<?php
// Archivo de prueba para verificar la configuración de la base de datos
// Este archivo debe ser eliminado después de la verificación

// Configuración de variables de entorno (simulando .env)
$_ENV['DB_HOST'] = 'localhost';
$_ENV['DB_NAME'] = 'matronapp_db';
$_ENV['DB_USER'] = 'matronapp_user';
$_ENV['DB_PASSWORD'] = 'tu_password_aqui';
$_ENV['CPANEL_PREFIX'] = ''; // Deja vacío si no usas prefijo

// Incluir la clase Database
require_once 'config/Database.php';

echo "<h1>Verificación de Configuración de Base de Datos - MatronApp</h1>";
echo "<hr>";

try {
    // Crear instancia de Database
    $database = new Database();
    
    echo "<h2>1. Configuración Actual:</h2>";
    echo "<ul>";
    echo "<li><strong>Host:</strong> " . ($_ENV['DB_HOST'] ?? 'localhost') . "</li>";
    echo "<li><strong>Base de Datos:</strong> " . ($_ENV['DB_NAME'] ?? 'matronapp_db') . "</li>";
    echo "<li><strong>Usuario:</strong> " . ($_ENV['DB_USER'] ?? 'matronapp_user') . "</li>";
    echo "<li><strong>Prefijo cPanel:</strong> " . ($_ENV['CPANEL_PREFIX'] ?? 'ninguno') . "</li>";
    echo "</ul>";
    
    echo "<h2>2. Test de Conexión:</h2>";
    $testResult = $database->testConnection();
    
    if ($testResult['success']) {
        echo "<div style='background: #d4edda; color: #155724; padding: 10px; border-radius: 5px;'>";
        echo "✅ " . $testResult['message'] . "<br>";
        echo "Base de datos: " . $testResult['database'] . "<br>";
        echo "Host: " . $testResult['host'];
        echo "</div>";
        
        echo "<h2>3. Creación de Tablas:</h2>";
        $createResult = $database->createTables();
        
        if ($createResult['success']) {
            echo "<div style='background: #d4edda; color: #155724; padding: 10px; border-radius: 5px;'>";
            echo "✅ " . $createResult['message'];
            echo "</div>";
            
            echo "<h2>4. Inserción de Datos de Prueba:</h2>";
            $sampleResult = $database->insertSampleData();
            
            if ($sampleResult['success']) {
                echo "<div style='background: #d4edda; color: #155724; padding: 10px; border-radius: 5px;'>";
                echo "✅ " . $sampleResult['message'];
                echo "</div>";
                
                echo "<h2>5. Verificación de Tablas Creadas:</h2>";
                $conn = $database->getConnection();
                $stmt = $conn->query("SHOW TABLES");
                $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
                
                echo "<ul>";
                foreach ($tables as $table) {
                    echo "<li>✅ Tabla: <strong>$table</strong></li>";
                }
                echo "</ul>";
                
                echo "<h2>6. Verificación de Datos:</h2>";
                $stmt = $conn->query("SELECT COUNT(*) as total FROM users");
                $count = $stmt->fetch()['total'];
                echo "<p>Total de usuarios: <strong>$count</strong></p>";
                
                if ($count > 0) {
                    $stmt = $conn->query("SELECT nombre, apellido, email, tipo FROM users LIMIT 5");
                    $users = $stmt->fetchAll();
                    echo "<h3>Usuarios de prueba:</h3>";
                    echo "<ul>";
                    foreach ($users as $user) {
                        echo "<li>{$user['nombre']} {$user['apellido']} - {$user['email']} ({$user['tipo']})</li>";
                    }
                    echo "</ul>";
                }
                
            } else {
                echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px;'>";
                echo "❌ Error: " . $sampleResult['message'];
                echo "</div>";
            }
            
        } else {
            echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px;'>";
            echo "❌ Error: " . $createResult['message'];
            echo "</div>";
        }
        
    } else {
        echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px;'>";
        echo "❌ " . $testResult['message'] . "<br>";
        echo "Base de datos: " . $testResult['database'] . "<br>";
        echo "Host: " . $testResult['host'];
        echo "</div>";
    }
    
} catch (Exception $e) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px;'>";
    echo "❌ Error crítico: " . $e->getMessage();
    echo "</div>";
}

echo "<hr>";
echo "<h2>Instrucciones para cPanel:</h2>";
echo "<ol>";
echo "<li>Ve a <strong>Bases de Datos MySQL</strong> en tu cPanel</li>";
echo "<li>Crea una nueva base de datos llamada <strong>matronapp_db</strong></li>";
echo "<li>Crea un usuario llamado <strong>matronapp_user</strong></li>";
echo "<li>Asigna el usuario a la base de datos con <strong>TODOS LOS PRIVILEGIOS</strong></li>";
echo "<li>Actualiza las variables de entorno en tu servidor con los datos reales</li>";
echo "<li>Ejecuta este archivo nuevamente para verificar la conexión</li>";
echo "</ol>";

echo "<p><strong>⚠️ IMPORTANTE:</strong> Elimina este archivo después de verificar la configuración por seguridad.</p>";
?> 