<?php
class SolicitudController {
    private $db;
    private $jwt;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->jwt = new JWT();
    }
    
    public function getAll() {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        $userType = $decoded['tipo'];
        
        if ($userType === 'matrona') {
            // Matronas pueden ver todas las solicitudes
            $stmt = $this->db->prepare("
                SELECT s.*, u.nombre, u.apellido, u.email, u.rut,
                       c.anticonceptivos_actuales, c.alergias, c.medicamentos
                FROM solicitudes s
                JOIN users u ON s.user_id = u.id
                JOIN cuestionarios c ON s.cuestionario_id = c.id
                ORDER BY 
                    CASE s.prioridad 
                        WHEN 'alta' THEN 1 
                        WHEN 'media' THEN 2 
                        WHEN 'baja' THEN 3 
                    END,
                    s.fecha_solicitud DESC
            ");
            $stmt->execute();
        } else {
            // Pacientes solo ven sus propias solicitudes
            $stmt = $this->db->prepare("
                SELECT s.*, u.nombre, u.apellido, u.email, u.rut,
                       c.anticonceptivos_actuales, c.alergias, c.medicamentos
                FROM solicitudes s
                JOIN users u ON s.user_id = u.id
                JOIN cuestionarios c ON s.cuestionario_id = c.id
                WHERE s.user_id = ?
                ORDER BY s.fecha_solicitud DESC
            ");
            $stmt->execute([$userId]);
        }
        
        $solicitudes = $stmt->fetchAll();
        
        // Decodificar JSON fields
        foreach ($solicitudes as &$solicitud) {
            $solicitud['alergias'] = json_decode($solicitud['alergias'], true);
            $solicitud['medicamentos'] = json_decode($solicitud['medicamentos'], true);
        }
        
        return [
            'success' => true,
            'solicitudes' => $solicitudes
        ];
    }
    
    public function getById($id) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        $userType = $decoded['tipo'];
        
        $sql = "
            SELECT s.*, u.nombre, u.apellido, u.email, u.rut, u.telefono,
                   c.*, m.nombre as matrona_nombre, m.apellido as matrona_apellido
            FROM solicitudes s
            JOIN users u ON s.user_id = u.id
            JOIN cuestionarios c ON s.cuestionario_id = c.id
            LEFT JOIN users m ON s.matrona_id = m.id
            WHERE s.id = ?
        ";
        
        if ($userType !== 'matrona') {
            $sql .= " AND s.user_id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id, $userId]);
        } else {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
        }
        
        $solicitud = $stmt->fetch();
        
        if (!$solicitud) {
            throw new Exception('Solicitud no encontrada');
        }
        
        // Decodificar JSON fields
        $solicitud['alergias'] = json_decode($solicitud['alergias'], true);
        $solicitud['medicamentos'] = json_decode($solicitud['medicamentos'], true);
        
        return [
            'success' => true,
            'solicitud' => $solicitud
        ];
    }
    
    public function create($data) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        // Validar datos requeridos
        if (empty($data['cuestionario_id']) || empty($data['anticonceptivo_solicitado'])) {
            throw new Exception('Cuestionario ID y anticonceptivo solicitado son requeridos');
        }
        
        // Verificar que el cuestionario pertenece al usuario
        $stmt = $this->db->prepare("SELECT id FROM cuestionarios WHERE id = ? AND user_id = ?");
        $stmt->execute([$data['cuestionario_id'], $userId]);
        if (!$stmt->fetch()) {
            throw new Exception('Cuestionario no válido');
        }
        
        $stmt = $this->db->prepare("
            INSERT INTO solicitudes (
                user_id, cuestionario_id, anticonceptivo_solicitado, 
                motivo_consulta, precio, prioridad
            ) VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $userId,
            $data['cuestionario_id'],
            $data['anticonceptivo_solicitado'],
            $data['motivo_consulta'] ?? '',
            $data['precio'] ?? 4990.00,
            $data['prioridad'] ?? 'media'
        ]);
        
        $solicitudId = $this->db->lastInsertId();
        
        return [
            'success' => true,
            'message' => 'Solicitud creada exitosamente',
            'solicitud_id' => $solicitudId
        ];
    }
    
    public function update($id, $data) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        $userType = $decoded['tipo'];
        
        // Solo las matronas pueden actualizar solicitudes
        if ($userType !== 'matrona') {
            throw new Exception('No tienes permisos para actualizar solicitudes');
        }
        
        // Verificar que la solicitud existe
        $stmt = $this->db->prepare("SELECT id FROM solicitudes WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            throw new Exception('Solicitud no encontrada');
        }
        
        $allowedFields = ['estado', 'matrona_id', 'notas_matrona', 'fecha_revision'];
        $updateFields = [];
        $updateValues = [];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                if ($field === 'estado') {
                    $validStates = ['pendiente', 'en_revision', 'aprobada', 'rechazada'];
                    if (!in_array($data[$field], $validStates)) {
                        throw new Exception('Estado inválido');
                    }
                }
                
                $updateFields[] = "$field = ?";
                $updateValues[] = $data[$field];
            }
        }
        
        if (empty($updateFields)) {
            throw new Exception('No hay campos válidos para actualizar');
        }
        
        // Asignar matrona automáticamente si no está asignada
        if (isset($data['estado']) && $data['estado'] === 'en_revision') {
            $updateFields[] = "matrona_id = ?";
            $updateValues[] = $userId;
            $updateFields[] = "fecha_revision = CURRENT_TIMESTAMP";
        }
        
        $updateFields[] = "updated_at = CURRENT_TIMESTAMP";
        $updateValues[] = $id;
        
        $sql = "UPDATE solicitudes SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($updateValues);
        
        // Si la solicitud fue aprobada, crear receta
        if (isset($data['estado']) && $data['estado'] === 'aprobada') {
            $this->createReceta($id, $data);
        }
        
        return [
            'success' => true,
            'message' => 'Solicitud actualizada exitosamente'
        ];
    }
    
    public function delete($id) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        $userType = $decoded['tipo'];
        
        // Verificar permisos
        if ($userType === 'matrona') {
            $stmt = $this->db->prepare("SELECT id FROM solicitudes WHERE id = ?");
            $stmt->execute([$id]);
        } else {
            $stmt = $this->db->prepare("SELECT id FROM solicitudes WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
        }
        
        if (!$stmt->fetch()) {
            throw new Exception('Solicitud no encontrada o sin permisos');
        }
        
        $stmt = $this->db->prepare("DELETE FROM solicitudes WHERE id = ?");
        $stmt->execute([$id]);
        
        return [
            'success' => true,
            'message' => 'Solicitud eliminada exitosamente'
        ];
    }
    
    private function createReceta($solicitudId, $data) {
        if (empty($data['medicamento']) || empty($data['posologia'])) {
            throw new Exception('Medicamento y posología son requeridos para crear la receta');
        }
        
        $stmt = $this->db->prepare("
            INSERT INTO recetas (
                solicitud_id, medicamento, posologia, indicaciones, 
                fecha_vencimiento
            ) VALUES (?, ?, ?, ?, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY))
        ");
        
        $stmt->execute([
            $solicitudId,
            $data['medicamento'],
            $data['posologia'],
            $data['indicaciones'] ?? ''
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function getMatronaPendientes() {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userType = $decoded['tipo'];
        
        if ($userType !== 'matrona') {
            throw new Exception('Solo las matronas pueden acceder a esta función');
        }
        
        $stmt = $this->db->prepare("
            SELECT s.*, u.nombre, u.apellido, u.email, u.rut
            FROM solicitudes s
            JOIN users u ON s.user_id = u.id
            WHERE s.estado IN ('pendiente', 'en_revision')
            ORDER BY 
                CASE s.prioridad 
                    WHEN 'alta' THEN 1 
                    WHEN 'media' THEN 2 
                    WHEN 'baja' THEN 3 
                END,
                s.fecha_solicitud ASC
        ");
        $stmt->execute();
        
        return [
            'success' => true,
            'solicitudes' => $stmt->fetchAll()
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