<?php
// admin/villas.php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();
require_once __DIR__ . '/admin_header.php';

$error  = '';
$villas = [];

try {
    $stmt = $pdo->query("
        SELECT id, title, location, price, duration, images
        FROM villas
        ORDER BY id DESC
    ");
    $villas = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $error = 'Database error while loading villas: ' . $e->getMessage();
}

/**
 * Cover image à partir du champ images ("villa1.jpg,villa2.jpg").
 */
function admin_villa_cover(?string $imagesField): string
{
    if (!$imagesField || trim($imagesField) === '') {
        return '/assets/lombok.jpg';
    }
    $parts = array_filter(array_map('trim', explode(',', $imagesField)));
    if (!$parts) {
        return '/assets/lombok.jpg';
    }
    $first = $parts[0];
    if (strpos($first, '/') === false) {
        $first = '/uploads/' . $first;
    }
    return $first;
}
?>

<h1 class="mb-4">Villas</h1>

<div class="mb-3 d-flex justify-content-between align-items-center">
    <a href="add_villa.php" class="btn btn-primary">+ Add new villa</a>
    <!-- On ne remet PAS de bouton Manage land ici, il est déjà dans la barre de navigation -->
</div>

<?php if ($error): ?>
    <div class="admin-alert admin-alert-error">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<?php if (!$villas): ?>
    <p>No villas in the database yet.</p>
<?php else: ?>
    <table class="table table-bordered align-middle">
        <thead>
        <tr>
            <th>ID</th>
            <th>Cover</th>
            <th>Title</th>
            <th>Location</th>
            <th>Price (IDR)</th>
            <th>Min term (months)</th>
            <th style="width:220px;">Actions</th>
        </tr>
        </thead>
        <tbody>
        <?php foreach ($villas as $v): ?>
            <tr>
                <td><?= (int)$v['id'] ?></td>
                <td>
                    <img src="<?= htmlspecialchars(admin_villa_cover($v['images'] ?? null)) ?>"
                         alt=""
                         class="list-thumb">
                </td>
                <td><?= htmlspecialchars($v['title']) ?></td>
                <td><?= htmlspecialchars($v['location']) ?></td>
                <td><?= htmlspecialchars($v['price']) ?></td>
                <td><?= htmlspecialchars($v['duration']) ?></td>
                <td>
                    <a href="edit_villa.php?id=<?= (int)$v['id'] ?>"
                       class="btn btn-sm btn-outline-primary me-1">Edit</a>
                    <a href="villa_availability.php?villa_id=<?= (int)$v['id'] ?>"
                       class="btn btn-sm btn-outline-secondary me-1">Availability</a>
                    <a href="delete_villa.php?id=<?= (int)$v['id'] ?>"
                       class="btn btn-sm btn-outline-danger"
                       onclick="return confirm('Delete this villa?');">Delete</a>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
<?php endif; ?>

<?php
require_once __DIR__ . '/admin_footer.php';
