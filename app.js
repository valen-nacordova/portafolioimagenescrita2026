"use strict";

/* =====================================================
   CONTENIDO
   ===================================================== */

const tareas = [
  {
    titulo: "The Dark Side Of The Moon",
    descripcion: "Estudio sintáctico de refracción de color y formas mediante primitivas de p5.js.",
    imagen: "./assets/encargo1.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_1_IE_-_The_Dark_Side_Of_The_Moon_-_Valentina_C%C3%B3rdova",
    codigo: `function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(8, 9, 11);\n  // Algoritmo p5.js para Encargo 1\n}`
  },
  {
    titulo: "Tramas en extension radial",
    descripcion: "",
    imagen: "./assets/encargo2.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_2_IE_-_Valentina_C%C3%B3rdova_Rosas",
    codigo: `function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(8, 9, 11);\n  // Algoritmo p5.js para Encargo 2\n}`
  },
  {
    titulo: "Movimiento concéntrico de romboide en transformación",
    descripcion: "",
    imagen: "./assets/encargo3.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_3_IE_-_Valentina_C%C3%B3rdova",
    codigo: `function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(8, 9, 11);\n  // Algoritmo p5.js para Encargo 3\n}`
  },
  {
    titulo: "Floración radial en eco de luz",
    descripcion: "",
    imagen: "./assets/encargo4.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_4_IE_-_Valentina_C%C3%B3rdova",
    codigo: `function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(8, 9, 11);\n  // Algoritmo p5.js para Encargo 4\n}`
  },
  {
    titulo: "Explosión estelar",
    descripcion: "",
    imagen: "./assets/encargo5.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_5_IE_-_Valentina_C%C3%B3rdova",
    codigo: `function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(8, 9, 11);\n  // Algoritmo p5.js para Encargo 5\n}`
  }
];

const proyecto = {
  titulo: "Desplazamiento del eco lumínico en gradiente lineal",
  descripcion: "",
  imagen: "./assets/proyectofinal.png",
  wiki: "https://wiki.ead.pucv.cl/Desplazamiento_del_eco_lum%C3%ADnico_en_gradiente_lineal_-_Entrega_U1_IE",
  codigo: `function setup() {\n  createCanvas(800, 450);\n}\n\nfunction draw() {\n  background(8, 9, 11);\n  // Algoritmo p5.js Proyecto Final U1\n}`
};

/* =====================================================
   ELEMENTOS GENERALES
   ===================================================== */

const $ = (selector) => document.querySelector(selector);

const lista = $("#task-list");
const modal = $("#detail");
const botonAnterior = $("#previous");
const botonSiguiente = $("#next");

const reducirMovimiento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let ultimoBoton = null;

function crearTexto(etiqueta, clase, contenido) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = contenido;
  return elemento;
}

