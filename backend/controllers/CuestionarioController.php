<?php
class CuestionarioController {
    private $db;
    private $jwt;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->jwt = new JWT();
    }
    
    public function submit($data) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        // Validar datos requeridos
        $this->validateCuestionarioData($data);
        
        try {
            $this->db->beginTransaction();
            
            // Insertar cuestionario
            $cuestionarioId = $this->insertCuestionario($userId, $data);
            
            // Crear solicitud automáticamente
            $solicitudId = $this->createSolicitud($userId, $cuestionarioId, $data);
            
            $this->db->commit();
            
            return [
                'success' => true,
                'message' => 'Cuestionario enviado exitosamente',
                'cuestionario_id' => $cuestionarioId,
                'solicitud_id' => $solicitudId
            ];
            
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
    
    private function validateCuestionarioData($data) {
        $required = ['anticonceptivoSolicitado', 'motivoConsulta'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new Exception("El campo $field es requerido");
            }
        }
        
        // Validar campos booleanos
        $boolFields = ['fumadora', 'antecedentesCardio', 'diabetes', 'cancer', 'migranas', 'embarazo', 'lactancia'];
        foreach ($boolFields as $field) {
            if (isset($data[$field]) && !is_bool($data[$field])) {
                $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }
        
        // Validar enums
        $validAlcohol = ['nunca', 'ocasional', 'regular', 'frecuente'];
        if (isset($data['alcohol']) && !in_array($data['alcohol'], $validAlcohol)) {
            throw new Exception('Valor de alcohol inválido');
        }
        
        $validEjercicio = ['sedentario', 'ocasional', 'regular', 'intenso'];
        if (isset($data['ejercicio']) && !in_array($data['ejercicio'], $validEjercicio)) {
            throw new Exception('Valor de ejercicio inválido');
        }
        
        $validCiclo = ['regular', 'irregular', 'ausente'];
        if (isset($data['cicloMenstrual']) && !in_array($data['cicloMenstrual'], $validCiclo)) {
            throw new Exception('Valor de ciclo menstrual inválido');
        }
    }
    
    private function insertCuestionario($userId, $data) {
        $stmt = $this->db->prepare("
            INSERT INTO cuestionarios (
                user_id, anticonceptivos_actuales, alergias, medicamentos,
                fumadora, alcohol, ejercicio, antecedentes_cardio, diabetes,
                cancer, migranas, embarazo, lactancia, ciclo_menstrual
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $userId,
            $data['anticonceptivosActuales'] ?? null,
            json_encode($data['alergias'] ?? []),
            json_encode($data['medicamentos'] ?? []),
            $data['fumadora'] ?? false,
            $data['alcohol'] ?? 'nunca',
            $data['ejercicio'] ?? 'sedentario',
            $data['antecedentesCardio'] ?? false,
            $data['diabetes'] ?? false,
            $data['cancer'] ?? false,
            $data['migranas'] ?? false,
            $data['embarazo'] ?? false,
            $data['lactancia'] ?? false,
            $data['cicloMenstrual'] ?? 'regular'
        ]);
        
        return $this->db->lastInsertId();
    }
    
    private function createSolicitud($userId, $cuestionarioId, $data) {
        // Calcular prioridad basada en factores de riesgo
        $prioridad = $this->calculatePriority($data);
        
        $stmt = $this->db->prepare("
            INSERT INTO solicitudes (
                user_id, cuestionario_id, estado, prioridad,
                anticonceptivo_solicitado, motivo_consulta, precio
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $userId,
            $cuestionarioId,
            'pendiente',
            $prioridad,
            $data['anticonceptivoSolicitado'],
            $data['motivoConsulta'],
            4990.00 // Precio fijo por ahora
        ]);
        
        return $this->db->lastInsertId();
    }
    
    private function calculatePriority($data) {
        $riskFactors = 0;
        
        // Factores de alto riesgo
        if ($data['antecedentesCardio'] ?? false) $riskFactors += 3;
        if ($data['diabetes'] ?? false) $riskFactors += 2;
        if ($data['cancer'] ?? false) $riskFactors += 3;
        if ($data['migranas'] ?? false) $riskFactors += 2;
        if ($data['embarazo'] ?? false) $riskFactors += 3;
        
        // Factores de riesgo medio
        if ($data['fumadora'] ?? false) $riskFactors += 1;
        if (($data['alcohol'] ?? 'nunca') === 'frecuente') $riskFactors += 1;
        
        // Determinar prioridad
        if ($riskFactors >= 5) return 'alta';
        if ($riskFactors >= 2) return 'media';
        return 'baja';
    }
    
    public function getCuestionario($id) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        $stmt = $this->db->prepare("
            SELECT c.*, s.estado as solicitud_estado, s.id as solicitud_id
            FROM cuestionarios c
            LEFT JOIN solicitudes s ON c.id = s.cuestionario_id
            WHERE c.id = ? AND c.user_id = ?
        ");
        $stmt->execute([$id, $userId]);
        $cuestionario = $stmt->fetch();
        
        if (!$cuestionario) {
            throw new Exception('Cuestionario no encontrado');
        }
        
        // Decodificar JSON fields
        $cuestionario['alergias'] = json_decode($cuestionario['alergias'], true);
        $cuestionario['medicamentos'] = json_decode($cuestionario['medicamentos'], true);
        
        return [
            'success' => true,
            'cuestionario' => $cuestionario
        ];
    }
    
    public function getUserCuestionarios() {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        $stmt = $this->db->prepare("
            SELECT c.*, s.estado as solicitud_estado, s.id as solicitud_id
            FROM cuestionarios c
            LEFT JOIN solicitudes s ON c.id = s.cuestionario_id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        ");
        $stmt->execute([$userId]);
        $cuestionarios = $stmt->fetchAll();
        
        // Decodificar JSON fields
        foreach ($cuestionarios as &$cuestionario) {
            $cuestionario['alergias'] = json_decode($cuestionario['alergias'], true);
            $cuestionario['medicamentos'] = json_decode($cuestionario['medicamentos'], true);
        }
        
        return [
            'success' => true,
            'cuestionarios' => $cuestionarios
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