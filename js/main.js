/* ============================================================
   .Conecta — interacciones. Sin dependencias, sin librerías.
   Solo dos cosas, y las dos sirven al concepto:
     1. El TRAZO se dibuja del polo naranja al polo azul mientras
        se baja: la página se va conectando a medida que se lee.
     2. Los bloques APARECEN al entrar en pantalla, escalonados.
   Si el visitante pidió menos movimiento, no hacemos ninguna.
   ============================================================ */
(() => {
  "use strict";

  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 0. El indicador de scroll ----------
     Se desvanece y baja mientras el visitante scrollea. */
  const indicador = document.querySelector(".scroll-hint");

  const actualizarIndicador = () => {
    if (!indicador) return;
    const recorrido = 300;                       // px hasta que desaparece
    const p = Math.min(1, window.scrollY / recorrido);
    indicador.style.setProperty("--visible", (1 - p).toFixed(3));
    indicador.style.setProperty("--desplazamiento", (p * 44).toFixed(1) + "px");
  };

  /* ---------- 1. El trazo que conecta ---------- */
  const relleno = document.querySelector(".trazo__fill");
  const contenido = document.querySelector("main");

  if (relleno && contenido && !menosMovimiento) {
    let pidiendoCuadro = false;

    const dibujar = () => {
      const caja = contenido.getBoundingClientRect();
      const recorrido = caja.height - window.innerHeight * 0.5;
      const avance = recorrido > 0
        ? (window.innerHeight * 0.5 - caja.top) / recorrido
        : 1;
      relleno.style.setProperty("--p", Math.min(1, Math.max(0, avance)).toFixed(4));
      actualizarIndicador();
      pidiendoCuadro = false;
    };

    const alScrollear = () => {
      if (pidiendoCuadro) return;
      pidiendoCuadro = true;
      requestAnimationFrame(dibujar);
    };

    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear, { passive: true });
    dibujar();
  }

  if (indicador && (!relleno || menosMovimiento)) {
    window.addEventListener("scroll", actualizarIndicador, { passive: true });
  }
  actualizarIndicador();

  /* ---------- 2. Aparición al entrar en pantalla (AOS) ---------- */
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
      disable: menosMovimiento
    });
  }
})();
