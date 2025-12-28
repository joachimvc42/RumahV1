<?php
// api/villa_availability.php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT start_date, end_date
        FROM villa_unavailabilities
        WHERE villa_id = :id
        ORDER BY start_date
    ");
    $stmt->execute([':id' => $id]);
    $periods = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($periods);
} catch (PDOException $e) {
    // Si la table n'existe pas, on renvoie un tableau vide pour ne rien casser
    echo json_encode([]);
}
