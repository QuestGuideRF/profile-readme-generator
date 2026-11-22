<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=900');
function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function valid_username(string $username): bool
{
    return (bool) preg_match('/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/', $username);
}
function fetch_url(string $url): string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_TIMEOUT => 18,
            CURLOPT_HTTPHEADER => [
                'Accept: text/html',
                'User-Agent: ProfileReadmeGenerator/1.0',
            ],
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        if ($body === false || $status < 200 || $status >= 300) {
            throw new RuntimeException($error ?: 'GitHub returned HTTP ' . $status);
        }
        return (string) $body;
    }
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 18,
            'header' => "Accept: text/html\r\nUser-Agent: ProfileReadmeGenerator/1.0\r\n",
        ],
    ]);
    $body = @file_get_contents($url, false, $context);
    if ($body === false) {
        throw new RuntimeException('Could not fetch GitHub contributions');
    }
    return (string) $body;
}
function contribution_count(string $tooltip): int
{
    $text = html_entity_decode(strip_tags($tooltip), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    if (stripos($text, 'no contributions') !== false) {
        return 0;
    }
    if (preg_match('/([\d,]+)\s+contribution/i', $text, $match)) {
        return max(0, (int) str_replace(',', '', $match[1]));
    }
    return 0;
}
function parse_contributions(string $html): array
{
    $days = [];
    if (preg_match_all('/<td\b(?=[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})")(?=[^>]*\bid="([^"]+)")[^>]*>.*?<\/td>\s*<tool-tip\b(?=[^>]*\bfor="\2")[^>]*>(.*?)<\/tool-tip>/is', $html, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $days[$match[1]] = contribution_count($match[3]);
        }
    }
    if (!$days && preg_match_all('/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-count="(\d+)"/i', $html, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $days[$match[1]] = max(0, (int) $match[2]);
        }
    }
    ksort($days);
    $result = [];
    foreach ($days as $date => $count) {
        $result[] = ['date' => $date, 'count' => $count];
    }
    return $result;
}
$username = trim((string) ($_GET['username'] ?? ''));
if (!valid_username($username)) {
    respond(400, ['ok' => false, 'error' => 'Некорректное имя пользователя GitHub']);
}
try {
    $html = fetch_url('https://github.com/users/' . rawurlencode($username) . '/contributions');
    $days = parse_contributions($html);
    if (!$days) {
        throw new RuntimeException('GitHub contribution calendar was not found');
    }
    $total = 0;
    $activeDays = 0;
    foreach ($days as $day) {
        $count = (int) $day['count'];
        $total += $count;
        if ($count > 0) {
            $activeDays += 1;
        }
    }
    respond(200, [
        'ok' => true,
        'source' => 'github-contributions',
        'username' => $username,
        'total' => $total,
        'activeDays' => $activeDays,
        'days' => $days,
        'fetchedAt' => gmdate('c'),
    ]);
} catch (Throwable $error) {
    respond(502, ['ok' => false, 'error' => $error->getMessage()]);
}