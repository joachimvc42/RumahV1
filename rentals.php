<?php
// rentals.php – liste des villas / long-term rentals

require_once __DIR__ . '/config.php';

$pageTitle       = 'Long-term rentals – RumahYa';
$pageDescription = 'Browse villas and houses available for long-term rentals across Lombok. Click a card to see full details.';

// Filtres
$locationFilter     = trim($_GET['location'] ?? '');
$startDateFilter    = trim($_GET['start_date'] ?? '');
$minPriceFilter     = trim($_GET['min_price'] ?? '');
$maxPriceFilter     = trim($_GET['max_price'] ?? '');
$minDurationFilter  = trim($_GET['min_duration'] ?? '');
$poolFilter         = isset($_GET['pool']) && $_GET['pool'] === '1';
$gardenFilter       = isset($_GET['garden']) && $_GET['garden'] === '1';
$finishedFilter     = isset($_GET['finished']) && $_GET['finished'] === '1';
$unfinishedFilter   = isset($_GET['unfinished']) && $_GET['unfinished'] === '1';

// Normalisation min/max price
if (
    $minPriceFilter !== '' && $maxPriceFilter !== '' &&
    is_numeric($minPriceFilter) && is_numeric($maxPriceFilter) &&
    (float)$minPriceFilter > (float)$maxPriceFilter
) {
    $tmp            = $minPriceFilter;
    $minPriceFilter = $maxPriceFilter;
    $maxPriceFilter = $tmp;
}

// Helper pour extraire le "main area" d'une location
function extract_main_area(string $location): string {
    $parts = preg_split('/[,|-]/', $location);
    return trim($parts[0] ?? '');
}

// Token pour le filtre de zone principale (on prend le premier mot tapé)
$locationToken = '';
if ($locationFilter !== '') {
    $chunks = preg_split('/[,\s]+/', $locationFilter);
    $locationToken = strtolower(trim($chunks[0] ?? ''));
}

$where  = [];
$params = [];

// Prix (en millions IDR / month)
if ($minPriceFilter !== '' && is_numeric($minPriceFilter)) {
    $where[]              = 'price >= :min_price';
    $params[':min_price'] = (float)$minPriceFilter;
}
if ($maxPriceFilter !== '' && is_numeric($maxPriceFilter)) {
    $where[]              = 'price <= :max_price';
    $params[':max_price'] = (float)$maxPriceFilter;
}

// Durée minimale (mois)
if ($minDurationFilter !== '' && is_numeric($minDurationFilter)) {
    $where[]                 = 'duration >= :min_duration';
    $params[':min_duration'] = (int)$minDurationFilter;
}

// Filtres booléens
if ($poolFilter) {
    $where[] = 'pool = 1';
}
if ($gardenFilter) {
    $where[] = 'garden = 1';
}
if ($finishedFilter && !$unfinishedFilter) {
    $where[] = 'is_finished = 1';
}
if ($unfinishedFilter && !$finishedFilter) {
    $where[] = 'is_finished = 0';
}

// Disponibilité ([start, start+minDuration] ne doit pas chevaucher une période bloquée)
if ($startDateFilter !== '') {
    $startDate = date_create_from_format('Y-m-d', $startDateFilter);
    if ($startDate) {
        $months = (is_numeric($minDurationFilter) && (int)$minDurationFilter > 0)
            ? (int)$minDurationFilter
            : 1;

        $endDateObj = clone $startDate;
        $endDateObj->modify('+' . $months . ' month');
        $wantedEnd = $endDateObj->format('Y-m-d');

        $where[] = "NOT EXISTS (
            SELECT 1
            FROM villa_unavailabilities vu
            WHERE vu.villa_id = villas.id
              AND vu.start_date <= :wanted_end
              AND vu.end_date   >= :start_date
        )";

        $params[':start_date'] = $startDateFilter;
        $params[':wanted_end'] = $wantedEnd;
    }
}

