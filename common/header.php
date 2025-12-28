<?php
// common/header.php
$currentPage = basename($_SERVER['PHP_SELF'], '.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RumahYa – Lombok long-term rentals &amp; land</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Feuille de style principale -->
    <link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="site-header">
    <div class="container header-inner">

        <!-- Logo / marque -->
        <a href="index.php" class="brand">
            <div class="brand-logo"></div>
            <div class="brand-text">
                <div class="brand-name"><span>Rumah</span>Ya</div>
                <div class="brand-tagline">Lombok long-term rentals &amp; land</div>
            </div>
        </a>

        <!-- Bouton hamburger (mobile) -->
        <button class="nav-toggle" type="button" aria-label="Toggle navigation" id="navToggle">
            <span></span>
            <span></span>
            <span></span>
        </button>

        <!-- Navigation principale -->
        <nav class="nav-main" id="primaryNav">
            <a href="index.php"
               class="<?php echo $currentPage === 'index' ? 'nav-active' : ''; ?>">
                Home
            </a>
            <a href="rentals.php"
               class="<?php echo $currentPage === 'rentals' ? 'nav-active' : ''; ?>">
                Rentals
            </a>
            <a href="land.php"
               class="<?php echo $currentPage === 'land' ? 'nav-active' : ''; ?>">
                Land
            </a>
            <a href="property-management.php"
               class="<?php echo $currentPage === 'property-management' ? 'nav-active' : ''; ?>">
                Property Management
            </a>
            <a href="contact.php"
               class="<?php echo $currentPage === 'contact' ? 'nav-active' : ''; ?>">
                Contact
            </a>
        </nav>
    </div>
</header>

<main class="page-main">
    <div class="container">
