<?php
session_start();
require_once __DIR__ . '/../db_connect.php';

// Si déjà connecté, redirection vers la liste des villas
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: villas.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === '' || $password === '') {
        $error = 'Please fill in both fields.';
    } else {
        try {
            $stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // Comparaison simple en clair (comme ton ancien code)
                if ($password === $user['password_hash']) {
                    // Login OK
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_username']  = $user['username'];
                    $_SESSION['admin_id']        = $user['id'];

                    header('Location: villas.php');
                    exit;
                } else {
                    $error = 'Invalid username or password.';
                }
            } else {
                $error = 'Invalid username or password.';
            }
        } catch (PDOException $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RumahYa Admin Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles_admin.css">
</head>
<body class="admin-login-body">
<div class="admin-login-wrapper">
    <div class="admin-login-card">
        <h1 class="admin-login-title">RumahYa Admin</h1>
        <p class="admin-login-subtitle">Sign in to manage villas and land.</p>

        <?php if ($error): ?>
            <div class="admin-alert admin-alert-error">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="post" class="admin-login-form">
            <label class="admin-label">
                Username
                <input type="text" name="username" class="admin-input" required>
            </label>

            <label class="admin-label">
                Password
                <input type="password" name="password" class="admin-input" required>
            </label>

            <button type="submit" class="admin-button-primary">Login</button>
        </form>
    </div>
</div>
</body>
</html>
