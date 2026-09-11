/* ============================================================
   .Conecta — la calculadora de presupuesto.

   SIN BASE DE DATOS Y SIN BACKEND.
   La fuente de verdad de los precios es el propio HTML: cada
   servicio es un checkbox con data-precio y data-unidad. Este
   script suma los que están marcados y arma el ticket.

   Para cambiar un precio o sumar un servicio se edita una ficha
   del HTML. Acá no hay que tocar nada.
   ============================================================ */
(() => {
  "use strict";

  const form   = document.querySelector("#form-presupuesto");
  const ticket = document.querySelector("#ticket");
  if (!form || !ticket) return;

  const lineas  = ticket.querySelector("#ticket-lineas");
  const totalEl = ticket.querySelector("#ticket-total");
  const contEl  = ticket.querySelector("#ticket-items");
  const fechaEl = ticket.querySelector("#ticket-fecha");
  const vacio   = document.querySelector("#ticket-vacio");
  const botones = document.querySelector("#ticket-acciones");

  const fichas = Array.from(form.querySelectorAll("input[data-precio]"));
  const planes = fichas.filter((f) => f.id.startsWith("plan-"));

  const menosMovimiento =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pesos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });

  /* --- El nombre sale de la propia ficha --------------------- */
  const nombreDe = (ficha) => {
    const etiqueta = form.querySelector(`label[for="${ficha.id}"]`);
    const nombre = etiqueta && etiqueta.querySelector(".ficha__nombre");
    return nombre ? nombre.textContent.trim() : ficha.name;
  };

  const elegidos = () =>
    fichas
      .filter((ficha) => ficha.checked)
      .map((ficha) => ({
        nombre: nombreDe(ficha),
        unidad: ficha.dataset.unidad,
        precio: parseInt(ficha.dataset.precio, 10) || 0
      }));

  /* --- Una fila del ticket ---------------------------------- */
  const fila = (item) => {
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = item.nombre;

    if (item.unidad) {
      const detalle = document.createElement("span");
      detalle.className = "ticket__unidad";
      detalle.textContent = item.unidad;
      th.appendChild(detalle);
    }

    const td = document.createElement("td");
    td.textContent = pesos.format(item.precio);

    tr.append(th, td);
    return tr;
  };

  /* --- Redibuja el ticket completo -------------------------- */
  const armar = () => {
    const items = elegidos();
    const hay = items.length > 0;

    ticket.hidden = !hay;
    if (vacio) vacio.hidden = hay;
    if (botones) botones.hidden = !hay;
    if (!hay) return null;

    lineas.replaceChildren(...items.map(fila));

    const total = items.reduce((suma, item) => suma + item.precio, 0);
    totalEl.textContent = pesos.format(total);
    contEl.textContent = items.length === 1
      ? "1 servicio"
      : `${items.length} servicios`;
    fechaEl.textContent = new Date().toLocaleDateString("es-AR", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });

    return { items, total };
  };

  /* --- Un solo plan mensual por presupuesto ------------------ */
  const unSoloPlan = (elegido) => {
    if (!elegido.id.startsWith("plan-") || !elegido.checked) return;
    planes.forEach((otro) => {
      if (otro !== elegido) otro.checked = false;
    });
  };

  /* --- El total se actualiza en cada click ------------------- */
  form.addEventListener("change", (evento) => {
    const ficha = evento.target;
    if (!ficha.dataset || ficha.dataset.precio === undefined) return;
    unSoloPlan(ficha);
    armar();
  });

  /* --- El botón "imprime": trae el ticket -------------------- */
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();               // no hay servidor a donde enviar
    const resultado = armar();
    if (!resultado) {
      if (fichas[0]) fichas[0].focus();
      return;
    }
    if (!menosMovimiento) {
      ticket.classList.remove("esta-imprimiendo");
      void ticket.offsetWidth;             // reinicia la animación
      ticket.classList.add("esta-imprimiendo");
    }
    ticket.scrollIntoView({
      behavior: menosMovimiento ? "auto" : "smooth",
      block: "center"
    });
  });

  /* --- Imprimir de verdad (o guardar como PDF) -------------- */
  const imprimir = document.querySelector("#ticket-imprimir");
  if (imprimir) imprimir.addEventListener("click", () => window.print());

  /* --- Enviarlo por WhatsApp, sin backend ------------------- */
  const enviar = document.querySelector("#ticket-whatsapp");
  if (enviar) {
    enviar.addEventListener("click", () => {
      const items = elegidos();
      if (!items.length) return;
      const total = items.reduce((suma, item) => suma + item.precio, 0);
      const texto = [
        "Hola .Conecta! Armé este presupuesto en la web:",
        "",
        ...items.map((item) =>
          `• ${item.nombre} (${item.unidad}) — ${pesos.format(item.precio)}`),
        "",
        `TOTAL: ${pesos.format(total)}`
      ].join("\n");
      enviar.href =
        "https://wa.me/543755505926?text=" + encodeURIComponent(texto);
    });
  }

  armar();
})();
