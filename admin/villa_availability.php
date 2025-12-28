<?php
// admin/villa_availability.php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();

$villaId = isset($_GET['villa_id']) ? (int)$_GET['villa_id'] : 0;
if ($villaId <= 0) {
    header('Location: villas.php');
    exit;
}

// Récup info villa
try {
    $stmt = $pdo->prepare("SELECT id, title FROM villas WHERE id = :id");
    $stmt->execute([':id' => $villaId]);
    $villa = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$villa) {
        header('Location: villas.php');
        exit;
    }
} catch (PDOException $e) {
    die('Database error: ' . $e->getMessage());
}

$errors = [];

// Ajout d’une période bloquée
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $start = $_POST['start_date'] ?? '';
    $end   = $_POST['end_date'] ?? '';

    if (!$start || !$end) {
        $errors[] = 'Both start and end dates are required.';
    } elseif ($start > $end) {
        $errors[] = 'Start date must be before end date.';
    } else {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO villa_unavailabilities (villa_id, start_date, end_date)
                VALUES (:villa_id, :start_date, :end_date)
            ");
            $stmt->execute([
                ':villa_id'   => $villaId,
                ':start_date' => $start,
                ':end_date'   => $end,
            ]);
            header('Location: villa_availability.php?villa_id=' . $villaId);
            exit;
        } catch (PDOException $e) {
            $errors[] = 'Database error while saving availability: ' . $e->getMessage();
        }
    }
}

// Liste des périodes existantes
$periods = [];
try {
    $stmt = $pdo->prepare("
        SELECT id, start_date, end_date
        FROM villa_unavailabilities
        WHERE villa_id = :villa_id
        ORDER BY start_date
    ");
    $stmt->execute([':villa_id' => $villaId]);
    $periods = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Si la table n'existe pas encore, on laisse $periods vide
}

require_once __DIR__ . '/admin_header.php';
?>
<h1 class="mb-4">Availability – <?= htmlspecialchars($villa['title']) ?></h1>

<a href="villas.php" class="btn btn-secondary mb-4">&larr; Back to villas</a>

<?php if ($errors): ?>
    <div class="admin-alert admin-alert-error mb-4">
        <?php foreach ($errors as $e): ?>
            <div><?= htmlspecialchars($e) ?></div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>

<div class="row">
    <div class="col-md-5">
        <h2 class="h5 mb-3">Block new dates</h2>
        <form method="post" class="admin-form mb-4">
            <label>Start date *</label>
            <input type="date" name="start_date" required>

            <label>End date *</label>
            <input type="date" name="end_date" required>

            <button type="submit" class="btn btn-primary mt-2">Add blocked period</button>
        </form>

        <h2 class="h6 mb-2">Existing blocked periods</h2>
        <?php if (!$periods): ?>
            <p class="text-muted">No blocked periods yet.</p>
        <?php else: ?>
            <ul class="list-unstyled">
                <?php foreach ($periods as $p): ?>
                    <li class="mb-1">
                        <?= htmlspecialchars($p['start_date']) ?> → <?= htmlspecialchars($p['end_date']) ?>
                        <a href="delete_villa_unavailability.php?id=<?= (int)$p['id'] ?>&villa_id=<?= $villaId ?>"
                           class="text-danger ms-1"
                           onclick="return confirm('Delete this blocked period?');">
                            delete
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>

    <div class="col-md-7">
        <h2 class="h5 mb-3">Calendar view</h2>
        <p class="text-muted" style="font-size:0.9rem;">
            Grey days are blocked / unavailable.
        </p>
        <div id="availability-calendar-admin"
             data-periods='<?= htmlspecialchars(json_encode($periods), ENT_QUOTES) ?>'>
        </div>
    </div>
</div>

<style>
#availability-calendar-admin {
    max-width: 420px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    padding: 16px;
    margin-bottom: 40px;
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

<script>
(function () {
    const container = document.getElementById('availability-calendar-admin');
    if (!container) return;

    let periods = [];
    try {
        const raw = container.getAttribute('data-periods') || '[]';
        const parsed = JSON.parse(raw);
        periods = parsed.map(p => ({
            start: new Date(p.start_date),
            end: new Date(p.end_date)
        }));
    } catch (e) {
        periods = [];
    }

    let current = new Date();

    function isUnavailable(date) {
        for (const r of periods) {
            // Normalisation sur minuit
            const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const s = new Date(r.start.getFullYear(), r.start.getMonth(), r.start.getDate());
            const e = new Date(r.end.getFullYear(), r.end.getMonth(), r.end.getDate());
            if (d >= s && d <= e) return true;
        }
        return false;
    }

    function renderCalendar() {
        const year = current.getFullYear();
        const month = current.getMonth(); // 0-11

        const firstOfMonth = new Date(year, month, 1);
        const lastOfMonth = new Date(year, month + 1, 0);
        const startWeekday = firstOfMonth.getDay(); // 0=Sun..6=Sat

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

        // noms de jours
        for (const d of dayNames) {
            html += '<div class="av-cal-dayname">' + d + '</div>';
        }

        // cases vides avant le 1er
        for (let i = 0; i < startWeekday; i++) {
            html += '<div class="av-cal-cell av-cal-cell-empty"></div>';
        }

        // jours du mois
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

    renderCalendar();
})();
</script>

<?php require_once __DIR__ . '/admin_footer.php'; ?>
