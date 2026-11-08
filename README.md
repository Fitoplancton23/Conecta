# .Conecta — Sitio institucional

Sitio web estático de **.Conecta**, una dupla de gestión de redes sociales y
desarrollo web formada por **Amalia Gross** (Lic. en Comunicación Social) y
**Facundo Silveira** (Diseñador Digital / UX-UI).

🔗 **Sitio en producción:** https://celadon-meerkat-376bb0.netlify.app
📦 **Repositorio:** https://github.com/Fitoplancton23/Conecta

---

## El concepto: "Papel y tinta"

Una hoja, una tinta y un solo color de imprenta. Conecta es una dupla y su
logotipo arranca con un punto: ese punto es el único gesto del sistema. Aparece
enorme detrás de la dupla en el hero, como viñeta de cada ficha del presupuesto
y como subrayado del enlace activo. Todo lo demás es tipografía y líneas finas.

| Elemento | Valor |
| --- | --- |
| Papel | `#eeefed` (gris papel de diario, sin tinte crema) |
| Tinta | `#121312` |
| Color de imprenta | Naranja `#ff3000`, siempre plano |
| Títulos y precios | Bricolage Grotesque (variable) |
| Texto corrido | Schibsted Grotesk (variable) |

### Criterios de diseño

1. Un color, plano. Sin degradados, resplandores ni retículas de fondo.
2. La jerarquía sale del tamaño, del peso y de las líneas finas, no de cajas:
   los planes son una carta de precios, los proyectos un índice, los grupos del
   presupuesto renglones. No hay grillas de tarjetas idénticas.
3. Composición asimétrica: títulos alineados a la izquierda, bloques que se
   espejan, nada centrado por defecto.
4. Sin kickers sobre los títulos, sin numeración decorativa, sin letreros en
   movimiento ni íconos de relleno.
5. Un solo momento animado (el punto que crece en el hero) más la aparición
   escalonada con AOS.
6. Rendimiento y accesibilidad son parte del diseño: tipografías alojadas en el
   repo, contraste AA, foco visible, `prefers-reduced-motion`.

El rediseño se revisó con [Impeccable](https://impeccable.style)
(`npx impeccable detect`), que no reporta anti-patrones sobre las cinco páginas.

---

## Stack

- **HTML5 semántico** — `header`, `nav`, `main`, `section`, `article`, `figure`, `footer`.
- **SCSS** con arquitectura de partials (variables, mixins con parámetros,
  placeholders con `@extend`, nesting).
- **Bootstrap 5.3.3** — navbar responsiva con menú hamburguesa, re-estilada
  por completo desde SCSS.
- **AOS 2.3.4** — animaciones de aparición al hacer scroll.
- **JavaScript sin dependencias** — la calculadora de presupuesto, sin una
  sola librería.
- **Tipografías alojadas** en `assets/fonts/` (variables, subset latino).

Bootstrap y AOS están incorporados localmente en `assets/vendor/` en lugar de
por CDN, y las tipografías en `assets/fonts/`: el sitio no depende de que un
servicio externo esté disponible.

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
│   ├── base/               → _fuentes, _tokens, _reset, _tipografia
│   ├── layout/             → _main, _footer
│   ├── components/         → _navbar, _cta, _hero, _servicio, _proyecto,
│   │                          _cierre, _plan, _form, _ficha, _impresora,
│   │                          _ticket, _motion
│   └── pages/              → _paginas
├── styles/
│   └── main.css            → CSS compilado
├── js/
│   ├── main.js             → AOS
│   └── presupuesto.js      → calculadora del ticket
└── assets/
    ├── fonts/              → Bricolage Grotesque y Schibsted Grotesk
    ├── img/                → imágenes y logotipo (blanco y tinta)
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
