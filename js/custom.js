/**
 * custom.js - Lógica interactiva global y gestión de navegación
 * Corazón de Coco
 */

// ==========================================================================
// 1. GESTOR GLOBAL DE BLOQUEO DE SCROLL (BODY SCROLL LOCK ROBUSTO)
// ==========================================================================
(function() {
    let scrollLockCount = 0;
    let originalBodyPaddingRight = "";

    window.lockBodyScroll = function() {
        scrollLockCount++;
        if (scrollLockCount === 1) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            originalBodyPaddingRight = document.body.style.paddingRight || "";

            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }

            document.documentElement.classList.add("modal-open-scroll-lock");
            document.body.classList.add("modal-open-scroll-lock");
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        }
    };

    window.unlockBodyScroll = function(force) {
        if (force) {
            scrollLockCount = 0;
        } else {
            scrollLockCount = Math.max(0, scrollLockCount - 1);
        }

        // Si ya no quedan menús ni modales abiertos en pantalla, liberar completamente el scroll
        const hayOverlaysAbiertos = document.querySelector(
            ".cajita-modal-overlay.open, .app-drawer-overlay.open, .boutique-modal.show, #adminModalOverlay.open"
        );

        if (!hayOverlaysAbiertos || scrollLockCount === 0) {
            scrollLockCount = 0;
            document.documentElement.classList.remove("modal-open-scroll-lock");
            document.body.classList.remove("modal-open-scroll-lock");
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            document.body.style.paddingRight = originalBodyPaddingRight;
        }
    };
})();

// ==========================================================================
// 2. GESTIÓN DEL MENÚ LATERAL (APP SLIDE DRAWER)
// ==========================================================================
window.abrirAppDrawer = function() {
    const drawer = document.getElementById("appDrawerOverlay");
    if (drawer) {
        drawer.classList.add("open");
        if (typeof window.lockBodyScroll === "function") {
            window.lockBodyScroll();
        }
    }
};

window.cerrarAppDrawer = function() {
    const drawer = document.getElementById("appDrawerOverlay");
    if (drawer) {
        drawer.classList.remove("open");
        if (typeof window.unlockBodyScroll === "function") {
            window.unlockBodyScroll();
        }
    }
};

// ==========================================================================
// 3. INICIALIZACIÓN GLOBAL DE EVENTOS AL CARGAR EL DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
    // A. Actualizar año de copyright automáticamente
    const currentYear = new Date().getFullYear();
    document.querySelectorAll("#displayYear").forEach(function(el) {
        el.textContent = currentYear;
    });

    // B. Control de eventos del Slide Drawer Lateral
    const drawer = document.getElementById("appDrawerOverlay");
    if (drawer) {
        drawer.addEventListener("click", function(e) {
            if (e.target === drawer) {
                cerrarAppDrawer();
            }
        });

        // Prevenir scroll en móviles al tocar el fondo oscuro
        drawer.addEventListener("touchmove", function(e) {
            if (e.target === drawer) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // C. Escuchar tecla Escape para cerrar cualquier overlay activo
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            if (drawer && drawer.classList.contains("open")) {
                cerrarAppDrawer();
            }
            if (typeof window.cerrarModalCajita === "function") {
                window.cerrarModalCajita();
            }
            if (typeof window.cerrarModalAdmin === "function") {
                window.cerrarModalAdmin();
            }
            if (typeof window.cerrarModal === "function") {
                window.cerrarModal();
            }
        }
    });

    // D. Animación de contadores de confianza (si existen en la vista)
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length > 0) {
        const speed = 200;
        const animateCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const counterSection = document.querySelector('.trust-bar-section');
        if (counterSection) {
            observer.observe(counterSection);
        }
    }

    // E. Estado guardado de la barra superior (Top Bar)
    try {
        if (sessionStorage.getItem('cdc_topbar_dismissed') === 'true') {
            const topBar = document.querySelector('.top-bar');
            if (topBar) {
                topBar.classList.add('top-bar-hidden');
            }
        }
    } catch (e) {}

    // F. Owl Carousel seguro (solo si la librería Owl y el elemento existen)
    if (typeof $ !== 'undefined' && $.fn && typeof $.fn.owlCarousel === 'function') {
        const $carousel = $(".client_owl-carousel");
        if ($carousel.length > 0) {
            $carousel.owlCarousel({
                loop: true,
                margin: 0,
                dots: false,
                nav: true,
                autoplay: true,
                autoplayHoverPause: true,
                navText: [
                    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                ],
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    1000: { items: 2 }
                }
            });
        }
    }
});

// ==========================================================================
// 4. FUNCIONES UTILITARIAS GLOBALES
// ==========================================================================
function cerrarTopBar() {
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        topBar.classList.add('top-bar-hidden');
        try {
            sessionStorage.setItem('cdc_topbar_dismissed', 'true');
        } catch (e) {}
    }
}