// Construction de la requête (sans filtre de localisation pour pouvoir filtrer par main area en PHP)
$sql = "SELECT * FROM villas";
if ($where) {
    $sql .= " WHERE " . implode(' AND ', $where);
}
$sql .= " ORDER BY id DESC";

$villas          = [];
$allVillas       = [];
$suggestedVillas = [];
$error           = '';

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $allVillas = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $error = 'Database error while loading rentals: ' . $e->getMessage();
}

// Filtre "main area" en PHP
if ($locationToken !== '' && $allVillas) {
    foreach ($allVillas as $villa) {
        $loc = strtolower($villa['location'] ?? '');
        if ($loc === '') {
            continue;
        }
        $main = strtolower(extract_main_area($loc));
        if (strpos($main, $locationToken) !== false) {
            $villas[] = $villa;
        }
    }

    if (!$villas) {
        // Pas de résultats dans la zone demandée, on propose d'autres villas
        $suggestedVillas = $allVillas;
    }
} else {
    $villas = $allVillas;
}

require_once __DIR__ . '/common/header.php';
?>

<style>
/* Layout global : vraie colonne gauche + contenu à droite */
.rentals-intro {
    margin-top: 32px;
    margin-bottom: 8px;
}

.rentals-shell {
    margin-top: 16px;
    margin-bottom: 32px;
}

.rentals-layout {
    display: flex;
    gap: 24px;
    align-items: stretch;
}

/* Sidebar pleine hauteur */
.rentals-sidebar {
    width: 260px;
    min-width: 260px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    padding: 20px 18px;
    font-size: 0.95rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.rentals-sidebar h2 {
    font-size: 1rem;
    margin-bottom: 12px;
}

.rentals-sidebar .filter-checkbox {
    display: flex;
    align-items: center;
    margin-top: 8px;
}

.rentals-sidebar .filter-checkbox input {
    margin-right: 8px;
}

/* Colonne droite : barre de filtres + liste */
.rentals-main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Barre de filtres style Airbnb */
.filters-pill {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    background: #ffffff;
    border-radius: 999px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    overflow: hidden;
}

.filter-segment {
    flex: 1 1 0;
    min-width: 0;
    padding: 10px 16px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
}

/* WHERE un peu plus large pour éviter que le placeholder soit coupé mais sans être énorme */
.filter-segment-where {
    flex: 1.2 1 0;
}

.filter-segment:last-of-type {
    border-right: none;
}

.filter-label-top {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6b7280;
    margin-bottom: 2px;
}

.filter-input-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #111827;
}

/* Variante colonne (pour WHEN) */
.filter-input-column {
    flex-direction: column;
    align-items: flex-start;
}

/* Champs textuels clairement visibles (petites box) */
.filter-input-line input {
    border: 1px solid #e5e7eb;
    outline: none;
    background: #f9fafb;
    padding: 6px 10px;
    margin: 0;
    font-size: 0.9rem;
    width: 100%;
    border-radius: 999px;
    box-sizing: border-box;
}

.filter-input-line input:focus {
    border-color: #2563eb;
    background: #ffffff;
}

/* labels inline dans WHEN */
.filter-field-label {
    font-size: 0.8rem;
    color: #6b7280;
    margin-bottom: 2px;
}

/* Ligne prix : 2 inputs côte à côte */
.price-range {
    display: flex;
    gap: 6px;
    width: 100%;
}

.price-range input {
    flex: 1 1 0;
}

/* Segment action : bouton sur la même ligne */
.filter-segment-actions {
    flex: 0 0 auto;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-segment-actions button {
    border-radius: 999px;
    white-space: nowrap;
}

/* Liste des villas */
.rentals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 20px;
    margin-bottom: 40px;
}

.rental-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.rental-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
}

/* Galerie vignettes sur la carte */
.rental-card-gallery {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: #000;
}

.rental-card-thumb {
    flex: 1 1 0;
    height: 90px;
    border-radius: 10px;
    overflow: hidden;
    background: #1f2933;
}

