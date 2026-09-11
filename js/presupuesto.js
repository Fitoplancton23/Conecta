/* ============================================================
   .Conecta — la calculadora de presupuesto.

   SIN BASE DE DATOS Y SIN BACKEND.
   La fuente de verdad de los precios es el propio HTML: cada
   servicio es un <input> con data-precio y data-unidad. Este
   script recorre esos inputs, se queda con los que tienen
   cantidad > 0, multiplica precio x cantidad y arma el ticket.

   Para cambiar un precio o sumar un servicio se edita una línea
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

  const campos = Array.from(form.querySelectorAll("input[data-precio]"));
  const planes = campos.filter((c) => c.id.startsWith("plan-"));

  const menosMovimiento =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Formato de moneda argentina -------------------------- */
  const pesos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });

  /* --- Cómo se lee la cantidad según la unidad -------------- */
  const unidades = {
    mes:       (n) => (n > 1 ? `${n} meses` : "por mes"),
    pieza:     (n) => (n > 1 ? `${n} piezas` : "1 pieza"),
    pack:      (n) => (n > 1 ? `${n} packs` : "1 pack"),
    red:       (n) => (n > 1 ? `${n} redes` : "1 red"),
    sesion:    (n) => (n > 1 ? `${n} sesiones` : "1 sesión"),
    unica:     (n) => (n > 1 ? `x${n}` : "único")
  };

  /* --- El nombre sale de la etiqueta, antes de la raya ------ */
  const nombreDe = (campo) => {
    if (campo.dataset.nombre) return campo.dataset.nombre;
    const etiqueta = form.querySelector(`label[for="${campo.id}"]`);
    const texto = etiqueta ? etiqueta.textContent : campo.name;
    return texto.split("—")[0].trim();
  };

  /* --- Los servicios elegidos ------------------------------- */
  const elegidos = () =>
    campos
      .map((campo) => {
        const cantidad = Math.max(0, parseInt(campo.value, 10) || 0);
        const precio = parseInt(campo.dataset.precio, 10) || 0;
        return {
          nombre: nombreDe(campo),
          unidad: campo.dataset.unidad,
          cantidad,
          subtotal: cantidad * precio
        };
      })
      .filter((item) => item.cantidad > 0);

  /* --- Una fila del ticket ---------------------------------- */
  const fila = (item) => {
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = item.nombre;

    const detalle = document.createElement("span");
    detalle.className = "ticket__unidad";
    const decir = unidades[item.unidad];
    detalle.textContent = decir ? decir(item.cantidad) : `x${item.cantidad}`;
    th.appendChild(detalle);

    const td = document.createElement("td");
    td.textContent = pesos.format(item.subtotal);

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
    if (!hay) return;

    lineas.replaceChildren(...items.map(fila));

    const total = items.reduce((suma, item) => suma + item.subtotal, 0);
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
    if (!elegido.id.startsWith("plan-")) return;
    if ((parseInt(elegido.value, 10) || 0) < 1) return;
    planes.forEach((otro) => {
      if (otro !== elegido) otro.value = 0;
    });
  };

  /* --- El total se actualiza mientras se escribe ------------- */
  form.addEventListener("input", (evento) => {
    const campo = evento.target;
    if (!campo.dataset || campo.dataset.precio === undefined) return;
    unSoloPlan(campo);
    armar();
  });

  /* --- El botón "imprime": recalcula y trae el ticket ------- */
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();               // no hay servidor a donde enviar
    const resultado = armar();
    if (!resultado) {
      const primero = campos[0];
      if (primero) primero.focus();
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
      const total = items.reduce((suma, item) => suma + item.subtotal, 0);
      const texto = [
        "Hola .Conecta! Armé este presupuesto en la web:",
        "",
        ...items.map((item) => {
          const decir = unidades[item.unidad];
          const detalle = decir ? decir(item.cantidad) : `x${item.cantidad}`;
          return `• ${item.nombre} (${detalle}) — ${pesos.format(item.subtotal)}`;
        }),
        "",
        `TOTAL: ${pesos.format(total)}`
      ].join("\n");
      enviar.href =
        "https://wa.me/543755505926?text=" + encodeURIComponent(texto);
    });
  }

  armar();
})();
