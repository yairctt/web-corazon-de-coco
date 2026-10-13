/**
 * ==========================================================================
 * CORAZÓN DE COCO - MOTOR DE REBANADAS & BANDEJA DE ANTOJOS (FASE 2)
 * Mobile-First, sin stickers/emojis, con panel oculto para la administradora.
 * ==========================================================================
 */

const WHATSAPP_PHONE = "5212881409816";
const ADMIN_PIN = "coco123";

// Catálogo base de porciones individuales y antojitos del día (fotos reales circulares)
const ANTOJOS_BASE = [
  {
    id: "cheesecake-oreo",
    nombre: "Cheesecake Helado de Oreo",
    descripcion: "Cremosa base tipo helado con galletas Oreo crujientes.",
    precio: 60,
    imagen: "images/postre.png",
    badge: "Más vendido",
    esHot: true,
    disponible: true
  },
  {
    id: "cheesecake-fresas",
    nombre: "Cheesecake con Fresas",
    descripcion: "Queso crema suave con fresas frescas maceradas al momento.",
    precio: 65,
    imagen: "images/chesscake_con_fresas.png",
    badge: "Gourmet",
    esHot: false,
    disponible: true
  },
  {
    id: "red-velvet",
    nombre: "Rebanada Red Velvet",
    descripcion: "Bizcocho de terciopelo rojo con frosting tradicional de queso crema.",
    precio: 60,
    imagen: "images/clasico_red_velvet.png",
    badge: "Clásico",
    esHot: true,
    disponible: true
  },
  {
    id: "pastel-matilda",
    nombre: "Pastel Matilda Triple Chocolate",
    descripcion: "Tres capas de chocolate fudge húmedo e intenso.",
    precio: 65,
    imagen: "images/pastel_matilda.png",
    badge: "Especial",
    esHot: true,
    disponible: true
  },
  {
    id: "pay-queso",
    nombre: "Pay de Queso Cremoso",
    descripcion: "Receta horneada sobre base crujiente de galleta de mantequilla.",
    precio: 50,
    imagen: "images/pay_de_queso.png",
    badge: "Tradicional",
    esHot: false,
    disponible: true
  },
  {
    id: "carlota-limon",
    nombre: "Carlota de Limón Helada",
    descripcion: "Capas de crema cítrica refrescante y galleta María.",
    precio: 45,
    imagen: "images/postres_enteros.png",
    badge: "Cítrico",
    esHot: false,
    disponible: true
  },
  {
    id: "chocoflan",
    nombre: "Chocoflan Tradicional",
    descripcion: "Pastel de chocolate esponjoso con flan napolitano horneado.",
    precio: 50,
    imagen: "images/chocofl.png",
    badge: "Dos en uno",
    esHot: false,
    disponible: true
  },
  {
    id: "brownie-chispas",
    nombre: "Brownie con Chispas",
    descripcion: "Horneado con nuez y trozos de chocolate semi-amargo.",
    precio: 35,
    imagen: "images/brownie.png",
    badge: "Horneado hoy",
    esHot: false,
    disponible: true
  },
  {
    id: "fresas-brillo",
    nombre: "Copa de Fresas con Brillo",
    descripcion: "Fresas seleccionadas cubiertas de chocolate y acabado comestible.",
    precio: 85,
    imagen: "images/fresas_con_brillo.png",
    badge: "Exclusivo",
    esHot: false,
    disponible: true
  },
  {
    id: "mini-pastel-2m",
    nombre: "Mini Pastel Cumple-mes",
    descripcion: "Porción para 1-2 personas. Vainilla húmeda con avellana.",
    precio: 180,
    imagen: "images/pastel_2_meses.png",
    badge: "Para compartir",
    esHot: true,
    disponible: true
  }
];

let catalogoAntojos = [];
let bandejaAntojos = {};

// Cargar catálogo desde localStorage o inicializar con base
function cargarCatalogoAntojos() {
  try {
    const guardado = localStorage.getItem("corazon_catalogo_antojos_v2");
    if (guardado) {
      catalogoAntojos = JSON.parse(guardado);
    } else {
      catalogoAntojos = JSON.parse(JSON.stringify(ANTOJOS_BASE));
    }
  } catch (e) {
    catalogoAntojos = JSON.parse(JSON.stringify(ANTOJOS_BASE));
  }
}

