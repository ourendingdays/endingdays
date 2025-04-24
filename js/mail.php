<?php
// Loading environment variables
require_once __DIR__ . '/env.php';

$recipient = getenv('RECIPIENT_EMAIL');
$sitename  = getenv('SITE_NAME');

$name      = trim($_POST['name']   ?? '');
$userEmail = trim($_POST['email']  ?? '');
$reason    = trim($_POST['reason'] ?? '');

$message = <<<EOD
Name: {$name}
Contact: {$userEmail}
Reason : {$reason}
EOD;

$subject = "Message from \"{$sitename}\"";
$headers = "Content-Type: text/plain; charset=UTF-8\r\n"
         . "From: {$recipient}\r\n";

// Sending the email
mail($recipient, $subject, $message, $headers);
