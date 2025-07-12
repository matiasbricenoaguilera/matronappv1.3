<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;
    
    public function __construct() {
        // Configuración desde variables de entorno o valores por defecto
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->db_name = $_ENV['DB_NAME'] ?? 'matronapp_db';
        $this->username = $_ENV['DB_USER'] ?? 'matronapp_user';
        $this->password = $_ENV['DB_PASSWORD'] ?? '';
        
        // Para cPanel, a menudo necesitas prefijo en el nombre de la base de datos
        $cpanel_prefix = $_ENV['CPANEL_PREFIX'] ?? '';
        if (!empty($cpanel_prefix)) {
            $this->db_name = $cpanel_prefix . '_' . $this->db_name;
            $this->username = $cpanel_prefix . '_' . $this->username;
        }
    }
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];
            
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch(PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            throw new Exception("Error de conexión a la base de datos");
        }
        
        return $this->conn;
    }
    
    public function testConnection() {
        try {
            $conn = $this->getConnection();
            if ($conn) {
                return [
                    'success' => true,
                    'message' => 'Conexión exitosa a la base de datos',
                    'database' => $this->db_name,
                    'host' => $this->host
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error de conexión: ' . $e->getMessage(),
                'database' => $this->db_name,
                'host' => $this->host
            ];
        }
    }
    
    public function createTables() {
        $conn = $this->getConnection();
        
        $sql = "
        -- Tabla de usuarios
        CREATE TABLE IF NOT EXISTS users (
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
        
        -- Tabla de cuestionarios médicos
        CREATE TABLE IF NOT EXISTS cuestionarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            anticonceptivos_actuales TEXT,
            alergias JSON,
            medicamentos JSON,
            fumadora BOOLEAN DEFAULT FALSE,
            alcohol ENUM('nunca', 'ocasional', 'regular', 'frecuente') DEFAULT 'nunca',
            ejercicio ENUM('sedentario', 'ocasional', 'regular', 'intenso') DEFAULT 'sedentario',
            antecedentes_cardio BOOLEAN DEFAULT FALSE,
            diabetes BOOLEAN DEFAULT FALSE,
            cancer BOOLEAN DEFAULT FALSE,
            migranas BOOLEAN DEFAULT FALSE,
            embarazo BOOLEAN DEFAULT FALSE,
            lactancia BOOLEAN DEFAULT FALSE,
            ciclo_menstrual ENUM('regular', 'irregular', 'ausente') DEFAULT 'regular',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        -- Tabla de solicitudes
        CREATE TABLE IF NOT EXISTS solicitudes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            cuestionario_id INT NOT NULL,
            matrona_id INT,
            estado ENUM('pendiente', 'en_revision', 'aprobada', 'rechazada') DEFAULT 'pendiente',
            prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
            anticonceptivo_solicitado VARCHAR(100),
            motivo_consulta TEXT,
            precio DECIMAL(10,2) DEFAULT 4990.00,
            fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_revision TIMESTAMP NULL,
            tiempo_limite TIMESTAMP NULL,
            notas_matrona TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (cuestionario_id) REFERENCES cuestionarios(id) ON DELETE CASCADE,
            FOREIGN KEY (matrona_id) REFERENCES users(id) ON DELETE SET NULL
        );
        
        -- Tabla de recetas
        CREATE TABLE IF NOT EXISTS recetas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            solicitud_id INT NOT NULL,
            medicamento VARCHAR(100) NOT NULL,
            posologia TEXT NOT NULL,
            indicaciones TEXT,
            fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_vencimiento DATE,
            pdf_path VARCHAR(255),
            activa BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE
        );
        
        -- Tabla de pagos
        CREATE TABLE IF NOT EXISTS pagos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            solicitud_id INT NOT NULL,
            monto DECIMAL(10,2) NOT NULL,
            metodo_pago VARCHAR(50),
            estado ENUM('pendiente', 'completado', 'fallido', 'reembolsado') DEFAULT 'pendiente',
            transaction_id VARCHAR(255),
            fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            datos_pago JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE
        );
        ";
        
        try {
            $conn->exec($sql);
            return ['success' => true, 'message' => 'Tablas creadas exitosamente'];
        } catch (PDOException $e) {
            error_log("Error creando tablas: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error creando tablas: ' . $e->getMessage()];
        }
    }
    
    public function insertSampleData() {
        $conn = $this->getConnection();
        
        try {
            // Insertar matrona de prueba
            $stmt = $conn->prepare("
                INSERT IGNORE INTO users (nombre, apellido, rut, email, password, tipo) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $hashedPassword = password_hash('matrona123', PASSWORD_DEFAULT);
            $stmt->execute([
                'Patricia', 
                'Morales', 
                '98765432-1', 
                'patricia.morales@matronapp.cl', 
                $hashedPassword, 
                'matrona'
            ]);
            
            return ['success' => true, 'message' => 'Datos de prueba insertados'];
            
        } catch (PDOException $e) {
            error_log("Error insertando datos de prueba: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error insertando datos de prueba'];
        }
    }
}
?> 