<?php
// public_html/db_connect.php
// Connexion unique pour tout le site (front + admin)

$host   = 'localhost';
$dbName = 'u370458845_rumahya_db';
$dbUser = 'u370458845_rumahya_user';
$dbPass = 'Rumahya123';   // mets ICI le même mot de passe que dans test_db.php

$dsn = "mysql:host={$host};dbname={$dbName};charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}
