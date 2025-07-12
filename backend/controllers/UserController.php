<?php
class UserController {
    private $db;
    private $jwt;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->jwt = new JWT();
    }
    
    public function getProfile() {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        $stmt = $this->db->prepare("
            SELECT id, nombre, apellido, rut, email, telefono, tipo, 
                   perfil_completo, fecha_registro, created_at, updated_at
            FROM users 
            WHERE id = ? AND activo = 1
        ");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            throw new Exception('Usuario no encontrado');
        }
        
        return [
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'nombre' => $user['nombre'],
                'apellido' => $user['apellido'],
                'rut' => $user['rut'],
                'email' => $user['email'],
                'telefono' => $user['telefono'],
                'tipo' => $user['tipo'],
                'perfilCompleto' => (bool)$user['perfil_completo'],
                'fechaRegistro' => $user['fecha_registro'],
                'createdAt' => $user['created_at'],
                'updatedAt' => $user['updated_at']
            ]
        ];
    }
    
    public function updateProfile($data) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        // Campos permitidos para actualizar
        $allowedFields = ['nombre', 'apellido', 'telefono'];
        $updateFields = [];
        $updateValues = [];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                $updateFields[] = "$field = ?";
                $updateValues[] = $data[$field];
            }
        }
        
        if (empty($updateFields)) {
            throw new Exception('No hay campos válidos para actualizar');
        }
        
        // Verificar si el perfil está completo
        $perfilCompleto = isset($data['nombre']) && isset($data['apellido']) && isset($data['telefono']);
        if ($perfilCompleto) {
            $updateFields[] = "perfil_completo = ?";
            $updateValues[] = 1;
        }
        
        $updateFields[] = "updated_at = CURRENT_TIMESTAMP";
        $updateValues[] = $userId;
        
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($updateValues);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception('No se pudo actualizar el perfil');
        }
        
        return [
            'success' => true,
            'message' => 'Perfil actualizado correctamente'
        ];
    }
    
    public function changePassword($data) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        if (empty($data['current_password']) || empty($data['new_password'])) {
            throw new Exception('Contraseña actual y nueva contraseña son requeridas');
        }
        
        if (strlen($data['new_password']) < 6) {
            throw new Exception('La nueva contraseña debe tener al menos 6 caracteres');
        }
        
        // Verificar contraseña actual
        $stmt = $this->db->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($data['current_password'], $user['password'])) {
            throw new Exception('Contraseña actual incorrecta');
        }
        
        // Actualizar contraseña
        $hashedPassword = password_hash($data['new_password'], PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("
            UPDATE users 
            SET password = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        ");
        $stmt->execute([$hashedPassword, $userId]);
        
        return [
            'success' => true,
            'message' => 'Contraseña actualizada correctamente'
        ];
    }
    
    public function getUserStats() {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        // Obtener estadísticas del usuario
        $stmt = $this->db->prepare("
            SELECT 
                (SELECT COUNT(*) FROM solicitudes WHERE user_id = ?) as total_solicitudes,
                (SELECT COUNT(*) FROM solicitudes WHERE user_id = ? AND estado = 'aprobada') as solicitudes_aprobadas,
                (SELECT COUNT(*) FROM recetas r 
                 JOIN solicitudes s ON r.solicitud_id = s.id 
                 WHERE s.user_id = ? AND r.activa = 1) as recetas_activas,
                (SELECT SUM(monto) FROM pagos p 
                 JOIN solicitudes s ON p.solicitud_id = s.id 
                 WHERE s.user_id = ? AND p.estado = 'completado') as total_pagado
        ");
        $stmt->execute([$userId, $userId, $userId, $userId]);
        $stats = $stmt->fetch();
        
        return [
            'success' => true,
            'stats' => [
                'totalSolicitudes' => (int)$stats['total_solicitudes'],
                'solicitudesAprobadas' => (int)$stats['solicitudes_aprobadas'],
                'recetasActivas' => (int)$stats['recetas_activas'],
                'totalPagado' => (float)$stats['total_pagado']
            ]
        ];
    }
    
    private function getBearerToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
        return null;
    }
}
?> 