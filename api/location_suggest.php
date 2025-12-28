<?php
// api/location_suggest.php
header('Content-Type: application/json; charset=utf-8');

// Termes recherchés
$q = isset($_GET['q']) ? trim($_GET['q']) : '';
if ($q === '') {
    echo json_encode([]);
    exit;
}

// On limite la recherche à Lombok / Indonesia pour rester pertinent
$search = $q . ', Lombok, Indonesia';

$url = 'https://nominatim.openstreetmap.org/search?format=json&limit=8&q=' . urlencode($search);

// Nominatim demande un User-Agent explicite
$opts = [
    'http' => [
        'header' => "User-Agent: RumahYaBot/1.0 (contact: webmaster@rumahya.com)\r\n",
        'timeout' => 3
    ]
];
$context = stream_context_create($opts);

$result = @file_get_contents($url, false, $context);
if ($result === false) {
    echo json_encode([]);
    exit;
}

$data = json_decode($result, true);
if (!is_array($data)) {
    echo json_encode([]);
    exit;
}

// On renvoie seulement les champs utiles
$out = [];
foreach ($data as $item) {
    $out[] = [
        'display_name' => $item['display_name'] ?? '',
        'lat'          => $item['lat'] ?? null,
        'lon'          => $item['lon'] ?? null,
    ];
}

echo json_encode($out);
