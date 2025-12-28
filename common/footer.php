<?php
// common/footer.php
?>
    </div> <!-- .container (ouverture dans header.php) -->
</main>

<footer class="site-footer">
    <div class="container footer-inner">
        <div>
            <strong>RUMAHYA</strong><br>
            Lombok long-term rentals, land and property management.
        </div>
        <div>
            WhatsApp: +62 812 3456 7890<br>
            Email: info@rumahya.com
        </div>
    </div>
    <div class="container" style="margin-top:8px;font-size:0.78rem;color:#9ca3af;">
        © <?php echo date('Y'); ?> RumahYa. All rights reserved.
    </div>
</footer>

<script>
// Toggle menu mobile
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggle');
    var nav    = document.getElementById('primaryNav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }
});
</script>

</body>
</html>