.rental-card-thumb img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    display: block;
}

.rental-card-body {
    padding: 12px 14px 14px 14px;
}

.rental-card-title {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 4px;
}

.rental-card-location {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 8px;
}

.rental-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.85rem;
    color: #374151;
    margin-bottom: 4px;
}

.rental-pill {
    background: #f3f4f6;
    border-radius: 999px;
    padding: 3px 8px;
}

/* Suggestions de localisation (dropdown) */
.location-suggestions {
    position: absolute;
    top: 100%;
    left: 16px;
    right: 16px;
    margin-top: 4px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.18);
    max-height: 260px;
    overflow-y: auto;
    z-index: 20;
}

.location-suggestion-item {
    padding: 8px 10px;
    font-size: 0.9rem;
    cursor: pointer;
}

.location-suggestion-item:hover {
    background: #f3f4f6;
}

/* Responsive */
@media (max-width: 900px) {
    .rentals-layout {
        flex-direction: column;
    }
    .rentals-sidebar {
        width: 100%;
        min-width: 0;
    }
    .filters-pill {
        border-radius: 16px;
        flex-direction: column;
        flex-wrap: nowrap;
    }
    .filter-segment {
        border-right: none;
        border-bottom: 1px solid #e5e7eb;
    }
    .filter-segment:last-of-type {
        border-bottom: none;
    }
}
</style>

