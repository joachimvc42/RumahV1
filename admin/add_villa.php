<?php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();

$errors = [];
$title = '';
$location = '';
$price = '';
$duration = '';
$bedrooms = '';
$bathrooms = '';
$pool = 0;
$garden = 0;
$is_finished = 0;
$description = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title       = trim($_POST['title'] ?? '');
    $location    = trim($_POST['location'] ?? '');
    $price       = trim($_POST['price'] ?? '');
    $duration    = trim($_POST['duration'] ?? '');
    $bedrooms    = trim($_POST['bedrooms'] ?? '');
    $bathrooms   = trim($_POST['bathrooms'] ?? '');
    $pool        = isset($_POST['pool']) ? 1 : 0;
    $garden      = isset($_POST['garden']) ? 1 : 0;
    $is_finished = isset($_POST['is_finished']) ? 1 : 0;
    $description = trim($_POST['description'] ?? '');

    if ($title === '')      $errors[] = 'Title is required';
    if ($location === '')   $errors[] = 'Location is required';
    if ($price === '')      $errors[] = 'Price is required';
    if ($duration === '')   $errors[] = 'Minimum term (months) is required';

    $uploadedNames = [];
    if (!empty($_FILES['images']) && is_array($_FILES['images']['name'])) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        foreach ($_FILES['images']['tmp_name'] as $idx => $tmpName) {
            if ($_FILES['images']['error'][$idx] === UPLOAD_ERR_OK && is_uploaded_file($tmpName)) {
                $ext = pathinfo($_FILES['images']['name'][$idx], PATHINFO_EXTENSION);
                if ($ext === '') {
                    $ext = 'jpg';
                }
                $filename = uniqid('villa_', true) . '.' . strtolower($ext);
                $dest     = $uploadDir . $filename;
                if (move_uploaded_file($tmpName, $dest)) {
                    $uploadedNames[] = $filename;
                }
            }
        }
    }

    if (empty($errors)) {
        $imagesStr = implode(',', $uploadedNames);
        try {
            $stmt = $pdo->prepare("
                INSERT INTO villas (
                    title,
                    location,
                    price,
                    duration,
                    bedrooms,
                    bathrooms,
                    pool,
                    garden,
                    is_finished,
                    description,
                    images,
                    created_at
                ) VALUES (
                    :title,
                    :location,
                    :price,
                    :duration,
                    :bedrooms,
                    :bathrooms,
                    :pool,
                    :garden,
                    :is_finished,
                    :description,
                    :images,
                    NOW()
                )
            ");

            $stmt->execute([
                ':title'       => $title,
                ':location'    => $location,
                ':price'       => $price,
                ':duration'    => $duration,
                ':bedrooms'    => $bedrooms !== '' ? (int)$bedrooms : null,
                ':bathrooms'   => $bathrooms !== '' ? (int)$bathrooms : null,
                ':pool'        => $pool,
                ':garden'      => $garden,
                ':is_finished' => $is_finished,
                ':description' => $description,
                ':images'      => $imagesStr,
            ]);

            header('Location: villas.php');
            exit;
        } catch (PDOException $e) {
            $errors[] = 'Database error while saving villa: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Villa – Admin</title>
    <link rel="stylesheet" href="styles_admin.css">
</head>
<body>
<?php include __DIR__ . '/admin_header.php'; ?>

<div class="container">
    <h1 class="admin-page-title">Add New Villa</h1>

    <?php if ($errors): ?>
        <div class="admin-alert admin-alert-error">
            <?php foreach ($errors as $e): ?>
                <div><?= htmlspecialchars($e) ?></div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

   <form method="post" enctype="multipart/form-data" class="admin-form">
    <label>Title *</label>
    <input type="text" name="title" value="<?= htmlspecialchars($title) ?>" required>

    <label>Location *</label>
    <input type="text"
           name="location"
           list="location-suggestions"
           value="<?= htmlspecialchars($location) ?>"
           placeholder="e.g. Are Guling, Kuta, Selong Belanak"
           required>
    <datalist id="location-suggestions">
        <option value="Are Guling">
        <option value="Kuta, Lombok">
        <option value="Selong Belanak">
        <option value="Gerupuk">
        <option value="Tampah">
        <option value="Mandalika">
        <option value="Senggigi">
        <option value="Ekas">
    </datalist>

    <label>Price (million IDR / month) *</label>
    <input type="number"
           name="price"
           step="0.1"
           min="0"
           value="<?= htmlspecialchars($price) ?>"
           placeholder="e.g. 25 = 25,000,000 IDR / month"
           required>

    <label>Minimum term (months) *</label>
    <input type="number"
           name="duration"
           min="1"
           max="36"
           value="<?= htmlspecialchars($duration) ?>"
           placeholder="1–36 (months)" required>

    <label>Bedrooms</label>
    <input type="number" name="bedrooms" value="<?= htmlspecialchars($bedrooms) ?>" min="0">

    <label>Bathrooms</label>
    <input type="number" name="bathrooms" value="<?= htmlspecialchars($bathrooms) ?>" min="0">

    <label><input type="checkbox" name="pool" <?= $pool ? 'checked' : '' ?>> Pool available</label>
    <label><input type="checkbox" name="garden" <?= $garden ? 'checked' : '' ?>> Garden available</label>
    <label><input type="checkbox" name="is_finished" <?= $is_finished ? 'checked' : '' ?>> Finished construction</label>

    <label>Description</label>
    <textarea name="description" rows="6"><?= htmlspecialchars($description) ?></textarea>

    <label>Images</label>
    <input type="file" name="images[]" multiple accept="image/*">

    <button type="submit" class="btn">Save Villa</button>
    <a href="villas.php" class="btn btn-secondary">Cancel</a>
</form>

</div>

</body>
</html>
