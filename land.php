<?php
require_once __DIR__ . '/config.php';
$pageTitle = 'Land – RumahYa';
require_once __DIR__ . '/common/header.php';

// Filters
$locationFilter    = trim($_GET['location'] ?? '');
$minPriceFilter    = trim($_GET['min_price'] ?? '');
$maxPriceFilter    = trim($_GET['max_price'] ?? '');
$minAreaFilter     = trim($_GET['min_area'] ?? '');
$waterFilter       = isset($_GET['water']) && $_GET['water'] === '1';
$electricityFilter = isset($_GET['electricity']) && $_GET['electricity'] === '1';
$roadFilter        = isset($_GET['road']) && $_GET['road'] === '1';
$freeholdFilter    = isset($_GET['freehold']) && $_GET['freehold'] === '1';
$leaseholdFilter   = isset($_GET['leasehold']) && $_GET['leasehold'] === '1';

$where  = [];
$params = [];

// Location LIKE, suggestions via API côté front
if ($locationFilter !== '') {
    $where[]             = 'location LIKE :location';
    $params[':location'] = '%' . $locationFilter . '%';
}

// Area min
if ($minAreaFilter !== '' && is_numeric($minAreaFilter)) {
    $where[]             = 'area >= :min_area';
    $params[':min_area'] = (float)$minAreaFilter;
}

// Prix par are (M IDR)
if ($minPriceFilter !== '' && is_numeric($minPriceFilter)) {
    $where[]              = 'price >= :min_price';
    $params[':min_price'] = (float)$minPriceFilter;
}
if ($maxPriceFilter !== '' && is_numeric($maxPriceFilter)) {
    $where[]              = 'price <= :max_price';
    $params[':max_price'] = (float)$maxPriceFilter;
}

// Flags booléens
if ($waterFilter) {
    $where[] = '(has_water = 1 OR water = 1)';
}
if ($electricityFilter) {
    $where[] = '(has_electricity = 1 OR electricity = 1)';
}
if ($roadFilter) {
    $where[] = '(road_access = 1 OR road = 1)';
}
if ($freeholdFilter && !$leaseholdFilter) {
    $where[]                     = 'tenure = :tenure_freehold';
    $params[':tenure_freehold']  = 'freehold';
}
if ($leaseholdFilter && !$freeholdFilter) {
    $where[]                     = 'tenure = :tenure_leasehold';
    $params[':tenure_leasehold'] = 'leasehold';
}

// Build query
$sql = "SELECT * FROM lands";
if ($where) {
    $sql .= " WHERE " . implode(' AND ', $where);
}
$sql .= " ORDER BY id DESC";

$lands = [];
$error = '';

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $lands = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $error = 'Database error while loading lands: ' . $e->getMessage();
}
?>
<style>
.land-intro {
    margin-top: 32px;
    margin-bottom: 8px;
}

.land-shell {
    margin-top: 16px;
    margin-bottom: 32px;
}

.land-layout {
    display: flex;
    gap: 24px;
    align-items: stretch;
}

/* Sidebar pleine hauteur */
.land-sidebar {
    width: 260px;
    min-width: 260px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    padding: 20px 18px;
    font-size: 0.95rem;
    display: flex;
    flex-direction: column;
}

.land-sidebar h2 {
    font-size: 1rem;
    margin-bottom: 12px;
}

.land-sidebar .filter-checkbox {
    display: flex;
    align-items: center;
    margin-top: 8px;
}

.land-sidebar .filter-checkbox input {
    margin-right: 8px;
}

/* Colonne droite */
.land-main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Barre de filtres en pill */
.land-filters-pill {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    background: #ffffff;
    border-radius: 999px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    overflow: hidden;
}

.land-filter-segment {
    flex: 1 1 0;
    min-width: 0;
    padding: 10px 16px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
}

/* WHERE un peu plus large pour éviter que "Lombok" soit coupé */
.land-filter-segment-where {
    flex: 1.4 1 0;
}

.land-filter-segment:last-of-type {
    border-right: none;
}

