<?php
// villa.php – page détail d'une villa

require_once __DIR__ . '/config.php';

// Récupération de la villa par ID (ou slug si tu utilises des slugs)
$villa = null;

$id   = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

try {
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM villas WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $villa = $stmt->fetch(PDO::FETCH_ASSOC);
    } elseif ($slug !== '') {
        $stmt = $pdo->prepare("SELECT * FROM villas WHERE slug = :slug");
        $stmt->execute([':slug' => $slug]);
        $villa = $stmt->fetch(PDO::FETCH_ASSOC);
    }
} catch (PDOException $e) {
    die('Database error: ' . htmlspecialchars($e->getMessage()));
}

if (!$villa) {
    http_response_code(404);
    $pageTitle = 'Villa not found – RumahYa';
    require_once __DIR__ . '/common/header.php';
    ?>
    <main class="container" style="margin-top:40px;margin-bottom:40px;">
        <h1>Villa not found</h1>
        <p>The villa you are looking for does not exist or is no longer available.</p>
        <a href="/rentals.php" class="btn btn-primary mt-3">Back to all villas</a>
    </main>
    <?php
    require_once __DIR__ . '/common/footer.php';
    exit;
}

// Images : on prend les 5 premières
$allImages = [];
if (!empty($villa['images'])) {
    $allImages = array_filter(array_map('trim', explode(',', $villa['images'])));
}
$thumbs    = array_slice($allImages, 0, 5);
$mainImage = $thumbs[0] ?? '/assets/lombok.jpg';

// Champs
$title       = $villa['title'] ?? '';
$location    = $villa['location'] ?? '';
$price       = $villa['price'] ?? '';      // interprété comme "million IDR / month"
$duration    = $villa['duration'] ?? '';   // min term (months)
$bedrooms    = $villa['bedrooms'] ?? '';
$bathrooms   = $villa['bathrooms'] ?? '';
$pool        = !empty($villa['pool']);
$garden      = !empty($villa['garden']);
$is_finished = !empty($villa['is_finished']);
$description = $villa['description'] ?? '';

$pageTitle = ($title ? $title . ' – ' : '') . 'RumahYa';
require_once __DIR__ . '/common/header.php';
?>

<style>
/* Galerie de vignettes */
.villa-hero {
    margin-top: 24px;
    margin-bottom: 24px;
}

.villa-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
}

/* Chaque vignette a une taille fixe ~140x100 px */
.villa-gallery-item {
    flex: 0 0 140px;
    max-width: 140px;
    height: 100px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
    background: #e5e7eb;
}

/* On force la taille ici pour écraser les styles globaux type img {height:auto;} */
.villa-gallery-item img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    display: block;
}

@media (max-width: 768px) {
    .villa-gallery-item {
        flex: 0 0 48%;
        max-width: 48%;
    }
}

@media (max-width: 480px) {
    .villa-gallery-item {
        flex: 0 0 100%;
        max-width: 100%;
    }
}

/* Meta / info blocs */
.villa-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin: 24px 0;
}

.villa-meta-item {
    background: #f9fafb;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 0.95rem;
}

.villa-meta-label {
    font-weight: 600;
    color: #6b7280;
    display: block;
    margin-bottom: 2px;
}

.villa-meta-value {
    color: #111827;
}

/* Calendrier front */
#availability-calendar {
    max-width: 420px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    padding: 16px;
    margin: 24px 0 40px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.av-cal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.av-cal-header button {
    border: none;
    background: #e5e7eb;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
}
.av-cal-header button:hover {
    background: #d1d5db;
}
.av-cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    font-size: 12px;
}
.av-cal-dayname {
    text-align: center;
    font-weight: 600;
    color: #6b7280;
}
.av-cal-cell {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 12px;
}
.av-cal-cell-empty {
    background: transparent;
}
.av-cal-cell-available {
    background: #ecfdf5;
    color: #065f46;
}
.av-cal-cell-unavailable {
    background: #e5e7eb;
    color: #4b5563;
}
</style>

