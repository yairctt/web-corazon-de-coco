/**
 * ==========================================================================
 * CORAZÓN DE COCO - PASTEL BUILDER INTERACTIVO
 * Cotizador y diseñador paso a paso sin precios fijos.
 * Envío de solicitud directa a WhatsApp para presupuesto a la medida.
 * ==========================================================================
 */

const BUILDER_TAMANOS = {
  "mini": { nombre: "Mini / Pareja", porciones: "1 a 2 personas" },
  "chico": { nombre: "Chico", porciones: "8 a 10 personas" },
  "mediano": { nombre: "Mediano", porciones: "15 personas" },
  "grande": { nombre: "Grande", porciones: "20 personas" },
  "extra": { nombre: "Extra Grande", porciones: "30 personas" },
  "fiesta": { nombre: "Fiesta / Pisos", porciones: "40+ personas" }
};

// Estado actual de la configuración
let configPastel = {
  tamanoKey: "mediano",
  saborPan: "Vainilla humedecida en 3 leches",
  relleno: "Crema de avellanas / Chocolate",
  tematica: "Cumpleaños",
  dedicatoria: "",
  fechaEntrega: "",
  fotoReferenciaNombre: ""
};

document.addEventListener("DOMContentLoaded", () => {
  inicializarFechaMinima();
  vincularEventosBuilder();
  actualizarResumenBuilder();
});

// Establecer fecha mínima: Regla oficial de mínimo 3 días de anticipación
function inicializarFechaMinima() {
  const inputFecha = document.getElementById("builderFecha");
  if (!inputFecha) return;

  const hoy = new Date();
  // Sumar 3 días
  hoy.setDate(hoy.getDate() + 3);

  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');

  const minFechaStr = `${yyyy}-${mm}-${dd}`;
  inputFecha.min = minFechaStr;
  inputFecha.value = minFechaStr;
  configPastel.fechaEntrega = minFechaStr;
}

// Vincular listeners a los selectores interactivos
function vincularEventosBuilder() {
  // 1. Selector de tamaño
  const tamanoCards = document.querySelectorAll(".builder-tamano-card");
  tamanoCards.forEach(card => {
    card.addEventListener("click", () => {
      tamanoCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      configPastel.tamanoKey = card.dataset.tamano;
      actualizarResumenBuilder();
    });
  });

  // 2. Selector de sabor de pan
  const panPills = document.querySelectorAll(".builder-pan-pill");
  panPills.forEach(pill => {
    pill.addEventListener("click", () => {
      panPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      configPastel.saborPan = pill.dataset.pan;
      actualizarResumenBuilder();
    });
  });

  // 3. Selector de relleno
  const rellenoPills = document.querySelectorAll(".builder-relleno-pill");
  rellenoPills.forEach(pill => {
    pill.addEventListener("click", () => {
      rellenoPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      configPastel.relleno = pill.dataset.relleno;
      actualizarResumenBuilder();
    });
  });

  // 4. Input dedicatoria
  const inputDedicatoria = document.getElementById("builderDedicatoria");
  if (inputDedicatoria) {
    inputDedicatoria.addEventListener("input", (e) => {
      configPastel.dedicatoria = e.target.value.trim();
      actualizarResumenBuilder();
    });
  }

  // 5. Input tematica
  const inputTematica = document.getElementById("builderTematica");
  if (inputTematica) {
    inputTematica.addEventListener("change", (e) => {
      configPastel.tematica = e.target.value;
      actualizarResumenBuilder();
    });
  }

  // 6. Input fecha
  const inputFecha = document.getElementById("builderFecha");
  if (inputFecha) {
    inputFecha.addEventListener("change", (e) => {
      configPastel.fechaEntrega = e.target.value;
      actualizarResumenBuilder();
    });
  }
}

// Actualizar resumen en vivo sin precios
function actualizarResumenBuilder() {
  const tamData = BUILDER_TAMANOS[configPastel.tamanoKey] || BUILDER_TAMANOS["mediano"];

  // Actualizar DOM del resumen
  const elNombre = document.getElementById("resumenTamano");
  const elPan = document.getElementById("resumenPan");
  const elRelleno = document.getElementById("resumenRelleno");
  const elFecha = document.getElementById("resumenFecha");
  const btnWa = document.getElementById("btnCotizarPastelWa");

  if (elNombre) elNombre.textContent = `${tamData.nombre} (${tamData.porciones})`;
  if (elPan) elPan.textContent = configPastel.saborPan;
  if (elRelleno) elRelleno.textContent = configPastel.relleno;
  if (elFecha) elFecha.textContent = formatearFecha(configPastel.fechaEntrega);

  // Construir mensaje estructurado para WhatsApp
  let mensaje = `Hola Corazón de Coco. Me gustaría cotizar este pastel personalizado:\n\n`;
  mensaje += `• Tamaño: ${tamData.nombre} (${tamData.porciones})\n`;
  mensaje += `• Bizcocho: ${configPastel.saborPan}\n`;
  mensaje += `• Relleno: ${configPastel.relleno}\n`;
  mensaje += `• Ocasión: ${configPastel.tematica}\n`;
  if (configPastel.dedicatoria) {
    mensaje += `• Dedicatoria: "${configPastel.dedicatoria}"\n`;
  }
  if (configPastel.fotoReferenciaNombre) {
    mensaje += `• Estilo de referencia: ${configPastel.fotoReferenciaNombre}\n`;
  }
  mensaje += `• Fecha del evento: ${formatearFecha(configPastel.fechaEntrega)}\n\n`;
  mensaje += `¿Me podrían compartir la cotización y disponibilidad en agenda? ¡Muchas gracias!`;

  if (btnWa) {
    btnWa.href = `https://wa.me/5212881409816?text=${encodeURIComponent(mensaje)}`;
  }
}

// Función para precargar un diseño desde el catálogo visual
window.precargarDisenoEnBuilder = function(nombreDiseno, imagenDiseno) {
  configPastel.fotoReferenciaNombre = nombreDiseno;
  
  const notificacion = document.getElementById("builderDisenoSeleccionadoAviso");
  if (notificacion) {
    notificacion.innerHTML = `
      <div class="alert alert-success d-flex align-items-center" style="border-radius: 14px; background: #fde7eb; color: #2E4057; border: 1.5px solid #e8c4b0; padding: 14px 18px;">
        <i class="fa fa-check-circle mr-2" style="color: #2E4057; font-size: 1.2rem;"></i>
        <span>Estilo de referencia seleccionado: <strong>${nombreDiseno}</strong></span>
      </div>
    `;
    notificacion.style.display = "block";
  }

  // Scroll suave al builder
  const seccion = document.getElementById("pastel-builder");
  if (seccion) {
    seccion.scrollIntoView({ behavior: "smooth" });
  }

  actualizarResumenBuilder();
};

function formatearFecha(fechaStr) {
  if (!fechaStr) return "Por definir";
  try {
    const [y, m, d] = fechaStr.split("-");
    const f = new Date(y, m - 1, d);
    return f.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch (e) {
    return fechaStr;
  }
}