.land-filter-label-top {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6b7280;
    margin-bottom: 2px;
}

.land-filter-input-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #111827;
}

/* Champs bien visibles */
.land-filter-input-line input {
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

.land-filter-input-line input:focus {
    border-color: #2563eb;
    background: #ffffff;
}

/* Prix min / max */
.land-price-range {
    display: flex;
    gap: 6px;
    width: 100%;
}

.land-price-range input {
    flex: 1 1 0;
}

/* Bouton Apply sur la même ligne */
.land-filter-actions {
    flex: 0 0 auto;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.land-filter-actions button {
    border-radius: 999px;
    white-space: nowrap;
}

/* Cartes */
.land-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 20px;
    margin-bottom: 40px;
}

.property-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.12);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.property-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
}

.property-card-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
}

.property-card-body {
    padding: 12px 14px 14px 14px;
}

.property-card-title {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 4px;
}

.property-card-location {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 6px;
}

.property-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.85rem;
    color: #374151;
    margin-bottom: 4px;
}

.badge-soft {
    background: #f3f4f6;
    border-radius: 999px;
    padding: 3px 8px;
}

.property-card-price {
    font-weight: 600;
    margin-top: 4px;
}

/* Suggestions de localisation */
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
    .land-layout {
        flex-direction: column;
    }
    .land-sidebar {
        width: 100%;
        min-width: 0;
    }
    .land-filters-pill {
        border-radius: 16px;
        flex-direction: column;
        flex-wrap: nowrap;
    }
    .land-filter-segment {
        border-right: none;
        border-bottom: 1px solid #e5e7eb;
    }
    .land-filter-segment:last-of-type {
        border-bottom: none;
    }
}
</style>

<section class="land-intro">
    <h1>Land</h1>
    <p class="section-subtitle">
        Hand-picked plots of land across Lombok. Click a card to see key details
        about size, tenure and utilities.
    </p>
</section>

