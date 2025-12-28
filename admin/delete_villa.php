<?php
// admin/delete_villa.php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    header('Location: villas.php');
    exit;
}

try {
    // Récupérer les images
    $stmt = $pdo->prepare("SELECT images FROM villas WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $villa = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($villa) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!empty($villa['images'])) {
            $images = array_filter(array_map('trim', explode(',', $villa['images'])));
            foreach ($images as $img) {
                $file = $uploadDir . $img;
                if (is_file($file)) {
                    @unlink($file);
                }
            }
        }

        // Suppression de la ligne en BDD
        $del = $pdo->prepare("DELETE FROM villas WHERE id = :id");
        $del->execute([':id' => $id]);
    }
} catch (PDOException $e) {
    // En cas d'erreur, on peut loguer si besoin
}

header('Location: villas.php');
exit;
