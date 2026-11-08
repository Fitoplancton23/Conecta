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
(`npx impeccable detect`), que solo marca los recortes irregulares, a propósito: son el acento pedido.

### Acento: mixed media y papel recortado a mano

Sobre la estructura limpia de "Papel y tinta" hay un acento analógico, usado
con criterio y no como sistema: pocas piezas con borde irregular, cada una con
su propio corte.

- **Recortado a tijera** (`clip-path` con siluetas asimétricas): el disco
  naranja del hero, la tira detrás de "dupla", el botón de WhatsApp, los
  stickers ("40% off", "El más popular", "En desarrollo") y una captura con cinta.
- **Rasgado** (máscaras SVG en `assets/papel/`, con el núcleo blanco de la hoja
  asomando): la banda de la oferta, la captura de Hugo Dellana y el papel
  debajo de la moto.
- **Textura**: un grano de papel muy sutil, solo sobre las piezas de papel.
- **Profundidad**: sombras suaves con desplazamiento (`filter: drop-shadow` en
  el contenedor, porque `clip-path` recorta cualquier `box-shadow`).
- **Se mantiene limpio y geométrico**: navegación, grillas, planes, formularios,
  calculadora y bloques de lectura.

Todo vive en `scss/components/_papel.scss`, con los recortes y el grano en
`_variables.scss` y los mixins `recorte` y `papel-rasgado` en `_mixins.scss`.
Las piezas decorativas son `aria-hidden` y el texto real sigue en el DOM.

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
│   │                          _ticket, _papel, _motion
│   └── pages/              → _paginas
├── styles/
│   └── main.css            → CSS compilado
├── js/
│   ├── main.js             → AOS
│   └── presupuesto.js      → calculadora del ticket
└── assets/
    ├── fonts/              → Bricolage Grotesque y Schibsted Grotesk
    ├── img/                → imágenes y logotipo (blanco y tinta)
    ├── papel/              → bordes rasgados (máscaras SVG)
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