<section class="land-shell">
    <form method="get">
        <div class="land-layout">

            <!-- Sidebar -->
            <aside class="land-sidebar">
                <h2>Extra filters</h2>
                <div class="filter-checkbox">
                    <input type="checkbox" id="filter-water" name="water" value="1" <?= $waterFilter ? 'checked' : '' ?>>
                    <label for="filter-water">Water</label>
                </div>
                <div class="filter-checkbox">
                    <input type="checkbox" id="filter-electricity" name="electricity" value="1" <?= $electricityFilter ? 'checked' : '' ?>>
                    <label for="filter-electricity">Electricity</label>
                </div>
                <div class="filter-checkbox">
                    <input type="checkbox" id="filter-road" name="road" value="1" <?= $roadFilter ? 'checked' : '' ?>>
                    <label for="filter-road">Road access</label>
                </div>
                <div class="filter-checkbox">
                    <input type="checkbox" id="filter-freehold" name="freehold" value="1" <?= $freeholdFilter ? 'checked' : '' ?>>
                    <label for="filter-freehold">Freehold</label>
                </div>
                <div class="filter-checkbox">
                    <input type="checkbox" id="filter-leasehold" name="leasehold" value="1" <?= $leaseholdFilter ? 'checked' : '' ?>>
                    <label for="filter-leasehold">Leasehold</label>
                </div>
            </aside>

            <!-- Colonne droite -->
            <section class="land-main">

                <!-- Barre de filtres -->
                <div class="land-filters-pill">

                    <!-- WHERE -->
                    <div class="land-filter-segment land-filter-segment-where" id="land-where-segment">
                        <div class="land-filter-label-top">Where</div>
                        <div class="land-filter-input-line">
                            <input
                                type="text"
                                id="land-filter-location"
                                name="location"
                                autocomplete="off"
                                placeholder="Search areas in Lombok"
                                value="<?= htmlspecialchars($locationFilter) ?>">
                        </div>
                        <div id="land-location-suggestions" class="location-suggestions" style="display:none;"></div>
                    </div>

                    <!-- AREA -->
                    <div class="land-filter-segment">
                        <div class="land-filter-label-top">Area</div>
                        <div class="land-filter-input-line">
                            <span style="font-size:0.8rem;color:#6b7280;">Minimum size</span>
                            <input
                                type="number"
                                name="min_area"
                                min="0"
                                step="0.1"
                                value="<?= htmlspecialchars($minAreaFilter) ?>">
                            <span style="font-size:0.8rem;color:#6b7280;">are</span>
                        </div>
                    </div>

                    <!-- PRICE -->
                    <div class="land-filter-segment">
                        <div class="land-filter-label-top">Price</div>
                        <div class="land-filter-input-line">
                            <span style="font-size:0.8rem;color:#6b7280;">Per are (M IDR)</span>
                        </div>
                        <div class="land-filter-input-line" style="margin-top:4px;">
                            <div class="land-price-range">
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
                    <div class="land-filter-actions">
                        <button type="submit" class="btn btn-primary">Apply filters</button>
                    </div>
                </div>

                <!-- Résultats -->
                <?php if ($error): ?>
                    <div class="admin-alert admin-alert-error" style="margin-top:16px;">
                        <?= htmlspecialchars($error) ?>
                    </div>
                <?php endif; ?>

                <?php if (!$lands): ?>
                    <p style="margin-top:16px;">No land plots match your criteria yet.</p>
                <?php else: ?>
                    <section class="land-grid">
                        <?php foreach ($lands as $land): ?>
                            <?php
                            // IMAGE: col "image" ou "images" -> /uploads
                            $cover = '';
                            if (!empty($land['image'])) {
                                $cover = '/uploads/' . ltrim($land['image'], '/');
                            } elseif (!empty($land['images'])) {
                                $imgs = array_filter(array_map('trim', explode(',', $land['images'])));
                                if (!empty($imgs)) {
                                    $cover = '/uploads/' . ltrim($imgs[0], '/');
                                }
                            }
                            if ($cover === '') {
                                $cover = '/assets/lombok.jpg';
                            }

                            $area  = isset($land['area']) ? (float)$land['area'] : 0;
                            $price = $land['price'] ?? '';
                            $loc   = $land['location'] ?? '';
                            $title = $land['title'] ?? 'Land plot';

                            $hasWater       = !empty($land['has_water']) || !empty($land['water']);
                            $hasElectricity = !empty($land['has_electricity']) || !empty($land['electricity']);
                            $hasRoad        = !empty($land['road_access']) || !empty($land['road']);
                            $isVirgin       = !empty($land['virgin']);
                            $tenure         = $land['tenure'] ?? '';
                            ?>
                            <article class="property-card">
                                <img src="<?= htmlspecialchars($cover) ?>" alt="" class="property-card-img">
                                <div class="property-card-body">
                                    <h2 class="property-card-title"><?= htmlspecialchars($title) ?></h2>
                                    <?php if ($loc): ?>
                                        <div class="property-card-location"><?= htmlspecialchars($loc) ?></div>
                                    <?php endif; ?>
                                    <div class="property-card-meta">
                                        <?php if ($area > 0): ?>
                                            <span class="badge-soft"><?= $area ?> are</span>
                                        <?php endif; ?>
                                        <?php if ($tenure): ?>
                                            <span class="badge-soft"><?= htmlspecialchars($tenure) ?></span>
                                        <?php endif; ?>
                                        <?php if ($hasElectricity): ?>
                                            <span class="badge-soft">Electricity</span>
                                        <?php endif; ?>
                                        <?php if ($hasWater): ?>
                                            <span class="badge-soft">Water</span>
                                        <?php endif; ?>
                                        <?php if ($hasRoad): ?>
                                            <span class="badge-soft">Road access</span>
                                        <?php endif; ?>
                                        <?php if ($isVirgin): ?>
                                            <span class="badge-soft">Virgin land</span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="property-card-price">
                                        <?php if ($price !== ''): ?>
                                            Price <?= htmlspecialchars($price) ?> / are
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

<script>
// Autocomplete localisation (même API que rentals)
(function () {
    const input = document.getElementById('land-filter-location');
    const list  = document.getElementById('land-location-suggestions');
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
