"use strict";

/* =====================================================
   CONTENIDO EDITABLE

   Para agregar imágenes, coloca la ruta en "imagen".
   Ejemplo: imagen: "./assets/imagen1.png"

   Las descripciones quedan vacías hasta que las completes.
   No es necesario añadirlas para que funcionen los enlaces.
   ===================================================== */

const sitio = {
  nombre: "[Nombre]",
  rol: "[Rol]",
  correo: "",
  wiki: ""
};

const tareas = [
  {
    titulo: "The Dark Side Of The Moon",
    resumen: "Recreación de portada de album usando geometrías de p5js.",
    descripcion: "",
    imagen: "sitio web ie 2026 - html css/assets/enacargo1.png",
    p5: "",
    wiki: "https://wiki.ead.pucv.cl/Encargo_1_IE_-_The_Dark_Side_Of_The_Moon_-_Valentina_C%C3%B3rdova"
  },
  {
    titulo: "Tramas en extension radial",
    resumen: ".",
    descripcion: "",
    imagen: "",
    p5: "",
    wiki: "https://wiki.ead.pucv.cl/Encargo_2_IE_-_Valentina_C%C3%B3rdova_Rosas"
  },
  {
    titulo: "Movimiento concéntrico de romboide en transformación",
    resumen: "",
    descripcion: "",
    imagen: "",
    p5: "",
    wiki: "https://wiki.ead.pucv.cl/Encargo_3_IE_-_Valentina_C%C3%B3rdova"
  },
  {
    titulo: "Floración radial en eco de luz",
    resumen: "",
    descripcion: "",
    imagen: "",
    p5: "",
    wiki: "https://wiki.ead.pucv.cl/Encargo_4_IE_-_Valentina_C%C3%B3rdova"
  },
  {
    titulo: "Explosión estelar",
    resumen: "",
    descripcion: "",
    imagen: "",
    p5: "",
    wiki: "https://wiki.ead.pucv.cl/Encargo_5_IE_-_Valentina_C%C3%B3rdova"
  }
];

const proyecto = {
  titulo: "[Título del proyecto]",
  resumen: "[Descripción breve del proyecto final.]",
  descripcion: "",
  imagen: "",
  p5: "",
  wiki: ""
};

/* =====================================================
   FUNCIONAMIENTO
   ===================================================== */

const $ = (selector) => document.querySelector(selector);

const modal = $("#detail");
const lista = $("#task-list");
const botonAnterior = $("#previous");
const botonSiguiente = $("#next");

const reducirMovimiento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let ultimoBoton = null;

/* Validar enlaces */

function urlWeb(valor) {
  if (!valor) return "";

  try {
    const url = new URL(valor);

    return ["https:", "http:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function configurarEnlace(elemento, valor) {
  const url = urlWeb(valor);

  if (url) {
    elemento.href = url;
    elemento.target = "_blank";
    elemento.rel = "noopener noreferrer";
    elemento.removeAttribute("aria-disabled");
    elemento.removeAttribute("title");
  } else {
    elemento.removeAttribute("href");
    elemento.removeAttribute("target");
    elemento.removeAttribute("rel");
    elemento.setAttribute("aria-disabled", "true");
    elemento.title = "Enlace pendiente de completar";
  }

  return Boolean(url);
}

/* Crear elementos de texto */

function crearTexto(etiqueta, clase, contenido) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = contenido;
  return elemento;
}

/* Mostrar imagen o marcador vacío */

function pintarVista(contenedor, imagen, titulo) {
  contenedor.replaceChildren();

  function mostrarMarcador() {
    contenedor.replaceChildren();

    const cruz = document.createElement("span");
    cruz.className = "cross";
    cruz.setAttribute("aria-hidden", "true");

    contenedor.append(
      cruz,
      crearTexto("span", "", "Vista previa vacía")
    );
  }

  if (!imagen) {
    mostrarMarcador();
    return;
  }

  let url;

  try {
    url = new URL(imagen, document.baseURI);

    if (!["http:", "https:", "file:"].includes(url.protocol)) {
      mostrarMarcador();
      return;
    }
  } catch {
    mostrarMarcador();
    return;
  }

  const img = document.createElement("img");
  img.src = url.href;
  img.alt = titulo;
  img.loading = "lazy";

  img.addEventListener("error", mostrarMarcador, {
    once: true
  });

  contenedor.append(img);
}

/* Contacto */

$("#contact-name").textContent = sitio.nombre;
$("#contact-role").textContent = sitio.rol;

const correo = $("#contact-email");

if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sitio.correo)) {
  correo.textContent = sitio.correo;
  correo.href = `mailto:${sitio.correo}`;
} else {
  correo.setAttribute("aria-disabled", "true");
  correo.title = "Correo pendiente de completar";
}

