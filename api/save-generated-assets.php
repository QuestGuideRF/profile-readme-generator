<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Метод не поддерживается']);
}
$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 4 * 1024 * 1024) {
    respond(413, ['ok' => false, 'error' => 'Слишком большой запрос']);
}
$payload = json_decode($raw, true);
if (!is_array($payload) || !isset($payload['assets']) || !is_array($payload['assets'])) {
    respond(400, ['ok' => false, 'error' => 'Некорректный JSON']);
}
$assetsDir = realpath(__DIR__ . '/../assets');
if ($assetsDir === false) {
    $targetDir = __DIR__ . '/../assets';
    if (!mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
        respond(500, ['ok' => false, 'error' => 'Не удалось создать папку assets']);
    }
    $assetsDir = realpath($targetDir);
}
if ($assetsDir === false || !is_dir($assetsDir) || !is_writable($assetsDir)) {
    respond(500, ['ok' => false, 'error' => 'Папка assets недоступна для записи']);
}
$saved = [];
$items = array_slice($payload['assets'], 0, 20);
foreach ($items as $item) {
    if (!is_array($item)) {
        continue;
    }
    $name = (string) ($item['name'] ?? '');
    $content = (string) ($item['content'] ?? '');
    if (!preg_match('/^[a-z0-9][a-z0-9._-]{0,140}\.svg$/i', $name)) {
        continue;
    }
    if ($content === '' || strlen($content) > 700 * 1024) {
        continue;
    }
    $trimmed = ltrim($content);
    if (!preg_match('/^(<\?xml\b[^>]*>\s*)?<svg\b/i', $trimmed)) {
        continue;
    }
    if (preg_match('/<\s*script\b|<\s*foreignObject\b|\son[a-z]+\s*=/i', $content)) {
        continue;
    }
    $target = $assetsDir . DIRECTORY_SEPARATOR . $name;
    $resolvedParent = realpath(dirname($target));
    if ($resolvedParent !== $assetsDir) {
        continue;
    }
    if (file_put_contents($target, $content, LOCK_EX) !== false) {
        @chmod($target, 0644);
        $saved[] = $name;
    }
}
respond(200, [
    'ok' => true,
    'saved' => $saved,
]);