<?php
/**
 * Simple .env loader.
 * Reads KEY=VALUE pairs from a .env file and injects them into the environment.
 *
 * @param string $path Path to your .env file
 * @return void
 */
function load_env(string $path): void {
    if (! file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        // Skipping comments
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        // Split on the first "="
        list($name, $value) = explode('=', $line, 2);
        $name  = trim($name);
        // stripping whitespace and surrounding quotes
        $value = trim($value, " \t\n\r\0\x0B\"'");

        // Injecting into environment
        putenv("$name=$value");
        $_ENV[$name]    = $value;
        $_SERVER[$name] = $value;
    }
}

// Prefer root mail.env, fallback to local .env for compatibility
$rootEnvPath = dirname(__DIR__) . '/mail.env';
$localEnvPath = __DIR__ . '/.env';

if (file_exists($rootEnvPath)) {
    load_env($rootEnvPath);
} else {
    load_env($localEnvPath);
}
