<?php
/**
 * ============================================
 * SCRIPT DE ENVÍO DE FORMULARIO DE CONTACTO
 * ============================================
 *
 * ChessArcade - contact@chessarcade.com.ar
 *
 * Este script procesa el formulario de contacto y envía
 * el email usando PHPMailer con SMTP de Hostinger.
 *
 * IMPORTANTE: Este archivo debe estar en la raíz del sitio
 * junto con contact.html
 *
 * @author ChessArcade Team
 * @version 1.0.0
 */

// ============================================
// CONFIGURACIÓN
// ============================================

// Email de destino (donde llegan los mensajes)
define('EMAIL_DESTINO', 'contact@chessarcade.com.ar');

// Email de origen (desde donde se envían)
// Debe ser un email válido de tu dominio en Hostinger
define('EMAIL_ORIGEN', 'noreply@chessarcade.com.ar');

// Nombre del remitente
define('NOMBRE_ORIGEN', 'ChessArcade Contact Form');

// ============================================
// SEGURIDAD Y VALIDACIÓN
// ============================================

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['success' => false, 'message' => 'Método no permitido']));
}

// Verificar campos requeridos
$camposRequeridos = ['name', 'email', 'subject', 'message'];
foreach ($camposRequeridos as $campo) {
    if (empty($_POST[$campo])) {
        http_response_code(400);
        die(json_encode([
            'success' => false,
            'message' => "El campo '$campo' es requerido"
        ]));
    }
}

// Sanitizar y validar datos
$nombre = htmlspecialchars(strip_tags(trim($_POST['name'])));
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$asunto = htmlspecialchars(strip_tags(trim($_POST['subject'])));
$mensaje = htmlspecialchars(strip_tags(trim($_POST['message'])));

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode([
        'success' => false,
        'message' => 'Email inválido'
    ]));
}

// Protección anti-spam: honeypot field
// Si el campo _gotcha está lleno, es un bot
if (!empty($_POST['_gotcha'])) {
    // Simular éxito para el bot pero no enviar
    http_response_code(200);
    die(json_encode([
        'success' => true,
        'message' => 'Mensaje enviado con éxito'
    ]));
}

// Protección anti-spam: rate limiting básico
// Verificar si ya se envió un mensaje en los últimos 60 segundos desde esta IP
session_start();
$ip = $_SERVER['REMOTE_ADDR'];
$tiempoAhora = time();
$tiempoEspera = 60; // segundos

if (isset($_SESSION['ultimo_envio_' . $ip])) {
    $tiempoTranscurrido = $tiempoAhora - $_SESSION['ultimo_envio_' . $ip];
    if ($tiempoTranscurrido < $tiempoEspera) {
        http_response_code(429);
        die(json_encode([
            'success' => false,
            'message' => 'Por favor espera ' . ($tiempoEspera - $tiempoTranscurrido) . ' segundos antes de enviar otro mensaje'
        ]));
    }
}

// ============================================
// TRADUCCIÓN DE ASUNTOS
// ============================================

$asuntosTraducidos = [
    'pregunta' => 'Pregunta General',
    'bug' => 'Reporte de Bug/Error',
    'sugerencia' => 'Sugerencia de Mejora',
    'colaboracion' => 'Propuesta de Colaboración',
    'otro' => 'Otro'
];

$asuntoTexto = isset($asuntosTraducidos[$asunto])
    ? $asuntosTraducidos[$asunto]
    : $asunto;

// ============================================
// PREPARAR EMAIL
// ============================================

// Asunto del email
$emailAsunto = "[ChessArcade] $asuntoTexto - $nombre";

// Cuerpo del email en HTML
$emailCuerpo = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #00ffff, #ff00ff);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .info-box {
            background: #f5f5f5;
            border-left: 4px solid #00ffff;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .info-label {
            font-weight: bold;
            color: #666;
            margin-bottom: 5px;
        }
        .message-box {
            background: white;
            border: 1px solid #ddd;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class='header'>
        <h1>♟️ Nuevo Mensaje de ChessArcade</h1>
    </div>

    <div class='info-box'>
        <div class='info-label'>Nombre:</div>
        <div>$nombre</div>
    </div>

    <div class='info-box'>
        <div class='info-label'>Email:</div>
        <div><a href='mailto:$email'>$email</a></div>
    </div>

    <div class='info-box'>
        <div class='info-label'>Asunto:</div>
        <div>$asuntoTexto</div>
    </div>

    <div class='info-box'>
        <div class='info-label'>Fecha y Hora:</div>
        <div>" . date('d/m/Y H:i:s') . " (GMT-3)</div>
    </div>

    <div class='info-box'>
        <div class='info-label'>IP:</div>
        <div>$ip</div>
    </div>

    <div class='message-box'>
        <div class='info-label'>Mensaje:</div>
        <p>" . nl2br($mensaje) . "</p>
    </div>

    <div class='footer'>
        <p>Este mensaje fue enviado desde el formulario de contacto de ChessArcade.com.ar</p>
        <p>Para responder, simplemente responde a este email.</p>
    </div>
</body>
</html>
";

// Headers del email
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . NOMBRE_ORIGEN . ' <' . EMAIL_ORIGEN . '>',
    'Reply-To: ' . $nombre . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];

// ============================================
// ENVIAR EMAIL
// ============================================

try {
    // Intentar enviar con la función mail() de PHP
    // Hostinger soporta mail() si Sendmail está habilitado
    $enviado = mail(
        EMAIL_DESTINO,
        $emailAsunto,
        $emailCuerpo,
        implode("\r\n", $headers)
    );

    if ($enviado) {
        // Guardar timestamp del envío exitoso
        $_SESSION['ultimo_envio_' . $ip] = $tiempoAhora;

        // Opcional: Guardar en un archivo de log
        $logEntry = date('Y-m-d H:i:s') . " | $ip | $nombre | $email | $asuntoTexto\n";
        @file_put_contents('contact-log.txt', $logEntry, FILE_APPEND);

        // Responder con éxito
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => '¡Mensaje enviado con éxito! Te responderemos pronto.'
        ]);
    } else {
        // Error al enviar
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al enviar el mensaje. Por favor intenta de nuevo o contáctanos directamente a contact@chessarcade.com.ar'
        ]);
    }

} catch (Exception $e) {
    // Error crítico
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor. Por favor intenta de nuevo más tarde.',
        'error' => $e->getMessage() // Solo en desarrollo, quitar en producción
    ]);
}
?>
