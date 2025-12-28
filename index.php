<?php
require_once __DIR__ . '/config.php';
$pageTitle = 'RumahYa – Lombok rentals, land & management';
require_once __DIR__ . '/common/header.php';
?>
<section class="hero">
    <div class="container">
        <div class="hero-main">
            <div class="hero-copy-eyebrow">Lombok · Long-term</div>
            <h1 class="hero-title">Find your home in Lombok with trusted local partners.</h1>
            <p class="hero-subtitle">
                RumahYa connects you with verified villas and land rentals, long-term leases and
                premium property management – built on local trust and transparent contracts.
            </p>

            <div class="hero-points">
                <div class="hero-point">
                    <h3>Local partners</h3>
                    <p>
                        We work directly with trusted local owners and a small network of local
                        brokers. You don’t have to guess who is reliable – we only list properties
                        from partners we know and meet on the ground.
                    </p>
                </div>
                <div class="hero-point">
                    <h3>Legal due diligence</h3>
                    <p>
                        When a deal requires it, we involve a local notary or lawyer to review land
                        certificates, ownership and contract terms. The goal is not to make things
                        complicated, but to avoid bad surprises later.
                    </p>
                </div>
                <div class="hero-point">
                    <h3>Long-term focus</h3>
                    <p>
                        We focus on multi-month and multi-year rentals instead of quick one-off
                        bookings. That means better alignment between owners and tenants, and more
                        stable, long-term relationships in Lombok.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>



<section class="section">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">What we do</h2>
            <p class="section-subtitle">Three services, one trusted partner in Lombok.</p>
        </div>
        <div class="card-grid">
            <div class="card">
                <h3 class="card-title">Long-term rentals</h3>
                <p class="card-text">
                    A curated selection of villas and houses available for 1-year+ rentals, ideal for
                    families, remote workers and long-stay guests.
                </p>
                <a href="/rentals.php" class="button" style="margin-top:10px;">View rentals</a>
            </div>
            <div class="card">
                <h3 class="card-title">Land & long-lease</h3>
                <p class="card-text">
                    Access hand-picked land opportunities across Lombok, with guidance on zoning,
                    utilities and contract structure.
                </p>
                <a href="/land.php" class="button" style="margin-top:10px;">Explore land</a>
            </div>
            <div class="card">
                <h3 class="card-title">Property management</h3>
                <p class="card-text">
                    Full-service management for owners living abroad: bookings, check-ins, staff,
                    maintenance and monthly reporting.
                </p>
                <a href="/property-management.php" class="button" style="margin-top:10px;">Learn more</a>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/common/footer.php'; ?>