function urlWeb(valor) {
  if (!valor) return "";
  try {
    const url = new URL(valor);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

/* =====================================================
   IMÁGENES
   ===================================================== */

function pintarVista(
  contenedor,
  imagen,
  titulo,
  cargaInmediata = false
) {
  contenedor.replaceChildren();

  function mostrarError() {
    contenedor.replaceChildren(
      crearTexto(
        "p",
        "image-fallback",
        "Vista previa no disponible"
      )
    );
  }

  if (!imagen) {
    mostrarError();
    return;
  }

  let url;
  try {
    url = new URL(imagen, document.baseURI);
    if (!["http:", "https:", "file:"].includes(url.protocol)) {
      mostrarError();
      return;
    }
  } catch {
    mostrarError();
    return;
  }

  const img = document.createElement("img");
  img.alt = titulo;
  img.loading = cargaInmediata ? "eager" : "lazy";
  img.decoding = "async";

  img.addEventListener("error", mostrarError, { once: true });
  img.src = url.href;
  contenedor.append(img);
}

/* =====================================================
   PESTAÑAS DEL MODAL
   ===================================================== */

const tabBtnPreview = $("#tab-btn-preview");
const tabBtnCode = $("#tab-btn-code");
const tabPreview = $("#modal-tab-preview");
const tabCode = $("#modal-tab-code");

function cambiarPestaña(mostrarCodigo) {
  if (!tabBtnPreview || !tabBtnCode) return;

  tabBtnPreview.classList.toggle("active", !mostrarCodigo);
  tabBtnPreview.setAttribute("aria-selected", !mostrarCodigo);
  tabPreview.hidden = mostrarCodigo;

  tabBtnCode.classList.toggle("active", mostrarCodigo);
  tabBtnCode.setAttribute("aria-selected", mostrarCodigo);
  tabCode.hidden = !mostrarCodigo;
}

if (tabBtnPreview && tabBtnCode) {
  tabBtnPreview.addEventListener("click", () => cambiarPestaña(false));
  tabBtnCode.addEventListener("click", () => cambiarPestaña(true));
}

/* =====================================================
   DETALLE DE TAREA O PROYECTO
   ===================================================== */

function abrirDetalle(elemento, etiqueta, esProyecto = false) {
  ultimoBoton = document.activeElement;

  cambiarPestaña(false);

  $("#detail-label").textContent = etiqueta;
  $("#detail-label").className = esProyecto ? "eyebrow violet" : "eyebrow cyan";
  $("#detail-title").textContent = elemento.titulo;

  pintarVista(
    $("#detail-preview"),
    elemento.imagen,
    elemento.titulo,
    true
  );

  const codigoTxt = elemento.codigo || "// Código p5.js no disponible para este encargo.";
  $("#detail-code").textContent = codigoTxt;

  const descripcion = (elemento.descripcion || "").trim();
  $("#detail-description").textContent = descripcion;
  $("#detail-description-block").hidden = !descripcion;

  const enlace = $("#detail-wiki");
  const url = urlWeb(elemento.wiki);

  enlace.hidden = !url;
  if (url) enlace.href = url;
  else enlace.removeAttribute("href");

  modal.showModal();
  modal.scrollTop = 0;

  document.body.classList.add("modal-open");
  $("#close-detail").focus({ preventScroll: true });
}

$("#close-detail").addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (ultimoBoton && ultimoBoton.isConnected) {
    ultimoBoton.focus({ preventScroll: true });
  }
});

function estaFueraDelModal(evento) {
  const limites = modal.getBoundingClientRect();
  return (
    evento.clientX < limites.left ||
    evento.clientX > limites.right ||
    evento.clientY < limites.top ||
    evento.clientY > limites.bottom
  );
}

let pulsacionFuera = false;

modal.addEventListener("pointerdown", (evento) => {
  pulsacionFuera = evento.target === modal && estaFueraDelModal(evento);
});

modal.addEventListener("click", (evento) => {
  if (pulsacionFuera && evento.target === modal && estaFueraDelModal(evento)) {
    modal.close();
  }
  pulsacionFuera = false;
});

/* =====================================================
   CREAR TARJETAS
   ===================================================== */

lista.replaceChildren();

tareas.forEach((tarea, indice) => {
  const tarjeta = document.createElement("article");
  tarjeta.className = "task-card reveal";
  tarjeta.style.setProperty("--reveal-delay", `${Math.min(indice, 2) * 80}ms`);

  const vista = document.createElement("div");
  vista.className = "preview task-preview";
  pintarVista(vista, tarea.imagen, tarea.titulo);

  const informacion = document.createElement("div");
  informacion.className = "task-info";

  const etiqueta = crearTexto("p", "eyebrow cyan", `Encargo ${indice + 1}`);
  const titulo = crearTexto("h3", "", tarea.titulo);

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "text-link task-open";
  boton.setAttribute("aria-label", `Ver detalle del encargo ${indice + 1}: ${tarea.titulo}`);
  boton.setAttribute("aria-haspopup", "dialog");
  boton.setAttribute("aria-controls", "detail");

  const flecha = crearTexto("span", "", "→");
  flecha.setAttribute("aria-hidden", "true");

  boton.append(crearTexto("span", "", "Ver tarea"), flecha);

  boton.addEventListener("click", () => {
    abrirDetalle(tarea, `Encargo ${indice + 1}`);
  });

  informacion.append(etiqueta, titulo, boton);
  tarjeta.append(vista, informacion);
  lista.append(tarjeta);
});