function guardarCatalogoAntojos() {
  try {
    localStorage.setItem("corazon_catalogo_antojos_v2", JSON.stringify(catalogoAntojos));
  } catch (e) {
    console.error("Error guardando catálogo", e);
  }
}

function cargarBandejaStorage() {
  try {
    const guardado = localStorage.getItem("corazon_bandeja_antojos");
    if (guardado) {
      bandejaAntojos = JSON.parse(guardado);
    }
  } catch (e) {
    bandejaAntojos = {};
  }
}

function guardarBandejaStorage() {
  try {
    localStorage.setItem("corazon_bandeja_antojos", JSON.stringify(bandejaAntojos));
  } catch (e) {
    console.error("Error guardando bandeja", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarCatalogoAntojos();
  cargarBandejaStorage();
  renderizarGridAntojos();
  crearElementosBandejaEnDOM();
  crearModalAdminEnDOM();
  actualizarUIBandeja();

  // Detección secreta de admin por URL hash
  if (window.location.hash === "#admin" || window.location.search.includes("admin=1")) {
    setTimeout(solicitarAccesoAdmin, 400);
  }

  // Detección secreta por atajo de teclado: Ctrl + Shift + A
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      solicitarAccesoAdmin();
    }
  });
});

// Renderizar tarjetas de rebanadas en el Store
function renderizarGridAntojos() {
  const contenedor = document.getElementById("gridAntojos");
  if (!contenedor) return;

  contenedor.innerHTML = catalogoAntojos.map(item => {
    const estaDisponible = item.disponible !== false;
    const badgeClass = item.esHot ? "rebanada-badge hot" : "rebanada-badge";
    const statusOverlay = estaDisponible ? "" : `
      <div style="position: absolute; inset: 0; background: rgba(255,255,255,0.88); border-radius: 20px; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
        <span style="background: #2E4057; color: #FFF; font-weight: 700; font-size: 0.8rem; padding: 5px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px;">Agotado por hoy</span>
        <p style="color: #666; font-size: 0.78rem; margin-top: 5px; margin-bottom: 0;">Horneamos más pronto</p>
      </div>
    `;

    return `
      <div class="col-6 col-md-4 col-lg-3 mb-3 d-flex px-1 px-sm-2">
        <div class="rebanada-card w-100 ${estaDisponible ? '' : 'rebanada-agotada'}" style="position: relative;">
          ${statusOverlay}
          <span class="${badgeClass}">${item.badge || 'Del día'}</span>
          
          <div class="pastry-circle-frame compact">
            <img src="${item.imagen}" alt="${item.nombre}" loading="lazy">
          </div>
          
          <div class="rebanada-info">
            <h3 class="rebanada-name">${item.nombre}</h3>
            <p class="rebanada-desc">${item.descripcion}</p>
          </div>

          <div class="rebanada-footer">
            <div class="rebanada-price-row">
              <div class="rebanada-price">$${item.precio} <span>MXN</span></div>
              ${estaDisponible ? `
                <div class="qty-control" id="qty-wrapper-${item.id}">
                  <button type="button" class="qty-btn" onclick="cambiarQtyCard('${item.id}', -1)" aria-label="Disminuir">-</button>
                  <span class="qty-val" id="qty-val-${item.id}">1</span>
                  <button type="button" class="qty-btn" onclick="cambiarQtyCard('${item.id}', 1)" aria-label="Aumentar">+</button>
                </div>
              ` : `<span style="font-size: 0.85rem; color: #888; font-weight: 600;">Agotado</span>`}
            </div>

            ${estaDisponible ? `
              <button type="button" class="btn-add-antojo" onclick="agregarAlCarritoCard('${item.id}')">
                <i class="fa fa-shopping-basket"></i> Agregar a mi pedido
              </button>
            ` : `
              <button type="button" class="btn-add-antojo" disabled style="opacity: 0.5; cursor: not-allowed; background: #999;">
                No disponible hoy
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

window.cambiarQtyCard = function(id, delta) {
  const span = document.getElementById(`qty-val-${id}`);
  if (!span) return;
  let val = parseInt(span.textContent) || 1;
  val = Math.max(1, Math.min(10, val + delta));
  span.textContent = val;
};

window.agregarAlCarritoCard = function(id) {
  const item = catalogoAntojos.find(p => p.id === id);
  if (!item || item.disponible === false) return;

  const span = document.getElementById(`qty-val-${id}`);
  const qtyToAdd = span ? parseInt(span.textContent) || 1 : 1;

  if (bandejaAntojos[id]) {
    bandejaAntojos[id].qty += qtyToAdd;
  } else {
    bandejaAntojos[id] = {
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      imagen: item.imagen,
      qty: qtyToAdd
    };
  }

  guardarBandejaStorage();
  actualizarUIBandeja();

  if (span) span.textContent = 1;
  mostrarToastConfirmacion(`${qtyToAdd}x ${item.nombre} agregado`);
};

function crearElementosBandejaEnDOM() {
  if (document.getElementById("bandejaSticky")) return;

  const html = `
    <!-- Bandeja Flotante Sticky -->
    <div id="bandejaSticky" class="bandeja-antojos-sticky">
      <div class="bandeja-badge-count">
        <i class="fa fa-shopping-basket"></i>
        <span id="bandejaNumBubble" class="bandeja-num-bubble">0</span>
      </div>
      <div class="bandeja-info-resumen">
        <span class="bandeja-titulo">Tu Bandeja</span>
        <span id="bandejaTotalPrecio" class="bandeja-total-precio">$0 MXN</span>
      </div>
      <button type="button" class="bandeja-btn-abrir" onclick="abrirModalCajita()">
        Ver Pedido <i class="fa fa-chevron-right"></i>
      </button>
    </div>

    <!-- Modal Cajita de Antojos Desplegable -->
    <div id="cajitaModalOverlay" class="cajita-modal-overlay">
      <div class="cajita-modal-panel">
        <div class="cajita-header">
          <div class="cajita-header-title">
            <i class="fa fa-shopping-basket" style="color: var(--c-brand-dark); font-size: 1.3rem;"></i>
            <h4>Tu Selección de Postres</h4>
          </div>
          <button type="button" class="cajita-close-btn" onclick="cerrarModalCajita()">&times;</button>
        </div>

        <div id="cajitaBody" class="cajita-body"></div>

        <div class="cajita-footer">
          <div class="cajita-total-row">
            <span class="cajita-total-label">Total a pagar:</span>
            <span id="cajitaModalTotal" class="cajita-total-val">$0 MXN</span>
          </div>
          <a id="btnPedirWhatsappCajita" href="#" target="_blank" class="btn-pedir-cajita-wa">
            <i class="fa fa-whatsapp" style="font-size: 1.25rem;"></i> Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>

    <!-- Toast Notification al agregar -->
    <div id="antojoToast" class="antojo-toast-notification"></div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const overlay = document.getElementById("cajitaModalOverlay");
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cerrarModalCajita();
  });
}

function actualizarUIBandeja() {
  const sticky = document.getElementById("bandejaSticky");
  const bubble = document.getElementById("bandejaNumBubble");
  const totalLabel = document.getElementById("bandejaTotalPrecio");
  if (!sticky || !bubble || !totalLabel) return;

  const items = Object.values(bandejaAntojos);
  const totalPiezas = items.reduce((acc, curr) => acc + curr.qty, 0);
  const totalMonto = items.reduce((acc, curr) => acc + (curr.precio * curr.qty), 0);

  bubble.textContent = totalPiezas;
  totalLabel.textContent = `$${totalMonto} MXN`;

  document.querySelectorAll(".header-cart-badge").forEach(badge => {
    badge.textContent = totalPiezas;
    if (totalPiezas > 0) {
      badge.classList.remove("d-none");
    } else {
      badge.classList.add("d-none");
    }
  });

  // Resaltar visualmente la pestaña Bandeja en la barra inferior móvil
  document.querySelectorAll(".app-bottom-nav-item.nav-item-bandeja").forEach(tab => {
    if (totalPiezas > 0) {
      tab.classList.add("has-items");
    } else {
      tab.classList.remove("has-items");
    }
  });

  if (totalPiezas === 0) {
    cerrarModalCajita();
  }

  renderizarCajitaModal(items, totalMonto);
}

function renderizarCajitaModal(items, totalMonto) {
  const body = document.getElementById("cajitaBody");
  const totalVal = document.getElementById("cajitaModalTotal");
  const btnWa = document.getElementById("btnPedirWhatsappCajita");
  if (!body || !totalVal || !btnWa) return;

  totalVal.textContent = `$${totalMonto} MXN`;

  if (items.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 36px 15px;">
        <i class="fa fa-shopping-basket" style="font-size: 2.8rem; color: #D6C7BE; margin-bottom: 14px;"></i>
        <h5 style="color: var(--c-brand-dark, #2E4057); font-weight: 700; margin-bottom: 8px;">Tu bandeja está vacía</h5>
        <p style="color: #777; font-size: 0.92rem; margin-bottom: 18px;">Agrega una o más rebanadas frescas para continuar con tu pedido.</p>
        <a href="index.html#antojos" onclick="cerrarModalCajita()" class="btn-primary-custom" style="font-size: 0.88rem; padding: 9px 22px; text-decoration: none;">
          <i class="fa fa-cutlery mr-1"></i> Ver Rebanadas de Hoy
        </a>
      </div>
    `;
    btnWa.style.display = "none";
    return;
  }

  btnWa.style.display = "flex";

  body.innerHTML = items.map(item => `
    <div class="cajita-item-row">
      <img src="${item.imagen}" alt="${item.nombre}" class="cajita-item-img">
      <div class="cajita-item-det">
        <div class="cajita-item-nombre">${item.nombre}</div>
        <div class="cajita-item-precio">$${item.precio} c/u &bull; Subtotal: $${item.precio * item.qty}</div>
      </div>
      <div class="qty-control">
        <button type="button" class="qty-btn" onclick="modificarItemBandeja('${item.id}', -1)">-</button>
        <span class="qty-val">${item.qty}</span>
        <button type="button" class="qty-btn" onclick="modificarItemBandeja('${item.id}', 1)">+</button>
      </div>
      <button type="button" class="cajita-item-del" onclick="eliminarItemBandeja('${item.id}')" title="Quitar">
        <i class="fa fa-trash-o"></i>
      </button>
    </div>
  `).join("");

  // Mensaje estructurado y limpio sin stickers
  let textoWA = `Hola Corazón de Coco. Me gustaría realizar el siguiente pedido:\n\n`;
  items.forEach(it => {
    textoWA += `• ${it.qty}x ${it.nombre} ($${it.precio * it.qty} MXN)\n`;
  });
  textoWA += `\nTotal: $${totalMonto} MXN\n`;
  textoWA += `¿Tienen disponibilidad para hoy o mañana? Gracias.`;

  btnWa.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(textoWA)}`;
}

window.modificarItemBandeja = function(id, delta) {
  if (!bandejaAntojos[id]) return;
  bandejaAntojos[id].qty += delta;
  if (bandejaAntojos[id].qty <= 0) {
    delete bandejaAntojos[id];
  }
  guardarBandejaStorage();
  actualizarUIBandeja();
};

window.eliminarItemBandeja = function(id) {
  delete bandejaAntojos[id];
  guardarBandejaStorage();
  actualizarUIBandeja();
};

window.abrirModalCajita = function() {
  const overlay = document.getElementById("cajitaModalOverlay");
  if (overlay) overlay.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.cerrarModalCajita = function() {
  const overlay = document.getElementById("cajitaModalOverlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
};

let toastTimeout = null;

function mostrarToastConfirmacion(mensaje) {
  const toast = document.getElementById("antojoToast");
  if (!toast) return;
  toast.innerHTML = `<i class="fa fa-check-circle" style="color: var(--c-brand-primary, #e8c4b0); font-size: 1.05rem;"></i> <span>${mensaje}</span>`;
  toast.classList.add("active");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("active");
  }, 2200);
}

// ==========================================================================
// MODULO OCULTO PARA LA DUEÑA (ADMIN SIN BOTÓN PÚBLICO)
// ==========================================================================

function crearModalAdminEnDOM() {
  if (document.getElementById("adminModalOverlay")) return;

  const html = `
    <!-- Modal Admin Oculto de la Dueña -->
    <div id="adminModalOverlay" class="cajita-modal-overlay">
      <div class="cajita-modal-panel" style="max-width: 580px; max-height: 92vh;">
        <div class="cajita-header" style="background: var(--c-brand-dark, #2E4057); color: #FFF;">
          <div class="cajita-header-title">
            <i class="fa fa-cog" style="color: var(--c-brand-primary, #e8c4b0); font-size: 1.2rem;"></i>
            <h4 style="color: #FFF !important; font-family: var(--font-base); font-size: 1.3rem; font-weight: 700;">Administración de Disponibilidad</h4>
          </div>
          <button type="button" class="cajita-close-btn" style="color: #FFF;" onclick="cerrarModalAdmin()">&times;</button>
        </div>

        <div class="cajita-body" style="background: #FFF; padding: 20px;">
          <div style="background: #fde7eb; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; font-size: 0.88rem; color: #2E4057;">
            <i class="fa fa-lock mr-1"></i> <strong>Panel privado:</strong> Activa o desactiva qué postres hay disponibles hoy y edita precios. Los clientes verán los cambios al instante.
          </div>

          <h6 style="font-weight: 700; color: #2E4057; margin-bottom: 14px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">
            Menú de Postres del Día
          </h6>

          <div id="adminListaItems" style="display: flex; flex-direction: column; gap: 10px;"></div>

          <hr style="margin: 22px 0;">

          <!-- Formulario Agregar Nuevo Postre -->
          <div style="background: #fcf9f5; padding: 16px; border-radius: 16px; border: 1px dashed #e8c4b0;">
            <h6 style="font-weight: 700; color: #2E4057; margin-bottom: 10px; font-size: 0.92rem;">
              <i class="fa fa-plus-circle mr-1"></i> Añadir Nuevo Postre al Menú
            </h6>
            <div class="row">
              <div class="col-sm-7 mb-2">
                <input type="text" id="nuevoNombre" class="form-control form-control-sm" placeholder="Nombre del postre">
              </div>
              <div class="col-sm-5 mb-2">
                <input type="number" id="nuevoPrecio" class="form-control form-control-sm" placeholder="Precio MXN">
              </div>
              <div class="col-12 mb-2">
                <input type="text" id="nuevaDesc" class="form-control form-control-sm" placeholder="Descripción breve">
              </div>
              <div class="col-12 mb-2">
                <select id="nuevaFoto" class="form-control form-control-sm">
                  <option value="images/postre.png">Foto: Cheesecake Oreo</option>
                  <option value="images/chesscake_con_fresas.png">Foto: Cheesecake Fresas</option>
                  <option value="images/clasico_red_velvet.png">Foto: Red Velvet</option>
                  <option value="images/pastel_matilda.png">Foto: Chocolate Matilda</option>
                  <option value="images/pay_de_queso.png">Foto: Pay de Queso</option>
                  <option value="images/postres_enteros.png">Foto: Carlota de Limón</option>
                  <option value="images/chocofl.png">Foto: Chocoflan</option>
                  <option value="images/brownie.png">Foto: Brownies</option>
                  <option value="images/fresas_con_brillo.png">Foto: Fresas preparadas</option>
                  <option value="images/cupcakes_happy.png">Foto: Cupcakes</option>
                </select>
              </div>
              <div class="col-12">
                <button type="button" class="btn btn-sm btn-block" style="background: #2E4057; color: #FFF; font-weight: 700;" onclick="adminAgregarNuevoPostre()">
                  Agregar al menú
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="cajita-footer" style="display: flex; gap: 10px; justify-content: space-between;">
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="adminRestaurarValoresBase()">
            Restaurar base
          </button>
          <button type="button" class="btn btn-sm" style="background: #e8c4b0; color: #2E4057; font-weight: 700; padding: 7px 22px; border-radius: 999px;" onclick="cerrarModalAdmin()">
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const overlay = document.getElementById("adminModalOverlay");
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cerrarModalAdmin();
  });
}

