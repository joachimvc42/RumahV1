<?php
// admin/admin.php
// Page d’accueil admin : accès cohérent aux villas et aux terrains.

require __DIR__ . '/admin_header.php';
?>

<div class="container mt-4">

    <h1 class="mb-4">RumahYa admin</h1>
    <p class="text-muted mb-4">
        Gérer les villas et terrains, ou ajouter rapidement de nouveaux biens.
    </p>

    <div class="row g-4">

        <!-- Bloc Villas -->
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h2 class="h5 mb-2">Villas</h2>
                <p class="mb-3 text-muted">
                    Gérer les locations long terme (prix en millions IDR / mois, min. term, etc.).
                </p>
                <div class="d-flex flex-wrap gap-2">
                    <!-- Liste des villas -->
                    <a href="villas.php" class="btn btn-primary">
                        Manage villas
                    </a>
                    <!-- Ajout de villa (ancien bouton ADVILA) -->
                    <a href="add_villa.php" class="btn btn-outline-secondary">
                        ADVILA &nbsp;–&nbsp; Add villa
                    </a>
                </div>
            </div>
        </div>

        <!-- Bloc Land -->
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h2 class="h5 mb-2">Land</h2>
                <p class="mb-3 text-muted">
                    Gérer les terrains (freehold / leasehold, accès, eau, électricité, etc.).
                </p>
                <div class="d-flex flex-wrap gap-2">
                    <!-- Liste des terrains -->
                    <a href="land.php" class="btn btn-primary">
                        Manage land
                    </a>
                    <!-- Ajout de terrain (ancien bouton ADLENT) -->
                    <a href="add_land.php" class="btn btn-outline-secondary">
                        ADLENT &nbsp;–&nbsp; Add land
                    </a>
                </div>
            </div>
        </div>

    </div>
</div>

<?php
require __DIR__ . '/admin_footer.php';
?>