<main class="container" style="margin-top:32px;margin-bottom:40px;">

    <a href="/rentals.php" class="btn btn-secondary mb-3">&larr; Back to all villas</a>

    <header class="villa-hero">
        <h1 class="section-title"><?= htmlspecialchars($title) ?></h1>
        <?php if ($location): ?>
            <p class="section-subtitle"><?= htmlspecialchars($location) ?></p>
        <?php endif; ?>
    </header>

    <!-- Galerie : 5 vignettes max -->
    <?php if ($thumbs): ?>
        <div class="villa-gallery">
            <?php foreach ($thumbs as $img): ?>
                <div class="villa-gallery-item">
                    <img src="/uploads/<?= htmlspecialchars($img) ?>"
                         alt="<?= htmlspecialchars($title) ?>">
                </div>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <div class="villa-gallery">
            <div class="villa-gallery-item">
                <img src="<?= htmlspecialchars($mainImage) ?>" alt="<?= htmlspecialchars($title) ?>">
            </div>
        </div>
    <?php endif; ?>

    <!-- Meta -->
    <section class="villa-meta">
        <?php if ($price !== ''): ?>
            <div class="villa-meta-item">
                <span class="villa-meta-label">Price</span>
                <span class="villa-meta-value">
                    <?= htmlspecialchars($price) ?> million IDR / month
                </span>
            </div>
        <?php endif; ?>

        <?php if ($duration !== ''): ?>
            <div class="villa-meta-item">
                <span class="villa-meta-label">Minimum term</span>
                <span class="villa-meta-value">
                    <?= htmlspecialchars($duration) ?> months
                </span>
            </div>
        <?php endif; ?>

        <?php if ($bedrooms !== '' && $bedrooms !== null): ?>
            <div class="villa-meta-item">
                <span class="villa-meta-label">Bedrooms</span>
                <span class="villa-meta-value"><?= htmlspecialchars($bedrooms) ?></span>
            </div>
        <?php endif; ?>

        <?php if ($bathrooms !== '' && $bathrooms !== null): ?>
            <div class="villa-meta-item">
                <span class="villa-meta-label">Bathrooms</span>
                <span class="villa-meta-value"><?= htmlspecialchars($bathrooms) ?></span>
            </div>
        <?php endif; ?>

        <div class="villa-meta-item">
            <span class="villa-meta-label">Pool</span>
            <span class="villa-meta-value"><?= $pool ? 'Yes' : 'No' ?></span>
        </div>

        <div class="villa-meta-item">
            <span class="villa-meta-label">Garden</span>
            <span class="villa-meta-value"><?= $garden ? 'Yes' : 'No' ?></span>
        </div>

        <div class="villa-meta-item">
            <span class="villa-meta-label">Status</span>
            <span class="villa-meta-value"><?= $is_finished ? 'Finished' : 'Under construction' ?></span>
        </div>
    </section>

    <!-- Description -->
    <?php if ($description): ?>
        <section class="mt-4">
            <h2 class="section-title">Description</h2>
            <p><?= nl2br(htmlspecialchars($description)) ?></p>
        </section>
    <?php endif; ?>

    <!-- Disponibilités -->
    <section class="mt-5">
        <h2 class="section-title">Availability</h2>
        <p class="section-subtitle">Grey dates are unavailable.</p>
        <div id="availability-calendar"
             data-villa-id="<?= (int)$villa['id'] ?>"></div>
    </section>

</main>

<script>
(function () {
    const container = document.getElementById('availability-calendar');
    if (!container) return;

    const villaId = container.getAttribute('data-villa-id');
    if (!villaId) return;

    let unavailableRanges = [];
    let current = new Date();

    function fetchData() {
        fetch('/api/villa_availability.php?id=' + encodeURIComponent(villaId))
            .then(r => r.json())
            .then(data => {
                unavailableRanges = (data || []).map(p => ({
                    start: new Date(p.start_date),
                    end: new Date(p.end_date)
                }));
                renderCalendar();
            })
            .catch(() => {
                unavailableRanges = [];
                renderCalendar();
            });
    }

    function isUnavailable(date) {
        for (const r of unavailableRanges) {
            const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const s = new Date(r.start.getFullYear(), r.start.getMonth(), r.start.getDate());
            const e = new Date(r.end.getFullYear(), r.end.getMonth(), r.end.getDate());
            if (d >= s && d <= e) {
                return true;
            }
        }
        return false;
    }

    function renderCalendar() {
        const year  = current.getFullYear();
        const month = current.getMonth();

        const firstOfMonth = new Date(year, month, 1);
        const lastOfMonth  = new Date(year, month + 1, 0);
        const startWeekday = firstOfMonth.getDay();

        const monthNames = [
            'January','February','March','April','May','June',
            'July','August','September','October','November','December'
        ];
        const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

        let html = '<div class="av-cal-header">';
        html += '<button type="button" data-prev>&lt;</button>';
        html += '<div>' + monthNames[month] + ' ' + year + '</div>';
        html += '<button type="button" data-next>&gt;</button>';
        html += '</div>';

        html += '<div class="av-cal-grid">';

        for (const d of dayNames) {
            html += '<div class="av-cal-dayname">' + d + '</div>';
        }

        for (let i = 0; i < startWeekday; i++) {
            html += '<div class="av-cal-cell av-cal-cell-empty"></div>';
        }

        for (let day = 1; day <= lastOfMonth.getDate(); day++) {
            const date = new Date(year, month, day);
            const unavailable = isUnavailable(date);
            const cls = unavailable ? 'av-cal-cell-unavailable' : 'av-cal-cell-available';
            html += '<div class="av-cal-cell ' + cls + '">' + day + '</div>';
        }

        html += '</div>';

        container.innerHTML = html;

        const prevBtn = container.querySelector('[data-prev]');
        const nextBtn = container.querySelector('[data-next]');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                current = new Date(year, month - 1, 1);
                renderCalendar();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                current = new Date(year, month + 1, 1);
                renderCalendar();
            });
        }
    }

    fetchData();
})();
</script>

<?php require_once __DIR__ . '/common/footer.php'; ?>
