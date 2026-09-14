/* ============================================================
   .Conecta — la calculadora de presupuesto.

   SIN BASE DE DATOS Y SIN BACKEND.
   La fuente de verdad de los precios es el propio HTML: cada
   servicio es un checkbox con data-precio y data-unidad.

   Dos estados, como una impresora de verdad:
     1. En reposo el visor va mostrando el total mientras el
        visitante elige fichas. No hay papel.
     2. Al pedir el presupuesto la máquina "imprime": se arma el
        ticket y sale por la ranura.
   ============================================================ */
(() => {
  "use strict";

  const form      = document.querySelector("#form-presupuesto");
  const impresora = document.querySelector("#impresora");
  const ticket    = document.querySelector("#ticket");
  if (!form || !impresora || !ticket) return;

  const lineas   = ticket.querySelector("#ticket-lineas");
  const totalEl  = ticket.querySelector("#ticket-total");
  const contEl   = ticket.querySelector("#ticket-items");
  const fechaEl  = ticket.querySelector("#ticket-fecha");
  const codigoEl = ticket.querySelector("#ticket-codigo");
  const rotuloEl = ticket.querySelector("#ticket-total-rotulo");
  const botones  = document.querySelector("#ticket-acciones");

  const visorTitulo  = document.querySelector("#visor-titulo");
  const visorTotal   = document.querySelector("#visor-total");
  const visorDetalle = document.querySelector("#visor-detalle");
  const visorEstado  = document.querySelector("#visor-estado-texto");

  const fichas = Array.from(form.querySelectorAll("input[data-precio]"));
  const planes = fichas.filter((f) => f.id.startsWith("plan-"));

  const menosMovimiento =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pesos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });

  const contar = (n) => (n === 1 ? "1 servicio" : `${n} servicios`);

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
        precio: parseInt(ficha.dataset.precio, 10) || 0,
        // "desde": el precio es el mínimo, no el final. Cambia cómo se
        // lee la línea y cómo se rotula el total.
        desde: ficha.dataset.desde === "1"
      }));

  const sumar = (items) => items.reduce((suma, i) => suma + i.precio, 0);
  const hayDesde = (items) => items.some((i) => i.desde);

  /* --- 1. El visor: se actualiza en cada click --------------- */
  const actualizarVisor = () => {
    const items = elegidos();
    visorTotal.textContent = (hayDesde(items) ? "desde " : "") +
      pesos.format(sumar(items));
    visorDetalle.textContent = items.length
      ? contar(items.length)
      : "Ningún servicio elegido";

    // El título dice qué se está cotizando: el plan manda, y si no
    // hay plan es un armado suelto.
    const plan = planes.find((p) => p.checked);
    visorTitulo.textContent = plan
      ? nombreDe(plan)
      : (items.length ? "Servicios a medida" : "Presupuesto");

    if (!impresora.classList.contains("esta-imprimiendo")) {
      visorEstado.textContent = items.length
        ? "Listo para imprimir"
        : "Elegí los servicios de arriba";
    }
  };

  /* --- 2. El papel: se arma solo al pedirlo ------------------ */
  const fila = (item) => {
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = item.nombre;

    if (item.unidad) {
      const detalle = document.createElement("span");
      detalle.className = "ticket__unidad";
      detalle.textContent = item.desde
        ? `${item.unidad} · desde`
        : item.unidad;
      th.appendChild(detalle);
    }

    const td = document.createElement("td");
    td.textContent = pesos.format(item.precio);

    tr.append(th, td);
    return tr;
  };

  // Un número de comprobante legible, derivado de la fecha.
  // No identifica a nadie: es para que el ticket se sienta real
  // y para que puedan citarlo por WhatsApp.
  const codigo = () => {
    const hoy = new Date();
    const dia = `${hoy.getFullYear()}`.slice(2) +
      `${hoy.getMonth() + 1}`.padStart(2, "0") +
      `${hoy.getDate()}`.padStart(2, "0");
    const serie = `${Math.floor(Math.random() * 9000) + 1000}`;
    return `CNCT-${dia}-${serie}`;
  };

  const armarTicket = () => {
    const items = elegidos();
    if (!items.length) return null;

    lineas.replaceChildren(...items.map(fila));

    // Con un servicio "desde" adentro, el total es un piso y no un
    // precio: decir "Total" a secas sería mentir en el comprobante.
    const estimado = hayDesde(items);
    rotuloEl.textContent = estimado ? "Total estimado" : "Total";
    totalEl.textContent = (estimado ? "desde " : "") + pesos.format(sumar(items));
    contEl.textContent = contar(items.length);
    fechaEl.textContent = new Date().toLocaleDateString("es-AR", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });
    codigoEl.textContent = codigo();
    return items;
  };

  /* --- Un solo plan mensual por presupuesto ------------------ */
  const unSoloPlan = (elegido) => {
    if (!elegido.id.startsWith("plan-") || !elegido.checked) return;
    planes.forEach((otro) => {
      if (otro !== elegido) otro.checked = false;
    });
  };

  form.addEventListener("change", (evento) => {
    const ficha = evento.target;
    if (!ficha.dataset || ficha.dataset.precio === undefined) return;
    unSoloPlan(ficha);
    actualizarVisor();

    // Si ya había un ticket afuera, deja de valer: se retrae.
    if (impresora.classList.contains("tiene-papel")) {
      impresora.classList.remove("tiene-papel");
      if (botones) botones.hidden = true;
    }
  });

  /* --- La secuencia de impresión ----------------------------- */
  let imprimiendo = false;

  const imprimir = () => {
    if (imprimiendo) return;
    const items = armarTicket();

    if (!items) {                          // nada elegido todavía
      visorEstado.textContent = "Elegí al menos un servicio";
      const primera = form.querySelector(".ficha");
      if (primera) primera.scrollIntoView({ block: "center" });
      if (fichas[0]) fichas[0].focus();
      return;
    }

    const salir = () => {
      impresora.classList.add("tiene-papel");
      impresora.classList.remove("esta-imprimiendo");
      visorEstado.textContent = "Presupuesto listo";
      if (botones) botones.hidden = false;
      imprimiendo = false;
      impresora.scrollIntoView({
        behavior: menosMovimiento ? "auto" : "smooth",
        block: "center"
      });
    };

    if (menosMovimiento) { salir(); return; }

    imprimiendo = true;
    impresora.classList.remove("tiene-papel");
    impresora.classList.add("esta-imprimiendo");
    visorEstado.textContent = "Imprimiendo tu presupuesto…";
    if (botones) botones.hidden = true;
    setTimeout(salir, 900);                // el cabezal tarda un poco
  };

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();               // no hay servidor a donde enviar
    imprimir();
  });

  /* --- Imprimir de verdad (o guardar como PDF) -------------- */
  const aPapel = document.querySelector("#ticket-imprimir");
  if (aPapel) aPapel.addEventListener("click", () => window.print());

  /* --- Enviarlo por WhatsApp, sin backend ------------------- */
  const enviar = document.querySelector("#ticket-whatsapp");
  if (enviar) {
    enviar.addEventListener("click", () => {
      const items = elegidos();
      if (!items.length) return;
      const texto = [
        "Hola .Conecta! Armé este presupuesto en la web:",
        "",
        ...items.map((i) =>
          `• ${i.nombre} (${i.unidad}) — ${i.desde ? "desde " : ""}${pesos.format(i.precio)}`),
        "",
        `${hayDesde(items) ? "TOTAL ESTIMADO: desde " : "TOTAL: "}${pesos.format(sumar(items))}`,
        codigoEl.textContent ? `Comprobante ${codigoEl.textContent}` : ""
      ].filter(Boolean).join("\n");
      enviar.href =
        "https://wa.me/543755505926?text=" + encodeURIComponent(texto);
    });
  }

  actualizarVisor();
})();
