<?php
class PagoController {
    private $db;
    private $jwt;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->jwt = new JWT();
    }
    
    public function procesarPago($data) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        // Validar datos requeridos
        if (empty($data['solicitud_id']) || empty($data['monto'])) {
            throw new Exception('Solicitud ID y monto son requeridos');
        }
        
        // Verificar que la solicitud pertenece al usuario
        $stmt = $this->db->prepare("
            SELECT id, precio, estado 
            FROM solicitudes 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$data['solicitud_id'], $userId]);
        $solicitud = $stmt->fetch();
        
        if (!$solicitud) {
            throw new Exception('Solicitud no encontrada');
        }
        
        // Verificar que el monto coincide
        if ((float)$data['monto'] !== (float)$solicitud['precio']) {
            throw new Exception('El monto no coincide con el precio de la solicitud');
        }
        
        // Verificar si ya existe un pago para esta solicitud
        $stmt = $this->db->prepare("
            SELECT id, estado 
            FROM pagos 
            WHERE solicitud_id = ?
        ");
        $stmt->execute([$data['solicitud_id']]);
        $pagoExistente = $stmt->fetch();
        
        if ($pagoExistente && $pagoExistente['estado'] === 'completado') {
            throw new Exception('Esta solicitud ya ha sido pagada');
        }
        
        try {
            $this->db->beginTransaction();
            
            // Crear registro de pago
            $stmt = $this->db->prepare("
                INSERT INTO pagos (
                    solicitud_id, monto, metodo_pago, estado, 
                    transaction_id, datos_pago
                ) VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $transactionId = $this->generateTransactionId();
            $datosPago = json_encode([
                'metodo' => $data['metodo_pago'] ?? 'webpay',
                'timestamp' => date('Y-m-d H:i:s'),
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ]);
            
            $stmt->execute([
                $data['solicitud_id'],
                $data['monto'],
                $data['metodo_pago'] ?? 'webpay',
                'pendiente',
                $transactionId,
                $datosPago
            ]);
            
            $pagoId = $this->db->lastInsertId();
            
            // Simular procesamiento de pago (en producción aquí iría la integración real)
            $resultadoPago = $this->simularPagoWebPay($data, $transactionId);
            
            if ($resultadoPago['success']) {
                // Actualizar estado del pago
                $stmt = $this->db->prepare("
                    UPDATE pagos 
                    SET estado = 'completado', datos_pago = ? 
                    WHERE id = ?
                ");
                
                $datosPagoCompleto = json_encode(array_merge(
                    json_decode($datosPago, true),
                    $resultadoPago['datos']
                ));
                
                $stmt->execute([$datosPagoCompleto, $pagoId]);
                
                $this->db->commit();
                
                return [
                    'success' => true,
                    'message' => 'Pago procesado exitosamente',
                    'pago_id' => $pagoId,
                    'transaction_id' => $transactionId,
                    'redirect_url' => "/pago-exitoso?id=$pagoId"
                ];
                
            } else {
                // Actualizar estado del pago como fallido
                $stmt = $this->db->prepare("
                    UPDATE pagos 
                    SET estado = 'fallido', datos_pago = ? 
                    WHERE id = ?
                ");
                
                $datosPagoFallido = json_encode(array_merge(
                    json_decode($datosPago, true),
                    ['error' => $resultadoPago['error']]
                ));
                
                $stmt->execute([$datosPagoFallido, $pagoId]);
                
                $this->db->commit();
                
                throw new Exception('Error procesando el pago: ' . $resultadoPago['error']);
            }
            
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
    
    public function webhook($data) {
        // Validar webhook (en producción validar firma/token)
        if (empty($data['transaction_id']) || empty($data['status'])) {
            throw new Exception('Datos de webhook inválidos');
        }
        
        // Buscar el pago por transaction_id
        $stmt = $this->db->prepare("
            SELECT id, estado, solicitud_id 
            FROM pagos 
            WHERE transaction_id = ?
        ");
        $stmt->execute([$data['transaction_id']]);
        $pago = $stmt->fetch();
        
        if (!$pago) {
            throw new Exception('Pago no encontrado');
        }
        
        // Actualizar estado según webhook
        $nuevoEstado = $this->mapearEstadoWebhook($data['status']);
        
        if ($nuevoEstado !== $pago['estado']) {
            $stmt = $this->db->prepare("
                UPDATE pagos 
                SET estado = ?, datos_pago = JSON_SET(datos_pago, '$.webhook', ?)
                WHERE id = ?
            ");
            
            $stmt->execute([
                $nuevoEstado,
                json_encode($data),
                $pago['id']
            ]);
            
            // Si el pago fue completado, notificar
            if ($nuevoEstado === 'completado') {
                $this->notificarPagoCompletado($pago['solicitud_id']);
            }
        }
        
        return [
            'success' => true,
            'message' => 'Webhook procesado correctamente'
        ];
    }
    
    public function getPagosBySolicitud($solicitudId) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        // Verificar que la solicitud pertenece al usuario
        $stmt = $this->db->prepare("
            SELECT id FROM solicitudes 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$solicitudId, $userId]);
        if (!$stmt->fetch()) {
            throw new Exception('Solicitud no encontrada');
        }
        
        $stmt = $this->db->prepare("
            SELECT * FROM pagos 
            WHERE solicitud_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$solicitudId]);
        
        return [
            'success' => true,
            'pagos' => $stmt->fetchAll()
        ];
    }
    
    public function getPagoById($id) {
        $token = $this->getBearerToken();
        if (!$token) {
            throw new Exception('Token de autorización requerido');
        }
        
        $decoded = $this->jwt->decode($token);
        $userId = $decoded['user_id'];
        
        $stmt = $this->db->prepare("
            SELECT p.*, s.user_id
            FROM pagos p
            JOIN solicitudes s ON p.solicitud_id = s.id
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        $pago = $stmt->fetch();
        
        if (!$pago) {
            throw new Exception('Pago no encontrado');
        }
        
        // Verificar permisos
        if ($pago['user_id'] !== $userId && $decoded['tipo'] !== 'matrona') {
            throw new Exception('No tienes permisos para ver este pago');
        }
        
        return [
            'success' => true,
            'pago' => $pago
        ];
    }
    
    private function generateTransactionId() {
        return 'TXN_' . date('YmdHis') . '_' . strtoupper(substr(md5(uniqid()), 0, 8));
    }
    
    private function simularPagoWebPay($data, $transactionId) {
        // Simulación de pago - en producción aquí iría la integración real con WebPay
        // Por ahora simulamos que el 95% de los pagos son exitosos
        
        $exito = rand(1, 100) <= 95;
        
        if ($exito) {
            return [
                'success' => true,
                'datos' => [
                    'authorization_code' => 'AUTH_' . strtoupper(substr(md5(uniqid()), 0, 6)),
                    'card_number' => '**** **** **** ' . rand(1000, 9999),
                    'response_code' => 0,
                    'payment_type' => 'VD', // Venta Débito
                    'amount' => $data['monto'],
                    'installments' => 0,
                    'commerce_code' => '597055555532',
                    'buy_order' => $transactionId
                ]
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Transacción rechazada por el banco'
            ];
        }
    }
    
    private function mapearEstadoWebhook($status) {
        $mapping = [
            'AUTHORIZED' => 'completado',
            'FAILED' => 'fallido',
            'NULLIFIED' => 'reembolsado',
            'PARTIALLY_NULLIFIED' => 'reembolsado',
            'CAPTURED' => 'completado'
        ];
        
        return $mapping[$status] ?? 'pendiente';
    }
    
    private function notificarPagoCompletado($solicitudId) {
        // Aquí se podría enviar email, SMS, etc.
        // Por ahora solo log
        error_log("Pago completado para solicitud ID: $solicitudId");
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