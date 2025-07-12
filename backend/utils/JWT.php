<?php
class JWT {
    private $secret;
    private $algorithm = 'HS256';
    
    public function __construct() {
        $this->secret = $_ENV['JWT_SECRET'] ?? 'matronapp_secret_key_2024';
    }
    
    public function generate($payload) {
        $header = [
            'typ' => 'JWT',
            'alg' => $this->algorithm
        ];
        
        $payload['iat'] = time();
        $payload['exp'] = time() + (24 * 60 * 60); // 24 horas
        
        $headerEncoded = $this->base64UrlEncode(json_encode($header));
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, $this->secret, true);
        $signatureEncoded = $this->base64UrlEncode($signature);
        
        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }
    
    public function decode($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Token inválido');
        }
        
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        
        // Verificar firma
        $expectedSignature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, $this->secret, true);
        $expectedSignatureEncoded = $this->base64UrlEncode($expectedSignature);
        
        if (!hash_equals($signatureEncoded, $expectedSignatureEncoded)) {
            throw new Exception('Firma de token inválida');
        }
        
        $payload = json_decode($this->base64UrlDecode($payloadEncoded), true);
        
        if (!$payload) {
            throw new Exception('Payload de token inválido');
        }
        
        // Verificar expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token expirado');
        }
        
        return $payload;
    }
    
    public function validate($token) {
        try {
            $payload = $this->decode($token);
            return [
                'valid' => true,
                'payload' => $payload
            ];
        } catch (Exception $e) {
            return [
                'valid' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64UrlDecode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
}
?> 