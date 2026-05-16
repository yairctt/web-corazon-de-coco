# Corazón de Coco - Sitio Web Comercial

Sitio web profesional, multi-página e interactivo desarrollado para **Corazón de Coco**, una repostería artesanal local. Este proyecto fue diseñado y desplegado para un cliente real, cumpliendo con los estándares de rendimiento, diseño responsivo y optimización de conversión (enlaces directos a ventas).

El objetivo principal fue digitalizar el catálogo del negocio, estructurar la información del menú y canalizar a los clientes potenciales hacia una vía rápida de cotización y contacto a través de WhatsApp.

---

## Aspectos Destacados del Proyecto

| Característica | Detalle Técnico | Beneficio para el Cliente |
| :--- | :--- | :--- |
| **Diseño Responsivo** | Grid flexible de Bootstrap 4 y media queries de CSS personalizados | Visualización impecable en dispositivos móviles, tablets y escritorios. |
| **Catálogo Interactivo** | DOM Scripting y modales dinámicos en JavaScript Vanilla | Navegación rápida por el menú de productos sin necesidad de recargar la página. |
| **Optimización de Conversión** | Botón flotante e integraciones de enlace directo (Deep Linking) | Comunicación y generación de cotizaciones inmediatas vía WhatsApp. |
| **Estructura y SEO** | Marcado HTML5 semántico, metaetiquetas y analíticas web integradas | Mejor posicionamiento inicial en buscadores y medición de tráfico. |

---

## Arquitectura de la Información

El sitio web está organizado de manera estratégica para asegurar una navegación limpia y guiar al usuario hacia la acción:

*   **Inicio (index.html):** Presentación de la marca, banners deslizantes promocionales, categorías principales de productos y el flujo de trabajo del negocio.
*   **Acerca de nosotros (about.html):** Historia y filosofía de la repostería artesanal.
*   **Productos (product.html):** Menú e información detallada de tamaños, sabores y rellenos disponibles con modales interactivos para consultas específicas.
*   **Contacto (contact.html):** Formulario e integración de enlaces a redes sociales y mapa de ubicación física.

---

## Tecnologías y Herramientas

*   **Maquetación y Estructura:** HTML5 Semántico
*   **Estilos y Diseño:** CSS3, Bootstrap 4 (Customizado) y Owl Carousel 2 (para Sliders táctiles)
*   **Interactividad:** JavaScript (Vanilla JS)
*   **Herramientas de Analítica:** Google Analytics y Vercel Web Analytics

---

## Estructura de Directorios

```text
📦 WebCorazonDeCoco
 ┣ 📂 css
 ┃ ┣ 📜 style.css           # Estilos personalizados y diseño de marca
 ┃ ┣ 📜 responsive.css      # Ajustes específicos para dispositivos móviles
 ┃ ┗ 📜 bootstrap.css       # Framework de diseño
 ┣ 📂 js
 ┃ ┣ 📜 custom.js           # Lógica interactiva del sitio
 ┃ ┗ 📜 bootstrap.js        # Scripts del framework
 ┣ 📂 images                # Recursos visuales y catálogo de productos optimizado
 ┣ 📜 index.html            # Landing page del sitio
 ┣ 📜 about.html            # Sección de identidad de la marca
 ┣ 📜 product.html          # Sección de catálogo y especificaciones de menú
 ┗ 📜 contact.html          # Sección de contacto y conversión
```

---

## Ejecución en Entorno Local

Al tratarse de una aplicación web estática, no requiere procesos de compilación o instalación de servidores de backend complejos.

1. Clone el repositorio:
   ```bash
   git clone https://github.com/usuario/WebCorazonDeCoco.git
   ```
2. Acceda al directorio del proyecto:
   ```bash
   cd WebCorazonDeCoco
   ```
3. Abra el archivo `index.html` en su navegador preferido, o ejecútelo mediante extensiones de servidor local (ej. Live Server en VS Code) para un desarrollo interactivo continuo.