/* =====================================================
   PROYECTO FINAL
   ===================================================== */

$("#project-title").textContent = proyecto.titulo;

pintarVista(
  $("#project-preview"),
  proyecto.imagen,
  proyecto.titulo
);

$("#open-project").addEventListener("click", () => {
  abrirDetalle(proyecto, "Proyecto final · Entrega U1", true);
});

/* =====================================================
   DESPLAZAMIENTO HORIZONTAL
   ===================================================== */

function desplazarTareas(direccion) {
  const tarjeta = lista.querySelector(".task-card");
  if (!tarjeta) return;

  const ancho = tarjeta.getBoundingClientRect().width;
  const separacion = parseFloat(getComputedStyle(lista).gap) || 20;

  lista.scrollBy({
    left: direccion * (ancho + separacion),
    behavior: reducirMovimiento.matches ? "instant" : "smooth"
  });
}

function actualizarControles() {
  botonAnterior.disabled = lista.scrollLeft <= 1;
  botonSiguiente.disabled =
    lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - 1;
}

botonAnterior.addEventListener("click", () => desplazarTareas(-1));
botonSiguiente.addEventListener("click", () => desplazarTareas(1));

lista.addEventListener("scroll", actualizarControles, { passive: true });
window.addEventListener("resize", actualizarControles);
window.addEventListener("load", actualizarControles);

if ("ResizeObserver" in window) {
  const observadorLista = new ResizeObserver(actualizarControles);
  observadorLista.observe(lista);
}

actualizarControles();

/* =====================================================
   FILTRO Y BÚSQUEDA INTERACTIVA
   ===================================================== */

function iniciarFiltroTareas() {
  const buscador = $("#task-search");
  const botonesFiltro = document.querySelectorAll(".tag-btn");
  const tarjetas = document.querySelectorAll(".task-card");

  if (!buscador || !tarjetas.length) return;

  let filtroActivo = "todos";
  let textoBusqueda = "";

  function aplicarFiltros() {
    tarjetas.forEach((tarjeta, indice) => {
      const tituloElemento = tarjeta.querySelector("h3");
      const tituloTexto = tituloElemento ? tituloElemento.textContent.toLowerCase() : "";
      const numeroEncargo = (indice + 1).toString();

      const coincideFiltro = filtroActivo === "todos" || filtroActivo === numeroEncargo;
      const coincideTexto = tituloTexto.includes(textoBusqueda);

      if (coincideFiltro && coincideTexto) {
        tarjeta.classList.remove("is-hidden");
      } else {
        tarjeta.classList.add("is-hidden");
      }
    });

    actualizarControles();
  }

  buscador.addEventListener("input", (e) => {
    textoBusqueda = e.target.value.trim().toLowerCase();
    aplicarFiltros();
  });

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesFiltro.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");
      filtroActivo = boton.dataset.filter;
      aplicarFiltros();
    });
  });
}

iniciarFiltroTareas();

/* =====================================================
   APARICIONES SUAVES
   ===================================================== */

function iniciarApariciones() {
  const elementos = document.querySelectorAll(".reveal");

  if (reducirMovimiento.matches || !("IntersectionObserver" in window)) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.remove("is-pending");
        entrada.target.classList.add("is-visible");
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.08 }
  );

  elementos.forEach((elemento) => {
    elemento.classList.add("is-pending");
    observador.observe(elemento);
  });
}

iniciarApariciones();

/* =====================================================
   CANVAS GENERATIVO EN PORTADA
   ===================================================== */