<main class="container">

    <section class="rentals-intro">
        <h1>Long-term rentals</h1>
        <p>Browse villas and houses available for long-term rentals across Lombok. Click a card to see full details.</p>
    </section>

    <section class="rentals-shell">
        <form method="get">
            <div class="rentals-layout">

                <!-- Colonne gauche : filters pleine hauteur -->
                <aside class="rentals-sidebar">
                    <h2>Extra filters</h2>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="filter-pool" name="pool" value="1" <?= $poolFilter ? 'checked' : '' ?>>
                        <label for="filter-pool">Swimming pool</label>
                    </div>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="filter-garden" name="garden" value="1" <?= $gardenFilter ? 'checked' : '' ?>>
                        <label for="filter-garden">Garden</label>
                    </div>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="filter-finished" name="finished" value="1" <?= $finishedFilter ? 'checked' : '' ?>>
                        <label for="filter-finished">Finished</label>
                    </div>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="filter-unfinished" name="unfinished" value="1" <?= $unfinishedFilter ? 'checked' : '' ?>>
                        <label for="filter-unfinished">Unfinished</label>
                    </div>
                </aside>

                <!-- Colonne droite : barre de filtres + résultats -->
                <section class="rentals-main">

                    <!-- Barre de filtres type Airbnb -->
                    <div class="filters-pill">

                        <!-- WHERE -->
                        <div class="filter-segment filter-segment-where" id="where-segment">
                            <div class="filter-label-top">Where</div>
                            <div class="filter-input-line">
                                <input
                                    type="text"
                                    id="filter-location"
                                    name="location"
                                    autocomplete="off"
                                    placeholder="Search destinations"
                                    value="<?= htmlspecialchars($locationFilter) ?>">
                            </div>
                            <div id="location-suggestions" class="location-suggestions" style="display:none;"></div>
                        </div>

                        <!-- WHEN -->
                        <div class="filter-segment">
                            <div class="filter-label-top">When</div>

                            <div class="filter-input-line filter-input-column">
                                <span class="filter-field-label">Start date</span>
                                <input
                                    type="date"
                                    id="filter-start-date"
                                    name="start_date"
                                    value="<?= htmlspecialchars($startDateFilter) ?>">
                            </div>

                            <div class="filter-input-line filter-input-column" style="margin-top:6px;">
                                <span class="filter-field-label">Min duration (months)</span>
                                <input
                                    type="number"
                                    id="filter-min-duration"
                                    name="min_duration"
                                    min="1"
                                    max="60"
                                    value="<?= htmlspecialchars($minDurationFilter) ?>">
                            </div>
                        </div>

                        <!-- PRICE -->
                        <div class="filter-segment">
                            <div class="filter-label-top">Price</div>
                            <div class="filter-input-line filter-input-column">
                                <span class="filter-field-label">Per month (M IDR)</span>
                                <div class="price-range" style="margin-top:4px; width:100%;">
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="min_price"
                                        placeholder="Min"
                                        value="<?= htmlspecialchars($minPriceFilter) ?>">
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="max_price"
                                        placeholder="Max"
                                        value="<?= htmlspecialchars($maxPriceFilter) ?>">
                                </div>
                            </div>
                        </div>

                        <!-- ACTION -->
                        <div class="filter-segment-actions">
                            <button type="submit" class="btn btn-primary">Apply filters</button>
                        </div>
                    </div>

                    <!-- Résultats -->
                    <?php if ($error): ?>
                        <div class="admin-alert admin-alert-error" style="margin-top:16px;">
                            <?= htmlspecialchars($error) ?>
                        </div>
                    <?php endif; ?>

                    <?php if (!$villas): ?>
                        <p style="margin-top:16px;">
                            No villas match your criteria<?php if ($locationToken !== ''): ?>
                                in this area
                            <?php endif; ?>.
                        </p>

                        <?php if ($suggestedVillas): ?>
                            <h2 style="margin-top:16px;margin-bottom:8px;">Other villas across Lombok</h2>
                            <section class="rentals-grid">
                                <?php foreach (array_slice($suggestedVillas, 0, 6) as $villa): ?>
                                    <?php
                                    $images  = [];
                                    if (!empty($villa['images'])) {
                                        $images = array_filter(array_map('trim', explode(',', $villa['images'])));
                                    }
                                    $thumbs = array_slice($images, 0, 3);
                                    if (!$thumbs) {
                                        $thumbs = ['/assets/lombok.jpg'];
                                    }

                                    $title    = $villa['title'] ?? '';
                                    $location = $villa['location'] ?? '';
                                    $price    = $villa['price'] ?? '';
                                    $duration = $villa['duration'] ?? '';
                                    $bed      = $villa['bedrooms'] ?? '';
                                    $bath     = $villa['bathrooms'] ?? '';
                                    $hasPool  = !empty($villa['pool']);
                                    $hasGarden= !empty($villa['garden']);
                                    ?>
                                    <article class="rental-card" onclick="window.location.href='villa.php?id=<?= (int)$villa['id'] ?>'">
                                        <div class="rental-card-gallery">
                                            <?php foreach ($thumbs as $img): ?>
                                                <div class="rental-card-thumb">
                                                    <img src="<?= strpos($img, '/') === 0 ? htmlspecialchars($img) : '/uploads/' . htmlspecialchars($img) ?>"
                                                         alt="<?= htmlspecialchars($title) ?>">
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                        <div class="rental-card-body">
                                            <h2 class="rental-card-title"><?= htmlspecialchars($title) ?></h2>
                                            <?php if ($location): ?>
                                                <div class="rental-card-location">
                                                    Location: <?= htmlspecialchars($location) ?>
                                                </div>
                                            <?php endif; ?>
                                            <div class="rental-card-meta">
                                                <?php if ($price !== ''): ?>
                                                    <span class="rental-pill">Price <?= htmlspecialchars($price) ?></span>
                                                <?php endif; ?>
                                                <?php if ($duration !== ''): ?>
                                                    <span class="rental-pill">Min <?= htmlspecialchars($duration) ?> months</span>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </article>
                                <?php endforeach; ?>
                            </section>
                        <?php endif; ?>

                    <?php else: ?>
                        <section class="rentals-grid">
                            <?php foreach ($villas as $villa): ?>
                                <?php
                                $images  = [];
                                if (!empty($villa['images'])) {
                                    $images = array_filter(array_map('trim', explode(',', $villa['images'])));
                                }
                                $thumbs = array_slice($images, 0, 3);
                                if (!$thumbs) {
                                    $thumbs = ['/assets/lombok.jpg'];
                                }

                                $title    = $villa['title'] ?? '';
                                $location = $villa['location'] ?? '';
                                $price    = $villa['price'] ?? '';
                                $duration = $villa['duration'] ?? '';
                                $bed      = $villa['bedrooms'] ?? '';
                                $bath     = $villa['bathrooms'] ?? '';
                                $hasPool  = !empty($villa['pool']);
                                $hasGarden= !empty($villa['garden']);
                                ?>
                                <article class="rental-card" onclick="window.location.href='villa.php?id=<?= (int)$villa['id'] ?>'">
                                    <div class="rental-card-gallery">
                                        <?php foreach ($thumbs as $img): ?>
                                            <div class="rental-card-thumb">
                                                <img src="<?= strpos($img, '/') === 0 ? htmlspecialchars($img) : '/uploads/' . htmlspecialchars($img) ?>"
                                                     alt="<?= htmlspecialchars($title) ?>">
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                    <div class="rental-card-body">
                                        <h2 class="rental-card-title"><?= htmlspecialchars($title) ?></h2>

                                        <?php if ($location): ?>
                                            <div class="rental-card-location">
                                                Location: <?= htmlspecialchars($location) ?>
                                            </div>
                                        <?php endif; ?>

                                        <div class="rental-card-meta">
                                            <?php if ($price !== ''): ?>
                                                <span class="rental-pill">
                                                    Price <?= htmlspecialchars($price) ?>
                                                </span>
                                            <?php endif; ?>

                                            <?php if ($duration !== ''): ?>
                                                <span class="rental-pill">
                                                    Min <?= htmlspecialchars($duration) ?> months
                                                </span>
                                            <?php endif; ?>

                                            <?php if ($bed !== ''): ?>
                                                <span class="rental-pill">
                                                    <?= (int)$bed ?> bedrooms
                                                </span>
                                            <?php endif; ?>

                                            <?php if ($bath !== ''): ?>
                                                <span class="rental-pill">
                                                    <?= (int)$bath ?> bathrooms
                                                </span>
                                            <?php endif; ?>

                                            <?php if ($hasPool): ?>
                                                <span class="rental-pill">Pool</span>
                                            <?php endif; ?>
                                            <?php if ($hasGarden): ?>
                                                <span class="rental-pill">Garden</span>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </article>
                            <?php endforeach; ?>
                        </section>
                    <?php endif; ?>

                </section>
            </div>
        </form>
    </section>

