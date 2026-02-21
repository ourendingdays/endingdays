<?php
// Loading environment variables
require_once __DIR__ . '/env.php';

header('Content-Type: application/json; charset=UTF-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$recipient = getenv('RECIPIENT_EMAIL');
$sitename  = getenv('SITE_NAME');

if (! $recipient) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Missing RECIPIENT_EMAIL']);
    exit;
}

if (! $sitename) {
    $sitename = 'Our Ending Days';
}

$name      = trim($_POST['name']   ?? '');
$userEmail = trim($_POST['email']  ?? '');
$reason    = trim($_POST['reason'] ?? '');

if ($name === '' || $userEmail === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and contact are required']);
    exit;
}

$message = <<<EOD
Name: {$name}
Contact: {$userEmail}
Reason : {$reason}
EOD;

$subject = "Message from \"{$sitename}\"";
$headers = "Content-Type: text/plain; charset=UTF-8\r\n"
         . "From: {$recipient}\r\n";

// Sending the email
$sent = mail($recipient, $subject, $message, $headers);

if (! $sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'mail() failed']);
    exit;
}

echo json_encode(['success' => true]);
