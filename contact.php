<?php
require_once __DIR__ . '/config.php';
$pageTitle = 'Contact – RumahYa';

$sent = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ici tu peux ajouter un envoi d'email réel si tu le souhaites.
    // Pour l'instant, on se contente d'afficher un message de confirmation.
    $sent = true;
}

require_once __DIR__ . '/common/header.php';
?>
<div class="container">
    <div class="section-header">
        <h1 class="section-title">Contact</h1>
        <p class="section-subtitle">
            Tell us what you’re looking for and we’ll get back to you with options or next steps.
        </p>
    </div>

    <?php if ($sent): ?>
        <div class="section-block" style="border-left:4px solid var(--primary);">
            <h2>Thank you!</h2>
            <p>
                We’ve received your message. We’ll get back to you as soon as possible.
            </p>
        </div>
    <?php endif; ?>

    <div class="section-block">
        <h2>Send us a message</h2>
        <form method="post">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
                <div>
                    <label for="c-name" style="font-size:0.85rem;color:var(--text-muted);">Name</label><br>
                    <input id="c-name" type="text" name="name" required
                           style="width:100%;padding:8px 10px;border-radius:10px;border:1px solid var(--border-subtle);">
                </div>
                <div>
                    <label for="c-email" style="font-size:0.85rem;color:var(--text-muted);">Email</label><br>
                    <input id="c-email" type="email" name="email" required
                           style="width:100%;padding:8px 10px;border-radius:10px;border:1px solid var(--border-subtle);">
                </div>
            </div>
            <div style="margin-top:10px;">
                <label for="c-message" style="font-size:0.85rem;color:var(--text-muted);">Message</label><br>
                <textarea id="c-message" name="message" rows="5" required
                          style="width:100%;padding:8px 10px;border-radius:10px;border:1px solid var(--border-subtle);"></textarea>
            </div>
            <button class="button" type="submit" style="margin-top:12px;">Send message</button>
        </form>
    </div>

    <div class="section-block">
        <h2>Other ways to reach us</h2>
        <p><strong>WhatsApp:</strong> +62 812 3456 7890</p>
        <p><strong>Email:</strong> info@rumahya.com</p>
        <p><strong>Location:</strong> Kuta, Lombok – Indonesia</p>
    </div>
</div>

<?php require_once __DIR__ . '/common/footer.php'; ?>