const wikiPersonal = $("#contact-wiki");

if (configurarEnlace(wikiPersonal, sitio.wiki)) {
  wikiPersonal.textContent = "Ver wiki personal ↗";
}

/* Abrir detalle */

function abrirDetalle(elemento, etiqueta, esProyecto = false) {
  ultimoBoton = document.activeElement;

  $("#detail-label").textContent = etiqueta;
  $("#detail-label").className = esProyecto
    ? "eyebrow violet"
    : "eyebrow cyan";

  $("#detail-title").textContent = elemento.titulo;

  pintarVista(
    $("#detail-preview"),
    elemento.imagen,
    elemento.titulo
  );

  const descripcion = (elemento.descripcion || "").trim();

  $("#detail-description").textContent = descripcion;
  $("#detail-description-block").hidden = !descripcion;

  const tieneP5 = configurarEnlace(
    $("#detail-p5"),
    elemento.p5
  );

  const tieneWiki = configurarEnlace(
    $("#detail-wiki"),
    elemento.wiki
  );

  $("#detail-p5").hidden = !tieneP5;
  $("#detail-wiki").hidden = !tieneWiki;
  $("#detail-pending").hidden = tieneP5 || tieneWiki;

  modal.showModal();
  modal.scrollTop = 0;
  document.body.classList.add("modal-open");

  $("#close-detail").focus({
    preventScroll: true
  });
}

/* Crear las cinco tarjetas */

tareas.forEach((tarea, indice) => {
  const tarjeta = document.createElement("article");
  tarjeta.className = "task-card";

  const vista = document.createElement("div");
  vista.className = "preview task-preview";

  pintarVista(vista, tarea.imagen, tarea.titulo);

  const informacion = document.createElement("div");
  informacion.className = "task-info";

  informacion.append(
    crearTexto("p", "eyebrow cyan", `Encargo ${indice + 1}`),
    crearTexto("h3", "", tarea.titulo)
  );

  if (tarea.resumen) {
    informacion.append(
      crearTexto("p", "muted task-summary", tarea.resumen)
    );
  }

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "text-link task-open";

  boton.setAttribute(
    "aria-label",
    `Ver detalle del encargo ${indice + 1}: ${tarea.titulo}`
  );

  boton.setAttribute("aria-haspopup", "dialog");
  boton.setAttribute("aria-controls", "detail");

  const flecha = crearTexto("span", "", "→");
  flecha.setAttribute("aria-hidden", "true");

  boton.append(
    crearTexto("span", "", "Ver tarea"),
    flecha
  );

  boton.addEventListener("click", () => {
    abrirDetalle(tarea, `Encargo ${indice + 1}`);
  });

  informacion.append(boton);
  tarjeta.append(vista, informacion);
  lista.append(tarjeta);
});

/* Proyecto final */

$("#project-title").textContent = proyecto.titulo;
$("#project-summary").textContent = proyecto.resumen;

pintarVista(
  $("#project-preview"),
  proyecto.imagen,
  proyecto.titulo
);

$("#open-project").addEventListener("click", () => {
  abrirDetalle(proyecto, "Proyecto final", true);
});

/* Cerrar detalle */

$("#close-detail").addEventListener("click", () => {
  modal.close();
});

/* Escape también cierra el diálogo de forma nativa. */

modal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");

  if (ultimoBoton && ultimoBoton.isConnected) {
    ultimoBoton.focus({
      preventScroll: true
    });
  }
});

/* Cerrar pulsando fuera del cuadro */

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
  pulsacionFuera =
    evento.target === modal && estaFueraDelModal(evento);
});

modal.addEventListener("click", (evento) => {
  if (
    pulsacionFuera &&
    evento.target === modal &&
    estaFueraDelModal(evento)
  ) {
    modal.close();
  }

  pulsacionFuera = false;
});

/* Desplazamiento horizontal de tareas */

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

botonAnterior.addEventListener("click", () => {
  desplazarTareas(-1);
});

botonSiguiente.addEventListener("click", () => {
  desplazarTareas(1);
});

lista.addEventListener("scroll", actualizarControles, {
  passive: true
});

window.addEventListener("resize", actualizarControles);
window.addEventListener("load", actualizarControles);

if ("ResizeObserver" in window) {
  const observador = new ResizeObserver(actualizarControles);
  observador.observe(lista);
}

actualizarControles();