// Trigger secreto: contador de clics rápidos en copyright del footer
let secretAdminTapCount = 0;
let secretAdminTapTimer = null;

window.checkSecretAdminTap = function() {
  secretAdminTapCount++;
  clearTimeout(secretAdminTapTimer);

  if (secretAdminTapCount >= 3) {
    secretAdminTapCount = 0;
    solicitarAccesoAdmin();
  } else {
    secretAdminTapTimer = setTimeout(() => {
      secretAdminTapCount = 0;
    }, 1500);
  }
};

window.solicitarAccesoAdmin = function() {
  const pin = prompt("Acceso administrativo. Ingresa tu PIN:");
  if (pin === ADMIN_PIN) {
    abrirModalAdmin();
  } else if (pin !== null) {
    alert("PIN incorrecto.");
  }
};

window.abrirModalAdmin = function() {
  const overlay = document.getElementById("adminModalOverlay");
  if (!overlay) return;
  renderizarAdminItemsList();
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.cerrarModalAdmin = function() {
  const overlay = document.getElementById("adminModalOverlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
};

function renderizarAdminItemsList() {
  const list = document.getElementById("adminListaItems");
  if (!list) return;

  list.innerHTML = catalogoAntojos.map((item, idx) => {
    const isDisp = item.disponible !== false;
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #fcf9f5; border-radius: 12px; border: 1px solid #eee; gap: 10px;">
        <img src="${item.imagen}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;">
        <div style="flex-grow: 1;">
          <div style="font-weight: 700; font-size: 0.88rem; color: #2E4057;">${item.nombre}</div>
          <div style="font-size: 0.78rem; color: #777;">
            Precio: $<input type="number" value="${item.precio}" style="width: 55px; padding: 2px 4px; font-weight: 700; border: 1px solid #ccc; border-radius: 4px;" onchange="adminActualizarPrecio('${item.id}', this.value)"> MXN
          </div>
        </div>
        <div>
          <button type="button" class="btn btn-xs ${isDisp ? 'btn-success' : 'btn-secondary'}" style="font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px;" onclick="adminToggleDisponibilidad('${item.id}')">
            ${isDisp ? 'Disponible' : 'Agotado'}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

window.adminToggleDisponibilidad = function(id) {
  const item = catalogoAntojos.find(p => p.id === id);
  if (!item) return;
  item.disponible = !item.disponible;
  guardarCatalogoAntojos();
  renderizarAdminItemsList();
  renderizarGridAntojos();
};

window.adminActualizarPrecio = function(id, nuevoPrecio) {
  const item = catalogoAntojos.find(p => p.id === id);
  if (!item) return;
  const p = parseFloat(nuevoPrecio);
  if (!isNaN(p) && p > 0) {
    item.precio = p;
    guardarCatalogoAntojos();
    renderizarGridAntojos();
  }
};

window.adminAgregarNuevoPostre = function() {
  const nombre = document.getElementById("nuevoNombre").value.trim();
  const precio = parseFloat(document.getElementById("nuevoPrecio").value);
  const desc = document.getElementById("nuevaDesc").value.trim();
  const foto = document.getElementById("nuevaFoto").value;

  if (!nombre || isNaN(precio)) {
    alert("Por favor ingresa un nombre y precio válido.");
    return;
  }

  const nuevo = {
    id: "item-" + Date.now(),
    nombre: nombre,
    descripcion: desc || "Creación de alta repostería preparada con ingredientes selectos.",
    precio: precio,
    imagen: foto,
    badge: "Nuevo",
    esHot: false,
    disponible: true
  };

  catalogoAntojos.unshift(nuevo);
  guardarCatalogoAntojos();
  renderizarAdminItemsList();
  renderizarGridAntojos();

  document.getElementById("nuevoNombre").value = "";
  document.getElementById("nuevoPrecio").value = "";
  document.getElementById("nuevaDesc").value = "";
  alert(`"${nombre}" agregado con éxito.`);
};

window.adminRestaurarValoresBase = function() {
  if (confirm("¿Deseas restaurar la lista base de postres?")) {
    catalogoAntojos = JSON.parse(JSON.stringify(ANTOJOS_BASE));
    guardarCatalogoAntojos();
    renderizarAdminItemsList();
    renderizarGridAntojos();
  }
};
