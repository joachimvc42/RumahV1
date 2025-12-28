document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.modal-overlay');
    const panel   = overlay ? overlay.querySelector('.modal-panel') : null;

    function closeModal() {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        const body = overlay.querySelector('.modal-body');
        if (body) body.innerHTML = '';
    }

    function openModalWithContent(html) {
        if (!overlay) return;
        const body = overlay.querySelector('.modal-body');
        if (body) body.innerHTML = html;
        overlay.classList.add('is-open');
        attachGalleryHandlers();
    }

    // Attache les handlers pour changer l'image principale
    function attachGalleryHandlers() {
        const mainImg = document.querySelector('.modal-gallery-main');
        if (!mainImg) return;
        document.querySelectorAll('.modal-gallery-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImg.src = thumb.dataset.full || thumb.src;
            });
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
        const closeBtn = overlay.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
    }

    // Cartes Rentals
    document.querySelectorAll('[data-rental-id]').forEach(card => {
        card.addEventListener('click', async () => {
            const id = card.getAttribute('data-rental-id');
            try {
                const resp = await fetch(`/api/rental_detail.php?id=${encodeURIComponent(id)}`);
                const data = await resp.text();
                openModalWithContent(data);
            } catch (e) {
                console.error(e);
            }
        });
    });

    // Cartes Land
    document.querySelectorAll('[data-land-id]').forEach(card => {
        card.addEventListener('click', async () => {
            const id = card.getAttribute('data-land-id');
            try {
                const resp = await fetch(`/api/land_detail.php?id=${encodeURIComponent(id)}`);
                const data = await resp.text();
                openModalWithContent(data);
            } catch (e) {
                console.error(e);
            }
        });
    });
});
