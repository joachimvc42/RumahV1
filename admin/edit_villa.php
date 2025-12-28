<?php
// admin/edit_villa.php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    header('Location: villas.php');
    exit;
}

$errors = [];

// Charger la villa
try {
    $stmt = $pdo->prepare("SELECT * FROM villas WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $villa = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die('Database error: ' . $e->getMessage());
}

if (!$villa) {
    header('Location: villas.php');
    exit;
}

// Valeurs initiales
$title       = $villa['title'] ?? '';
$location    = $villa['location'] ?? '';
$price       = $villa['price'] ?? '';
$duration    = $villa['duration'] ?? '';
$bedrooms    = $villa['bedrooms'] ?? '';
$bathrooms   = $villa['bathrooms'] ?? '';
$pool        = !empty($villa['pool']) ? 1 : 0;
$garden      = !empty($villa['garden']) ? 1 : 0;
$is_finished = !empty($villa['is_finished']) ? 1 : 0;
$description = $villa['description'] ?? '';
$currentImages = [];
if (!empty($villa['images'])) {
    $currentImages = array_filter(array_map('trim', explode(',', $villa['images'])));
}

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

    // Upload de nouvelles images (optionnel)
    $newImages = [];
    if (!empty($_FILES['images']) && is_array($_FILES['images']['name'])) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        foreach ($_FILES['images']['tmp_name'] as $idx => $tmpName) {
            if (
                isset($_FILES['images']['error'][$idx]) &&
                $_FILES['images']['error'][$idx] === UPLOAD_ERR_OK &&
                is_uploaded_file($tmpName)
            ) {
                $ext = pathinfo($_FILES['images']['name'][$idx], PATHINFO_EXTENSION);
                if ($ext === '') {
                    $ext = 'jpg';
                }
                $filename = uniqid('villa_', true) . '.' . strtolower($ext);
                $dest     = $uploadDir . $filename;
                if (move_uploaded_file($tmpName, $dest)) {
                    $newImages[] = $filename;
                }
            }
        }
    }

    if (empty($errors)) {
        // On conserve les anciennes images + on ajoute les nouvelles
        $allImages = array_merge($currentImages, $newImages);
        $imagesStr = implode(',', $allImages);

        try {
            $stmt = $pdo->prepare("
                UPDATE villas
                   SET title       = :title,
                       location    = :location,
                       price       = :price,
                       duration    = :duration,
                       bedrooms    = :bedrooms,
                       bathrooms   = :bathrooms,
                       pool        = :pool,
                       garden      = :garden,
                       is_finished = :is_finished,
                       description = :description,
                       images      = :images
                 WHERE id          = :id
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
                ':id'          => $id,
            ]);

            header('Location: villas.php');
            exit;
        } catch (PDOException $e) {
            $errors[] = 'Database error while updating villa: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Villa – Admin</title>
    <link rel="stylesheet" href="styles_admin.css">
</head>
<body>
<?php include __DIR__ . '/admin_header.php'; ?>

<h1 class="admin-page-title">Edit Villa #<?= (int)$id ?></h1>

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
    <input type="text" name="location" value="<?= htmlspecialchars($location) ?>" required>

    <label>Price (IDR) *</label>
    <input type="number" name="price" value="<?= htmlspecialchars($price) ?>" required>

    <label>Minimum term (months) *</label>
    <input type="number" name="duration" value="<?= htmlspecialchars($duration) ?>" required>

    <label>Bedrooms</label>
    <input type="number" name="bedrooms" value="<?= htmlspecialchars($bedrooms) ?>">

    <label>Bathrooms</label>
    <input type="number" name="bathrooms" value="<?= htmlspecialchars($bathrooms) ?>">

    <label><input type="checkbox" name="pool" <?= $pool ? 'checked' : '' ?>> Pool available</label>
    <label><input type="checkbox" name="garden" <?= $garden ? 'checked' : '' ?>> Garden available</label>
    <label><input type="checkbox" name="is_finished" <?= $is_finished ? 'checked' : '' ?>> Finished construction</label>

    <label>Current images</label>
    <div class="image-thumbnails">
        <?php if ($currentImages): ?>
            <?php foreach ($currentImages as $img): ?>
                <img src="/uploads/<?= htmlspecialchars($img) ?>" alt="" class="list-thumb">
            <?php endforeach; ?>
        <?php else: ?>
            <p>No images uploaded yet.</p>
        <?php endif; ?>
    </div>

    <label>Add more images (optional)</label>
    <input type="file" name="images[]" multiple accept="image/*">

    <label>Description</label>
    <textarea name="description" rows="6"><?= htmlspecialchars($description) ?></textarea>

    <button type="submit" class="btn">Save changes</button>
    <a href="villas.php" class="btn btn-secondary">Cancel</a>
</form>

</body>
</html>