</main>

<script>
// Autocomplete localisation via API interne (OpenStreetMap / Nominatim)
(function () {
    const input = document.getElementById('filter-location');
    const list  = document.getElementById('location-suggestions');
    let timer   = null;

    if (!input || !list) return;

    function clearSuggestions() {
        list.style.display = 'none';
        list.innerHTML = '';
    }

    function showSuggestions(items) {
        if (!items || !items.length) {
            clearSuggestions();
            return;
        }
        list.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'location-suggestion-item';
            div.textContent = item.display_name;
            div.addEventListener('click', () => {
                input.value = item.display_name;
                clearSuggestions();
            });
            list.appendChild(div);
        });
        list.style.display = 'block';
    }

    input.addEventListener('input', function () {
        const q = this.value.trim();
        if (timer) clearTimeout(timer);

        if (q.length < 2) {
            clearSuggestions();
            return;
        }

        timer = setTimeout(() => {
            fetch('/api/location_suggest.php?q=' + encodeURIComponent(q))
                .then(r => r.json())
                .then(showSuggestions)
                .catch(() => clearSuggestions());
        }, 250);
    });

    document.addEventListener('click', function (e) {
        if (!list.contains(e.target) && e.target !== input) {
            clearSuggestions();
        }
    });
})();
</script>

<?php require_once __DIR__ . '/common/footer.php'; ?>
