<?php
// admin/admin_header.php
// Ce fichier NE démarre PAS de session et NE redirige PAS.
// La vérification login se fait dans chaque page via common.php.

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RumahYa admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css">

    <style>
        body {
            background: #f8f9fc;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .admin-nav {
            background: #ffffff;
            border-bottom: 1px solid #e5e7eb;
            padding: 10px 24px;
            display: flex;
            gap: 20px;
            align-items: center;
        }
        .admin-nav a {
            font-weight: 600;
            color: #374151;
            text-decoration: none;
            font-size: 0.95rem;
        }
        .admin-nav a.active {
            color: #0d6efd;
        }

        .list-thumb {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
        }

        .btn-edit {
            background: #0d6efd;
            color: #fff !important;
            padding: 4px 10px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.85rem;
        }
        .btn-edit:hover {
            background: #0b5ed7;
        }
        .btn-delete {
            background: #dc3545;
            color: #fff !important;
            padding: 4px 10px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.85rem;
        }
        .btn-delete:hover {
            background: #b02a37;
        }
    </style>
</head>
<body>

<?php
$current = basename($_SERVER['PHP_SELF']);
?>
<div class="admin-nav">
    <a href="villas.php" class="<?= $current === 'villas.php' ? 'active' : '' ?>">Manage Villas</a>
    <a href="land.php" class="<?= $current === 'land.php' ? 'active' : '' ?>">Manage Land</a>
    <a href="logout.php" style="margin-left:auto;">Logout</a>
</div>

<div class="container my-4">
