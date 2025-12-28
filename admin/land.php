<?php
// admin/land.php
require_once __DIR__ . '/common.php';
ensure_admin_logged_in();
require_once __DIR__ . '/admin_header.php';

$error = '';
$lands = [];

try {
    $stmt = $pdo->query("SELECT id, title, location, area, price, tenure, image FROM lands ORDER BY id DESC");
    $lands = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $error = 'Database error while loading land: ' . $e->getMessage();
}

function admin_land_cover(?string $image): string
{
    if (!$image || trim($image) === '') {
        return '/assets/lombok.jpg';
    }
    if (strpos($image, '/') === false) {
        return '/uploads/' . $image;
    }
    return $image;
}
?>

<h1 class="mb-4">Land</h1>

<div class="mb-3 d-flex justify-content-between align-items-center">
    <a href="add_land.php" class="btn btn-primary">+ Add new land</a>
</div>

<?php if ($error): ?>
    <div class="admin-alert admin-alert-error">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<?php if (!$lands): ?>
    <p>No land listings in the database yet.</p>
<?php else: ?>
    <table class="table table-bordered align-middle">
        <thead>
        <tr>
            <th>ID</th>
            <th>Cover</th>
            <th>Title</th>
            <th>Location</th>
            <th>Area (are)</th>
            <th>Price (mil IDR)</th>
            <th>Tenure</th>
            <th style="width:180px;">Actions</th>
        </tr>
        </thead>
        <tbody>
        <?php foreach ($lands as $l): ?>
            <tr>
                <td><?= (int)$l['id'] ?></td>
                <td>
                    <img class="list-thumb"
                         src="<?= htmlspecialchars(admin_land_cover($l['image'] ?? null)) ?>"
                         alt="">
                </td>
                <td><?= htmlspecialchars($l['title']) ?></td>
                <td><?= htmlspecialchars($l['location']) ?></td>
                <td><?= htmlspecialchars($l['area']) ?></td>
                <td><?= htmlspecialchars($l['price']) ?></td>
                <td><?= htmlspecialchars($l['tenure']) ?></td>
                <td>
                    <a class="btn btn-sm btn-outline-primary me-1"
                       href="edit_land.php?id=<?= (int)$l['id'] ?>">Edit</a>
                    <a class="btn btn-sm btn-outline-danger"
                       href="delete_land.php?id=<?= (int)$l['id'] ?>"
                       onclick="return confirm('Delete this land?');">Delete</a>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
<?php endif; ?>

<?php require_once __DIR__ . '/admin_footer.php'; ?>
