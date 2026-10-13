/**
 * product.js - Lógica del Catálogo Boutique y Modal Quick-View
 * Corazón de Coco
 */

(function () {
  'use strict';

  // 1. Cargar catálogo desde JSON
  function inicializarCatalogo() {
    const contenedor = document.getElementById('catalogo');
    if (!contenedor) return;

    fetch('productos.json')
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(productos => {
        generarCatalogo(productos);
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        contenedor.innerHTML =
          '<p class="text-center text-muted py-5">Error al cargar el catálogo de pasteles. Por favor intenta más tarde o contáctanos por WhatsApp.</p>';
      });
  }

  // 2. Renderizar categorías y tarjetas de productos
  function generarCatalogo(productos) {
    const contenedor = document.getElementById('catalogo');
    if (!contenedor) return;

    let html = '';

    for (const [categoria, items] of Object.entries(productos)) {
      html += `
        <div class="boutique-category-section mb-5 pb-3">
          <div class="heading_container heading_center mb-5">
            <h2 class="boutique-category-title">${categoria}</h2>
          </div>
          <div class="row">
      `;

      items.forEach(item => {
        let badgeHtml = '';
        if (item.etiqueta) {
          badgeHtml = `<span class="boutique-badge">${item.etiqueta}</span>`;
        }

        const safeDesc = (item.descripcion || '').replace(/'/g, "\\'");
        html += `
          <div class="col-6 col-md-4 col-lg-3 mb-4 px-2">
            <div class="boutique-product-card" onclick="abrirModal('${item.nombre}', '${item.imagen}', '${safeDesc}'); return false;">
              <div class="boutique-badge-container">
                ${badgeHtml}
                <div class="boutique-product-img-wrapper">
                  <img src="${item.imagen}" alt="${item.nombre}">
                </div>
              </div>
              <div class="boutique-product-info text-center mt-3">
                <h3 class="product-name" style="font-size: 1.1rem; color: var(--color-dark); font-weight: 600; margin-bottom: 5px;">${item.nombre}</h3>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    contenedor.innerHTML = html;
  }

  // 3. Modal Quick-View Boutique
  window.abrirModal = function (nombre, imagen, descripcion) {
    const modal = document.getElementById('modalProducto');
    if (!modal) return;

    const modalNombre = document.getElementById('modalNombre');
    const modalImagen = document.getElementById('modalImagen');
    const modalDesc = document.getElementById('modalDescripcion');
    const modalActionLink = document.querySelector('.boutique-modal-actions a');

    if (modalNombre) modalNombre.textContent = nombre;
    if (modalImagen) {
      modalImagen.src = imagen;
      modalImagen.alt = nombre;
    }
    if (modalDesc) modalDesc.innerHTML = descripcion;

    if (modalActionLink) {
      const waLink = "https://wa.me/5212881409816?text=" + encodeURIComponent("¡Hola! Me gustaría cotizar el producto: " + nombre);
      modalActionLink.href = waLink;
    }

    modal.classList.add('show');
    if (typeof window.lockBodyScroll === 'function') {
      window.lockBodyScroll();
    } else {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  };

  window.cerrarModal = function () {
    const modal = document.getElementById('modalProducto');
    if (!modal) return;

    modal.classList.remove('show');
    if (typeof window.unlockBodyScroll === 'function') {
      window.unlockBodyScroll();
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  };

  // 4. Listeners para cerrar modal
  document.addEventListener('DOMContentLoaded', function () {
    inicializarCatalogo();

    const modal = document.getElementById('modalProducto');
    const spanCerrar = document.querySelector('.boutique-modal-close');

    if (spanCerrar) {
      spanCerrar.onclick = window.cerrarModal;
    }

    if (modal) {
      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          window.cerrarModal();
        }
      });

      modal.addEventListener('touchmove', function (event) {
        if (event.target === modal) {
          event.preventDefault();
        }
      }, { passive: false });
    }
  });

})();
