<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/common/functions.php';

// Get ID
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$land = $id ? getLandById($pdo, $id) : null;
if (!$land) {
    $pageTitle = 'Land Not Found – RumahYa';
    require_once __DIR__ . '/common/header.php';
    echo '<div class="container"><h1>Land Not Found</h1><p>Sorry, the land listing you are looking for does not exist.</p></div>';
    require_once __DIR__ . '/common/footer.php';
    exit;
}

$pageTitle = htmlspecialchars($land['title']) . ' – RumahYa';
require_once __DIR__ . '/common/header.php';

// Info
$imgUrl = rumahya_normalize_image_path($land['image'] ?? '');
$distance = $land['distance_from_beach'] ?? null;
$location = $land['location'] ?? null;
$price = $land['price'] ?? null;
$area = $land['area'] ?? null;
$isBuildable = !empty($land['is_buildable']);
$hasElectricity = !empty($land['has_electricity']);
$hasWater = !empty($land['has_water']);
$isRaw = !empty($land['is_raw_land']);
?>
<section class="container fade-in-up">
    <h1 class="section-title"><?php echo htmlspecialchars($land['title']); ?></h1>
    <div class="detail-container">
        <div class="gallery">
            <img src="/<?php echo htmlspecialchars($imgUrl ?: 'assets/lombok.jpg'); ?>" alt="Land image">
        </div>
        <div class="detail-info">
            <h2>Land Details</h2>
            <div class="detail-meta">
                <?php if ($distance): ?><span class="badge">Beach: <?php echo htmlspecialchars($distance); ?></span><?php endif; ?>
                <?php if ($location): ?><span class="badge">Area: <?php echo htmlspecialchars($location); ?></span><?php endif; ?>
                <?php if ($area): ?><span class="badge">Size: <?php echo htmlspecialchars($area); ?></span><?php endif; ?>
                <?php echo rumahya_boolean_badge($isBuildable, 'Buildable'); ?>
                <?php echo rumahya_boolean_badge($hasElectricity, 'Electricity'); ?>
                <?php echo rumahya_boolean_badge($hasWater, 'Water'); ?>
                <?php echo rumahya_boolean_badge($isRaw, 'Raw Land'); ?>
            </div>
            <?php if ($price): ?><p><strong>Price:</strong> <?php echo rumahya_format_price($price); ?></p><?php endif; ?>
            <div class="description">
                <p><?php echo nl2br(htmlspecialchars($land['description'])); ?></p>
            </div>
            <a href="/#contact" class="btn">Contact Us</a>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/common/footer.php'; ?>