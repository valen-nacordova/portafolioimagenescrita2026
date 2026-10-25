"use strict";

/* =====================================================
   CONTENIDO EDITABLE

   Imágenes:
   Usa rutas como "./assets/imagen1.png".

   Enlaces:
   Usa direcciones completas que comiencen con https://.
   Deja "" si todavía no tienes el enlace.

   La animación inicial se encuentra en el iframe del HTML.
   ===================================================== */

const sitio = {
  nombre: "[Nombre]",
  rol: "[Rol]",
  correo: "",
  asignatura: "",
  wiki: ""
};

const tareas = [
  {
    titulo: "[Título de la tarea 1]",
    resumen: "[Descripción breve de la tarea 1.]",
    descripcion:
      "[Descripción de la tarea 1: intención, exploración y relación con la imagen escrita.]",
    imagen: "",
    p5: "",
    wiki: ""
  },
  {
    titulo: "[Título de la tarea 2]",
    resumen: "[Descripción breve de la tarea 2.]",
    descripcion:
      "[Descripción de la tarea 2: intención, exploración y relación con la imagen escrita.]",
    imagen: "",
    p5: "",
    wiki: ""
  },
  {
    titulo: "[Título de la tarea 3]",
    resumen: "[Descripción breve de la tarea 3.]",
    descripcion:
      "[Descripción de la tarea 3: intención, exploración y relación con la imagen escrita.]",
    imagen: "",
    p5: "",
    wiki: ""
  },
  {
    titulo: "[Título de la tarea 4]",
    resumen: "[Descripción breve de la tarea 4.]",
    descripcion:
      "[Descripción de la tarea 4: intención, exploración y relación con la imagen escrita.]",
    imagen: "",
    p5: "",
    wiki: ""
  },
  {
    titulo: "[Título de la tarea 5]",
    resumen: "[Descripción breve de la tarea 5.]",
    descripcion:
      "[Descripción de la tarea 5: intención, exploración y relación con la imagen escrita.]",
    imagen: "",
    p5: "",
    wiki: ""
  }
];

const proyecto = {
  titulo: "[Título del proyecto]",
  resumen: "[Descripción breve del proyecto final.]",
  descripcion:
    "[Descripción del proyecto final, su proceso y resultados.]",
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

/* Validar enlaces externos */

function urlWeb(valor) {
  if (!valor) return "";

  try {
    const url = new URL(valor);

    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }

    return "";
  } catch {
    return "";
  }
}

/* Activar o desactivar enlaces según su contenido */

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
}

/* Crear elementos con texto */

function crearTexto(etiqueta, clase, contenido) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = contenido;
  return elemento;
}

/* Mostrar una imagen o un marcador vacío */

function pintarVista(contenedor, imagen, titulo, marcador) {
  contenedor.replaceChildren();

  function mostrarMarcador() {
    contenedor.replaceChildren();

    const cruz = document.createElement("span");
    cruz.className = "cross";
    cruz.setAttribute("aria-hidden", "true");

    contenedor.append(
      cruz,
      crearTexto("span", "", marcador)
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

/* Enlaces generales */

for (const clave of ["asignatura", "wiki"]) {
  document
    .querySelectorAll(`[data-link="${clave}"]`)
    .forEach((enlace) => {
      configurarEnlace(enlace, sitio[clave]);

      if (clave === "wiki" && urlWeb(sitio[clave])) {
        enlace.textContent = sitio[clave];
      }
    });

  document
    .querySelectorAll(`[data-url="${clave}"]`)
    .forEach((texto) => {
      if (urlWeb(sitio[clave])) {
        texto.textContent = sitio[clave];
      }
    });
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

/* Abrir detalle de tarea o proyecto */

function abrirDetalle(elemento, esProyecto = false) {
  ultimoBoton = document.activeElement;

  $("#detail-label").textContent = esProyecto
    ? "Proyecto / Ejemplo de estructura"
    : "Tarea / Ejemplo de estructura";

  $("#detail-label").className = esProyecto
    ? "eyebrow violet"
    : "eyebrow cyan";

  $("#detail-title").textContent = elemento.titulo;
  $("#detail-description").textContent = elemento.descripcion;

  pintarVista(
    $("#detail-preview"),
    elemento.imagen,
    elemento.titulo,
    "Espacio para el sketch p5.js"
  );

  $("#detail-caption").textContent = elemento.imagen
    ? "p5.js / Vista previa"
    : "p5.js / Representación estática";

  $("#detail-example-note").hidden = Boolean(elemento.imagen);

  configurarEnlace($("#detail-p5"), elemento.p5);
  configurarEnlace($("#detail-p5-text"), elemento.p5);
  configurarEnlace($("#detail-wiki"), elemento.wiki);
  configurarEnlace($("#detail-wiki-text"), elemento.wiki);

  $("#detail-p5-text").textContent =
    urlWeb(elemento.p5) || "[URL de p5.js]";

  $("#detail-wiki-text").textContent =
    urlWeb(elemento.wiki) || "[URL de wiki]";

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

  pintarVista(
    vista,
    tarea.imagen,
    tarea.titulo,
    "Vista previa vacía"
  );

  const informacion = document.createElement("div");
  informacion.className = "task-info";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "text-link task-open";

  boton.setAttribute(
    "aria-label",
    `Ver tarea ${indice + 1}: ${tarea.titulo}`
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
    abrirDetalle(tarea);
  });

  informacion.append(
    crearTexto("p", "eyebrow cyan", "Ejemplo de estructura"),
    crearTexto("h3", "", tarea.titulo),
    crearTexto("p", "muted", tarea.resumen),
    boton
  );

  tarjeta.append(vista, informacion);
  lista.append(tarjeta);
});

/* Proyecto final */

$("#project-title").textContent = proyecto.titulo;
$("#project-summary").textContent = proyecto.resumen;

pintarVista(
  $("#project-preview"),
  proyecto.imagen,
  proyecto.titulo,
  "Vista previa vacía"
);

$("#open-project").addEventListener("click", () => {
  abrirDetalle(proyecto, true);
});

/* Cerrar detalle */

$("#close-detail").addEventListener("click", () => {
  modal.close();
});

/* Escape cierra el diálogo mediante su comportamiento nativo. */

modal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");

  if (ultimoBoton && ultimoBoton.isConnected) {
    ultimoBoton.focus({
      preventScroll: true
    });
  }
});

/* Cerrar al pulsar fuera de la ventana */

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

/* Desplazamiento de tarjetas */

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
