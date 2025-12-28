<?php
// admin/delete_land.php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    header('Location: land.php');
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT image FROM lands WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $land = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($land) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!empty($land['image'])) {
            $file = $uploadDir . $land['image'];
            if (is_file($file)) {
                @unlink($file);
            }
        }

        $del = $pdo->prepare("DELETE FROM lands WHERE id = :id");
        $del->execute([':id' => $id]);
    }
} catch (PDOException $e) {
    // possibilité de logger l’erreur
}

header('Location: land.php');
exit;
