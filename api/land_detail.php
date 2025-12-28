<?php
require_once __DIR__ . '/../config.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo 'Invalid ID';
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM lands WHERE id = :id");
$stmt->execute([':id' => $id]);
$land = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$land) {
    http_response_code(404);
    echo 'Not found';
    exit;
}

$imagesRaw = $land['images'] ?? '';
$images    = [];
if ($imagesRaw !== '') {
    $parts = preg_split('/\s*,\s*/', $imagesRaw);
    foreach ($parts as $p) {
        $img = trim($p);
        if ($img === '') continue;

        if (strpos($img, '/') === false) {
            $img = 'uploads/' . $img;
        }
        $images[] = $img;
    }
}
if (!$images) {
    $images[] = 'assets/default-land.jpg';
}
$main = $images[0];

$area  = isset($land['area']) ? (float)$land['area'] : 0;
$dist  = isset($land['distance_from_beach']) ? (float)$land['distance_from_beach'] : null;
$price = $land['price'] ?? '';
$loc   = $land['location'] ?? '';
$title = $land['title'] ?? 'Land plot';
?>
<div class="modal-layout">
    <div>
        <img src="/<?= htmlspecialchars($main) ?>" alt="" class="modal-gallery-main">
        <?php if (count($images) > 1): ?>
            <div class="modal-gallery-thumbs">
                <?php foreach ($images as $img): ?>
                    <img src="/<?= htmlspecialchars($img) ?>" class="modal-gallery-thumb"
                         data-full="/<?= htmlspecialchars($img) ?>" alt="">
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    <div>
        <h2 class="section-title"><?= htmlspecialchars($title) ?></h2>
        <p class="section-subtitle"><?= htmlspecialchars($loc) ?></p>

        <ul class="modal-meta-list">
            <li><strong>Price:</strong> <?= htmlspecialchars($price) ?> M IDR / are</li>
            <?php if ($area > 0): ?>
                <li><strong>Area:</strong> <?= $area ?> are</li>
            <?php endif; ?>
            <?php if ($dist !== null): ?>
                <li><strong>Distance to beach:</strong> <?= $dist ?> km</li>
            <?php endif; ?>
            <?php if (!empty($land['buildable'])): ?>
                <li><strong>Buildable:</strong> Yes</li>
            <?php endif; ?>
            <?php if (!empty($land['electricity'])): ?>
                <li><strong>Electricity:</strong> Available</li>
            <?php endif; ?>
            <?php if (!empty($land['water'])): ?>
                <li><strong>Water:</strong> Available</li>
            <?php endif; ?>
            <?php if (!empty($land['virgin'])): ?>
                <li><strong>Virgin land:</strong> Yes</li>
            <?php endif; ?>
        </ul>

        <?php if (!empty($land['description'])): ?>
            <p class="modal-description"><?= nl2br(htmlspecialchars($land['description'])) ?></p>
        <?php endif; ?>

        <div class="modal-contact-box">
            Interested in this land?<br>
            WhatsApp: +62 812 3456 7890<br>
            Email: info@rumahya.com
        </div>
    </div>
</div>
