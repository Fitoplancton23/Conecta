# .Conecta — Sitio institucional

Sitio web estático de **.Conecta**, una dupla de gestión de redes sociales y
desarrollo web formada por **Amalia Gross** (Lic. en Comunicación Social) y
**Facundo Silveira** (Diseñador Digital / UX-UI).

🔗 **Sitio en producción:** https://celadon-meerkat-376bb0.netlify.app
📦 **Repositorio:** https://github.com/Fitoplancton23/Conecta

---

## El concepto: "El punto que une"

Conecta es una dupla, así que todo el sistema visual se deriva de una sola
idea: **el punto y la línea que unen dos polos**.

| Polo | Servicio | Color |
| --- | --- | --- |
| A | Redes sociales | Naranja `#ff3000` |
| B | Desarrollo web | Azul `#2440e0` |

El punto —el mismo con el que arranca el logotipo `.Conecta`— es la unidad
mínima del sistema: aparece como viñeta de cada lista, como nodo de cada
sección y como viñeta de cada ficha. Y una línea recorre la página del polo
naranja al azul, dibujándose a medida que se hace scroll: la página se va
*conectando* mientras se lee.

### Criterios de diseño

1. Un concepto, no efectos sueltos.
2. Paleta severa: negro, claro y los dos polos. Nada más.
3. Contraste tipográfico extremo: display enorme contra micro-metadata
   monoespaciada. Nada en el medio.
4. El vacío es material.
5. Textura, no ruido: grano y trama siempre por debajo del 5%.
6. Movimiento con propósito.
7. Rendimiento y accesibilidad son parte del diseño.

---

## Stack

- **HTML5 semántico** — `header`, `nav`, `main`, `section`, `article`, `figure`, `footer`.
- **SCSS** con arquitectura de partials (variables, mixins con parámetros,
  placeholders con `@extend`, nesting).
- **Bootstrap 5.3.3** — navbar responsiva con menú hamburguesa, re-estilada
  por completo desde SCSS.
- **AOS 2.3.4** — animaciones de aparición al hacer scroll.
- **JavaScript sin dependencias** — el trazo de conexión, el indicador de
  scroll y la calculadora de presupuesto, sin una sola librería.

Bootstrap y AOS están incorporados localmente en `assets/vendor/` en lugar de
por CDN: el sitio no depende de que un servicio externo esté disponible.

---

## Estructura

```
.
├── index.html              → Inicio
├── pages/
│   ├── nosotros.html
│   ├── planes.html
│   ├── presupuesto.html
│   └── contacto.html
├── scss/                   → fuentes SCSS
│   ├── main.scss           → solo imports con @use
│   ├── abstracts/          → _variables, _mixins, _placeholders
│   ├── base/               → _tokens, _reset, _tipografia, _texturas
│   ├── layout/             → _main, _footer
│   ├── components/         → _navbar, _meta, _cta, _card,
│   │                          _plan, _form, _ficha, _cierre, _ticket,
│   │                          _scroll-hint, _motion
│   └── pages/              → _home, _planes
├── styles/
│   └── main.css            → CSS compilado
├── js/
│   ├── main.js             → trazo, indicador de scroll, AOS
│   └── presupuesto.js      → calculadora del ticket
└── assets/
    ├── img/                → imágenes y logotipo
    └── vendor/             → Bootstrap y AOS
```

---

## Cómo trabajar el proyecto

```bash
npm install       # instala Sass
npm run dev       # compila SCSS y queda observando cambios
npm run build     # compila minificado para producción
```

El CSS compilado (`styles/main.css`) se versiona en el repositorio para que el
deploy sea estático y no necesite ningún paso de build.

---

## Accesibilidad

- Todas las imágenes tienen `alt` descriptivo.
- Jerarquía de encabezados sin saltos (`h1` → `h2` → `h3`).
- Estados de foco visibles en todos los elementos interactivos.
- Se respeta `prefers-reduced-motion`: si el visitante pidió menos
  movimiento, no se ejecuta ninguna animación.

---

© 2026 .Conecta — Amalia Gross y Facundo Silveira
