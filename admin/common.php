<?php
// admin/common.php
// Gestion des sessions + connexion DB + protection admin

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../db_connect.php';

/**
 * Vérifie que l’admin est connecté.
 * À utiliser en haut de toutes les pages admin (sauf login.php).
 */
function ensure_admin_logged_in(): void
{
    if (empty($_SESSION['admin_logged_in'])) {
        header('Location: login.php');
        exit;
    }
}