function iniciarMovimientoPortada() {
  const hero = $(".hero");
  const canvas = $("#hero-canvas");
  const boton = $("#toggle-hero-motion");

  if (!hero || !canvas || !boton) return;

  const ctx = canvas.getContext("2d");
  let animId = null;
  let pausaManual = false;

  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let ancho = (canvas.width = hero.clientWidth);
  let alto = (canvas.height = hero.clientHeight);

  function redimensionar() {
    ancho = canvas.width = hero.clientWidth;
    alto = canvas.height = hero.clientHeight;
    mouse.targetX = ancho / 2;
    mouse.targetY = alto / 2;
  }

  window.addEventListener("resize", redimensionar);
  redimensionar();

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
  });

  let tiempo = 0;

  function renderizar() {
    ctx.fillStyle = "rgba(8, 9, 11, 0.25)";
    ctx.fillRect(0, 0, ancho, alto);

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    tiempo += 0.015;
    const totalAnillos = 14;

    ctx.lineWidth = 1.2;

    for (let i = 0; i < totalAnillos; i++) {
      const proporcion = i / totalAnillos;
      const angulo = proporcion * Math.PI * 2 + tiempo * 0.4;

      const offsetX = (mouse.x - ancho / 2) * (0.1 + proporcion * 0.2);
      const offsetY = (mouse.y - alto / 2) * (0.1 + proporcion * 0.2);

      const cx = ancho / 2 + Math.cos(angulo) * (100 + i * 15) + offsetX;
      const cy = alto / 2 + Math.sin(angulo) * (60 + i * 10) + offsetY;

      const radio = 40 + Math.sin(tiempo + i * 0.5) * 25 + i * 8;

      ctx.strokeStyle = i % 2 === 0
        ? `rgba(137, 207, 224, ${0.15 + proporcion * 0.35})`
        : `rgba(186, 166, 232, ${0.12 + proporcion * 0.3})`;

      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(5, radio), 0, Math.PI * 2);
      ctx.stroke();
    }

    if (!pausaManual && !reducirMovimiento.matches && !document.hidden) {
      animId = requestAnimationFrame(renderizar);
    }
  }

  function actualizarMovimiento() {
    const detener = pausaManual || reducirMovimiento.matches || document.hidden;

    boton.hidden = reducirMovimiento.matches;
    boton.textContent = pausaManual ? "Reanudar movimiento" : "Pausar movimiento";

    if (detener) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else if (!animId) {
      renderizar();
    }
  }

  boton.addEventListener("click", () => {
    pausaManual = !pausaManual;
    actualizarMovimiento();
  });

  reducirMovimiento.addEventListener("change", actualizarMovimiento);
  document.addEventListener("visibilitychange", actualizarMovimiento);

  actualizarMovimiento();
}

iniciarMovimientoPortada();

/* =====================================================
   CURSOR PERSONALIZADO
   ===================================================== */

function iniciarCursorPersonalizado() {
  const cursor = $("#custom-cursor");

  if (!cursor || reducirMovimiento.matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add("is-active");
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-active");
  });

  function animarCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animarCursor);
  }

  animarCursor();

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, [role='button'], input, .task-card, .project-card")) {
      cursor.classList.add("is-hovering");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, [role='button'], input, .task-card, .project-card")) {
      cursor.classList.remove("is-hovering");
    }
  });
}

iniciarCursorPersonalizado();

/* =====================================================
   EFECTO 3D TILT EN TARJETAS
   ===================================================== */

function iniciarEfectoTilt() {
  if (reducirMovimiento.matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const tarjetas = document.querySelectorAll(".task-card, .project-card");

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("mousemove", (e) => {
      const rect = tarjeta.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centroX = rect.width / 2;
      const centroY = rect.height / 2;

      const rotacionX = ((y - centroY) / centroY) * -8;
      const rotacionY = ((x - centroX) / centroX) * 8;

      tarjeta.style.transform = `perspective(1000px) rotateX(${rotacionX}deg) rotateY(${rotacionY}deg) translateZ(6px)`;
    });

    tarjeta.style.transition = "transform 250ms var(--ease), border-color 250ms ease";

    tarjeta.addEventListener("mouseleave", () => {
      tarjeta.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
  });
}

iniciarEfectoTilt();
