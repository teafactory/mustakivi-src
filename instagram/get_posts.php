<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
	http_response_code(403);
	echo 'Forbidden' . PHP_EOL;
	exit(1);
}

$accountId = '17841404205017264';
$accessToken = 'EAASkR6f6ZCSwBRDN7J1vlp4H3SclJlChyRI7OnEtuPZBjnjjUayZADRISUwiB87hLlBaZAAuQYNokYhIcwbqMYg0FW2GGZCdvdHU5Qb03HsHff125RK8XyLKWMugasyTgP8JbuLbrzZBQy41yHpOuH3tNSv6AfyVJHOWy6YTBkuK6ubF40lDwXjZAA6K70bipCNixsrG8XzaFtJI1gVcF1S2OPc';

$query = http_build_query([
	'fields' => 'id,caption,media_type,media_url,timestamp,permalink',
	'limit' => 20,
	'access_token' => $accessToken,
]);

$apiUrl = "https://graph.facebook.com/v23.0/{$accountId}/media?{$query}";

$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $curlError !== '') {
	fwrite(STDERR, "Request failed: {$curlError}" . PHP_EOL);
	exit(1);
}

if ($httpCode < 200 || $httpCode >= 300) {
	fwrite(STDERR, "Instagram API returned HTTP {$httpCode}" . PHP_EOL);
	fwrite(STDERR, $response . PHP_EOL);
	exit(1);
}

$decoded = json_decode($response, true);
if (!is_array($decoded)) {
	fwrite(STDERR, 'Failed to decode API response as JSON.' . PHP_EOL);
	exit(1);
}

$outputPath = __DIR__ . '/posts.json';
$jsonToSave = json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

if ($jsonToSave === false) {
	fwrite(STDERR, 'Failed to encode JSON for saving.' . PHP_EOL);
	exit(1);
}

if (file_put_contents($outputPath, $jsonToSave) === false) {
	fwrite(STDERR, "Failed to write file: {$outputPath}" . PHP_EOL);
	exit(1);
}

if (!chmod($outputPath, 0644)) {
	fwrite(STDERR, "Failed to set file permission on: {$outputPath}" . PHP_EOL);
	exit(1);
}

echo "Saved latest 20 posts to {$outputPath}" . PHP_EOL;
