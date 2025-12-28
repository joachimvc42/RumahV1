<?php
// admin/delete_villa_unavailability.php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();

$id       = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$villaId  = isset($_GET['villa_id']) ? (int)$_GET['villa_id'] : 0;

if ($id > 0) {
    try {
        $stmt = $pdo->prepare("DELETE FROM villa_unavailabilities WHERE id = :id");
        $stmt->execute([':id' => $id]);
    } catch (PDOException $e) {
        // on peut logger si besoin, mais on ne casse pas la navigation
    }
}

if ($villaId > 0) {
    header('Location: villa_availability.php?villa_id=' . $villaId);
} else {
    header('Location: villas.php');
}
exit;
