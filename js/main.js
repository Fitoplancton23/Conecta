/* ============================================================
   .Conecta — interacciones. Sin dependencias propias.
   Una sola cosa: los bloques APARECEN al entrar en pantalla (AOS).
   El movimiento fuerte de la portada (el punto que crece y la
   dupla que sube) es CSS puro y vive en components/_hero.scss.
   Si el visitante pidió menos movimiento, no hacemos ninguna.
   ============================================================ */
(() => {
  "use strict";

  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.AOS) {
    window.AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: menosMovimiento
    });
  }
})();
