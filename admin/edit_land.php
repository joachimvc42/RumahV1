<?php
// admin/edit_land.php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    header('Location: land.php');
    exit;
}

$errors = [];

try {
    $stmt = $pdo->prepare("SELECT * FROM lands WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $land = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die('Database error: ' . $e->getMessage());
}

if (!$land) {
    header('Location: land.php');
    exit;
}

$title       = $land['title'] ?? '';
$location    = $land['location'] ?? '';
$price       = $land['price'] ?? '';
$area        = $land['area'] ?? '';
$tenure      = $land['tenure'] ?? 'freehold';
$description = $land['description'] ?? '';
$currentImage = $land['image'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title       = trim($_POST['title'] ?? '');
    $location    = trim($_POST['location'] ?? '');
    $price       = trim($_POST['price'] ?? '');
    $area        = trim($_POST['area'] ?? '');
    $tenure      = $_POST['tenure'] ?? 'freehold';
    $description = trim($_POST['description'] ?? '');

    if ($title === '')    $errors[] = 'Title is required';
    if ($location === '') $errors[] = 'Location is required';
    if ($price === '')    $errors[] = 'Price is required';
    if ($area === '')     $errors[] = 'Area is required';

    $newImage = $currentImage;

    // Si nouvelle image chargée, on remplace
    if (!empty($_FILES['image']['name'])) {
        if ($_FILES['image']['error'] === UPLOAD_ERR_OK && is_uploaded_file($_FILES['image']['tmp_name'])) {
            $uploadDir = __DIR__ . '/../uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION) ?: 'jpg';
            $filename = uniqid('land_', true) . '.' . strtolower($ext);
            $dest = $uploadDir . $filename;
            if (move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
                // supprimer l’ancienne si existe
                if ($currentImage) {
                    $old = $uploadDir . $currentImage;
                    if (is_file($old)) {
                        @unlink($old);
                    }
                }
                $newImage = $filename;
            } else {
                $errors[] = 'Failed to upload new image.';
            }
        } else {
            $errors[] = 'Error while uploading new image.';
        }
    }

    if (empty($errors)) {
        try {
            $stmt = $pdo->prepare("
                UPDATE lands
                   SET title       = :title,
                       location    = :location,
                       price       = :price,
                       area        = :area,
                       tenure      = :tenure,
                       image       = :image,
                       description = :description
                 WHERE id          = :id
            ");

            $stmt->execute([
                ':title'       => $title,
                ':location'    => $location,
                ':price'       => $price,
                ':area'        => $area,
                ':tenure'      => $tenure,
                ':image'       => $newImage,
                ':description' => $description,
                ':id'          => $id,
            ]);

            header('Location: land.php');
            exit;
        } catch (PDOException $e) {
            $errors[] = 'Database error while updating land: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Land – Admin</title>
    <link rel="stylesheet" href="styles_admin.css">
</head>
<body>
<?php include __DIR__ . '/admin_header.php'; ?>

<h1 class="admin-page-title">Edit Land #<?= (int)$id ?></h1>

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

    <label>Area (are / m²) *</label>
    <input type="text" name="area" value="<?= htmlspecialchars($area) ?>" required>

    <label>Tenure *</label>
    <select name="tenure">
        <option value="freehold" <?= $tenure === 'freehold' ? 'selected' : '' ?>>Freehold</option>
        <option value="leasehold" <?= $tenure === 'leasehold' ? 'selected' : '' ?>>Leasehold</option>
    </select>

    <label>Current cover image</label>
    <?php if ($currentImage): ?>
        <div>
            <img src="/uploads/<?= htmlspecialchars($currentImage) ?>" alt="" class="list-thumb">
        </div>
    <?php else: ?>
        <p>No image uploaded.</p>
    <?php endif; ?>

    <label>Replace image (optional)</label>
    <input type="file" name="image" accept="image/*">

    <label>Description</label>
    <textarea name="description" rows="6"><?= htmlspecialchars($description) ?></textarea>

    <button type="submit" class="btn">Save changes</button>
    <a href="land.php" class="btn btn-secondary">Cancel</a>
</form>

</body>
</html>
