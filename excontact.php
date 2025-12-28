<?php
require_once __DIR__ . '/config.php';
$pageTitle = 'Contact – RumahYa';
require_once __DIR__ . '/common/header.php';
?>
<section class="container fade-in-up">
    <h1 class="section-title">Contact</h1>
    <p class="section-subtitle">
        Reach out to discuss a specific villa, land opportunity or property management request.
    </p>

    <div class="contact-grid">
        <div class="section-block">
            <h2>Talk to us</h2>
            <p>
                We are based in Lombok and usually available during normal business hours (WITA).
                The fastest way to reach us is via WhatsApp.
            </p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/6281234567890" target="_blank">+62 812 3456 7890</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@rumahya.com">info@rumahya.com</a></p>
            <p><strong>Location:</strong> Kuta, Lombok – Indonesia</p>
        </div>

        <div class="section-block">
            <h2>Quick message</h2>
            <form>
                <div style="margin-bottom:10px;">
                    <label for="name" style="display:block;font-size:0.85rem;margin-bottom:3px;">Name</label>
                    <input id="name" type="text" style="width:100%;padding:6px 8px;border-radius:8px;border:1px solid var(--border-subtle);">
                </div>
                <div style="margin-bottom:10px;">
                    <label for="email" style="display:block;font-size:0.85rem;margin-bottom:3px;">Email</label>
                    <input id="email" type="email" style="width:100%;padding:6px 8px;border-radius:8px;border:1px solid var(--border-subtle);">
                </div>
                <div style="margin-bottom:10px;">
                    <label for="message" style="display:block;font-size:0.85rem;margin-bottom:3px;">Message</label>
                    <textarea id="message" rows="4" style="width:100%;padding:6px 8px;border-radius:8px;border:1px solid var(--border-subtle);"></textarea>
                </div>
                <button type="button" class="button-outline">Send</button>
                <p style="font-size:0.8rem;color:var(--text-muted);margin-top:6px;">
                    (Form is for demonstration; please use WhatsApp or email for real requests.)
                </p>
            </form>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/common/footer.php'; ?>
