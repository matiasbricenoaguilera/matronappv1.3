<?php
class AuthController {
    private $db;
    private $jwt;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->jwt = new JWT();
    }
    
    public function login($data) {
        // Validar datos de entrada
        if (empty($data['email']) || empty($data['password'])) {
            throw new Exception('Email y contraseña son requeridos');
        }
        
        $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
        if (!$email) {
            throw new Exception('Email inválido');
        }
        
        // Buscar usuario en la base de datos
        $stmt = $this->db->prepare("
            SELECT id, nombre, apellido, rut, email, password, tipo, perfil_completo, activo 
            FROM users 
            WHERE email = ? AND activo = 1
        ");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            throw new Exception('Usuario no encontrado');
        }
        
        // Verificar contraseña
        if (!password_verify($data['password'], $user['password'])) {
            throw new Exception('Contraseña incorrecta');
        }
        
        // Generar token JWT
        $token = $this->jwt->generate([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'tipo' => $user['tipo']
        ]);
        
        // Registrar último login
        $stmt = $this->db->prepare("
            UPDATE users 
            SET updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        ");
        $stmt->execute([$user['id']]);
        
        return [
            'success' => true,
            'message' => 'Login exitoso',
            'user' => [
                'id' => $user['id'],
                'nombre' => $user['nombre'],
                'apellido' => $user['apellido'],
                'rut' => $user['rut'],
                'email' => $user['email'],
                'tipo' => $user['tipo'],
                'perfilCompleto' => (bool)$user['perfil_completo']
            ],
            'token' => $token
        ];
    }
    
    public function register($data) {
        // Validar datos requeridos
        $required = ['nombre', 'apellido', 'rut', 'email', 'password'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new Exception("El campo $field es requerido");
            }
        }
        
        // Validar email
        $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
        if (!$email) {
            throw new Exception('Email inválido');
        }
        
        // Validar RUT (básico)
        if (!$this->validarRUT($data['rut'])) {
            throw new Exception('RUT inválido');
        }
        
        // Validar contraseña
        if (strlen($data['password']) < 6) {
            throw new Exception('La contraseña debe tener al menos 6 caracteres');
        }
        
        // Verificar si el email ya existe
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            throw new Exception('El email ya está registrado');
        }
        
        // Verificar si el RUT ya existe
        $stmt = $this->db->prepare("SELECT id FROM users WHERE rut = ?");
        $stmt->execute([$data['rut']]);
        if ($stmt->fetch()) {
            throw new Exception('El RUT ya está registrado');
        }
        
        // Crear hash de la contraseña
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Insertar usuario
        $stmt = $this->db->prepare("
            INSERT INTO users (nombre, apellido, rut, email, password, telefono, tipo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['nombre'],
            $data['apellido'],
            $data['rut'],
            $email,
            $hashedPassword,
            $data['telefono'] ?? null,
            $data['tipo'] ?? 'paciente'
        ]);
        
        $userId = $this->db->lastInsertId();
        
        // Generar token JWT
        $token = $this->jwt->generate([
            'user_id' => $userId,
            'email' => $email,
            'tipo' => $data['tipo'] ?? 'paciente'
        ]);
        
        return [
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'user' => [
                'id' => $userId,
                'nombre' => $data['nombre'],
                'apellido' => $data['apellido'],
                'rut' => $data['rut'],
                'email' => $email,
                'tipo' => $data['tipo'] ?? 'paciente',
                'perfilCompleto' => false
            ],
            'token' => $token
        ];
    }
    
    public function logout() {
        // En un sistema real, aquí invalidarías el token
        // Por ahora, solo devolvemos confirmación
        return [
            'success' => true,
            'message' => 'Logout exitoso'
        ];
    }
    
    public function validateToken($token) {
        try {
            $decoded = $this->jwt->decode($token);
            
            // Verificar si el usuario aún existe y está activo
            $stmt = $this->db->prepare("
                SELECT id, nombre, apellido, rut, email, tipo, perfil_completo 
                FROM users 
                WHERE id = ? AND activo = 1
            ");
            $stmt->execute([$decoded['user_id']]);
            $user = $stmt->fetch();
            
            if (!$user) {
                throw new Exception('Usuario no válido');
            }
            
            return [
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'nombre' => $user['nombre'],
                    'apellido' => $user['apellido'],
                    'rut' => $user['rut'],
                    'email' => $user['email'],
                    'tipo' => $user['tipo'],
                    'perfilCompleto' => (bool)$user['perfil_completo']
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Token inválido'
            ];
        }
    }
    
    private function validarRUT($rut) {
        // Validación básica de RUT chileno
        $rut = preg_replace('/[^0-9kK]/', '', $rut);
        
        if (strlen($rut) < 8 || strlen($rut) > 9) {
            return false;
        }
        
        $dv = strtoupper(substr($rut, -1));
        $numero = substr($rut, 0, -1);
        
        $suma = 0;
        $multiplo = 2;
        
        for ($i = strlen($numero) - 1; $i >= 0; $i--) {
            $suma += $numero[$i] * $multiplo;
            $multiplo = $multiplo == 7 ? 2 : $multiplo + 1;
        }
        
        $resto = $suma % 11;
        $dvCalculado = $resto == 0 ? '0' : ($resto == 1 ? 'K' : (string)(11 - $resto));
        
        return $dv === $dvCalculado;
    }
}
?> 