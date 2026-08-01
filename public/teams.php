<?php
/**
 * ReTees — shared "teams registered" counter.
 *
 * SETUP
 *   1. Change ADMIN_PIN below to something only you know, then save.
 *   2. Upload with the rest of the site (it builds into dist/ automatically,
 *      because anything in public/ is copied verbatim by Vite).
 *   3. Visit https://yourdomain.com/teams.php — you should see JSON like
 *      {"registered":12,"total":36}. If you see the website instead, the file
 *      did not upload to the same folder as index.html.
 *
 * API
 *   GET  /teams.php                                  → {"registered":12,"total":36}
 *   POST /teams.php  {"pin":"…","registered":13}     → {"ok":true,"registered":13}
 *
 * The count is stored in a JSON file one level ABOVE public_html when that
 * folder is writable. That keeps it out of reach of the browser and means a
 * redeploy that replaces public_html cannot wipe your saved number.
 */

const ADMIN_PIN      = 'Retees2026';
const TEAMS_MAX      = 36;
const DEFAULT_COUNT  = 12;
const DATA_FILENAME  = 'retees-teams.json';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

function clamp_teams(int $n): int {
    return max(0, min(TEAMS_MAX, $n));
}

/**
 * Where the count may live, best first:
 *   protected — above public_html: survives a deploy that replaces the web
 *               root, and no browser can fetch it directly
 *   webroot   — beside this script: works on any host, but a deploy that
 *               clears public_html erases it
 *
 * Reads and writes walk this list in the same order, so they can never end up
 * pointing at different files. Every probe is silenced because open_basedir
 * restrictions make these emit warnings that would corrupt the JSON body.
 *
 * @return array<string,string>
 */
function data_paths(): array {
    return [
        'protected' => dirname(__DIR__) . '/' . DATA_FILENAME,
        'webroot'   => __DIR__ . '/' . DATA_FILENAME,
    ];
}

/**
 * `stored` is false when no saved count was found, which is the difference
 * between "nobody has set it yet" and "the file was wiped" — without it the
 * site silently falls back to DEFAULT_COUNT and looks perfectly healthy.
 *
 * @return array{count:int, stored:bool, location:?string}
 */
function read_state(): array {
    foreach (data_paths() as $location => $path) {
        if (!@is_file($path)) {
            continue;
        }
        $data = json_decode((string) @file_get_contents($path), true);
        if (is_array($data) && isset($data['registered']) && is_numeric($data['registered'])) {
            return [
                'count'    => clamp_teams((int) $data['registered']),
                'stored'   => true,
                'location' => $location,
            ];
        }
    }
    return ['count' => DEFAULT_COUNT, 'stored' => false, 'location' => null];
}

/** @return ?string location key that was written, or null if nothing was writable */
function write_count(int $n): ?string {
    $payload = json_encode(
        ['registered' => $n, 'updated' => gmdate('c')],
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
    );
    foreach (data_paths() as $location => $path) {
        if (@file_put_contents($path, $payload, LOCK_EX) !== false) {
            return $location;
        }
    }
    return null;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $state = read_state();
    echo json_encode([
        'registered' => $state['count'],
        'total'      => TEAMS_MAX,
        'stored'     => $state['stored'],
        'location'   => $state['location'],
    ]);
    exit;
}

if ($method === 'POST') {
    $body = json_decode((string) file_get_contents('php://input'), true);
    $pin  = is_array($body) && isset($body['pin']) ? (string) $body['pin'] : '';

    if (!hash_equals(ADMIN_PIN, $pin)) {
        http_response_code(401);
        echo json_encode(['error' => 'Wrong PIN']);
        exit;
    }

    if (!is_array($body) || !isset($body['registered']) || !is_numeric($body['registered'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing team count']);
        exit;
    }

    $next     = clamp_teams((int) $body['registered']);
    $location = write_count($next);

    if ($location === null) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save — check file permissions']);
        exit;
    }

    echo json_encode([
        'ok'         => true,
        'registered' => $next,
        'total'      => TEAMS_MAX,
        'stored'     => true,
        'location'   => $location,
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
