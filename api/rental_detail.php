<?php
require_once __DIR__ . '/../config.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo 'Invalid ID';
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM villas WHERE id = :id");
$stmt->execute([':id' => $id]);
$villa = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$villa) {
    http_response_code(404);
    echo 'Not found';
    exit;
}

function formatDurationMonths(?int $m): string {
    if ($m === null) return '';
    if ($m < 12) return $m . ' months';
    $years = intdiv($m, 12);
    $rest  = $m % 12;
    if ($rest === 0) return $years . ' years';
    return $years . ' yrs ' . $rest . ' mo';
}

$imagesField = $villa['images'] ?? '';
$images = [];
if ($imagesField) {
    $parts = preg_split('/\s*,\s*/', $imagesField);
    foreach ($parts as $p) {
        if ($p !== '') {
            $images[] = '/uploads/' . $p;
        }
    }
}
if (!$images) {
    $images = ['/assets/default-villa.jpg'];
}

$priceMillions = is_numeric($villa['price']) ? (int)$villa['price'] : null;
$minTermMonths = isset($villa['min_term']) && is_numeric($villa['min_term'])
    ? (int)$villa['min_term']
    : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($villa['title']) ?></title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
<div class="modal-villa">
    <div class="modal-gallery">
        <?php if ($images): ?>
            <div class="modal-gallery-main">
                <img src="<?= htmlspecialchars($images[0]) ?>" alt="">
            </div>
            <?php if (count($images) > 1): ?>
                <div class="modal-gallery-thumbs">
                    <?php foreach ($images as $img): ?>
                        <img src="<?= htmlspecialchars($img) ?>" alt="">
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
    <div>
        <h2 class="section-title"><?= htmlspecialchars($villa['title']) ?></h2>
        <p class="section-subtitle"><?= htmlspecialchars($villa['location']) ?></p>

        <ul class="modal-meta-list">
            <li>
                <strong>Price:</strong>
                <?php if ($priceMillions !== null): ?>
                    <?= number_format($priceMillions, 0, '.', ',') ?> Mio IDR / month
                <?php else: ?>
                    <?= htmlspecialchars($villa['price']) ?>
                <?php endif; ?>
            </li>

            <?php if ($minTermMonths !== null && $minTermMonths > 0): ?>
                <li>
                    <strong>Minimum term:</strong>
                    <?= htmlspecialchars(formatDurationMonths($minTermMonths)) ?>
                </li>
            <?php endif; ?>

            <li><strong>Bedrooms:</strong> <?= (int)$villa['bedrooms'] ?></li>
            <li><strong>Bathrooms:</strong> <?= (int)$villa['bathrooms'] ?></li>

            <?php if (!empty($villa['pool'])): ?>
                <li><strong>Pool:</strong> Yes</li>
            <?php endif; ?>
            <?php if (!empty($villa['garden'])): ?>
                <li><strong>Garden:</strong> Yes</li>
            <?php endif; ?>
        </ul>

        <?php if (!empty($villa['description'])): ?>
            <p class="modal-description"><?= nl2br(htmlspecialchars($villa['description'])) ?></p>
        <?php endif; ?>

        <div class="modal-contact-box">
            <p>Interested in this property? Contact us at:</p>
            <p><strong>WhatsApp:</strong> +62 …</p>
            <p><strong>Email:</strong> hello@rumahya.com</p>
        </div>
    </div>
</div>
</body>
</html>
