"use strict";

/* =====================================================
   CONTENIDO EDITABLE
   Las imágenes pueden ser rutas como "img/tarea-1.jpg".
   Los enlaces externos deben comenzar con https://.
   ===================================================== */

const sitio = {
  nombre: "[Nombre]",
  rol: "[Rol]",
  correo: "",
  portada: "",        // Enlace a tu sketch inicial.
  asignatura: "",     // Página de la asignatura.
  wiki: ""            // Tu página personal en la wiki.
};

const tareas = [
  {
    titulo: "[Título de la tarea]",
    resumen: "[Descripción breve de la tarea.]",
    descripcion:
      "[Descripción breve de la tarea: intención, exploración y relación con la imagen escrita.]",
    imagen: "",
    p5: "",
    wiki: ""
  },
  {
    titulo: "[Título de la tarea]",
    resumen: "[Descripción breve de la tarea.]",
    descripcion:
      "[Descripción breve de la tarea: intención, exploración y relación con la imagen escrita.]",
    imagen: "",
    p5: "",
    wiki: ""
  },
  {
    titulo: "[Título de la tarea]",
    resumen: "[Descripción breve de la tarea.]",
    descripcion:
      "[Descripción breve de la tarea: intención, exploración y relación con la imagen escrita.]",
    imagen: "",
    p5: "",
    wiki: ""
  }
];

const proyecto = {
  titulo: "[Título del proyecto]",
  resumen: "[Descripción breve del proyecto final.]",
  descripcion: "[Descripción del proyecto final, su proceso y resultados.]",
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
const reducirMovimiento =
  window.matchMedia("(prefers-reduced-motion: reduce)");

function urlWeb(valor) {
  if (!valor) return "";

  try {
    const url = new URL(valor);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
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
    elemento.setAttribute("aria-disabled", "true");
    elemento.title = "Enlace pendiente de completar";
  }
}

function crearTexto(etiqueta, clase, contenido) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = contenido;
  return elemento;
}

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

  // Permite imágenes locales o servidas por HTTP/HTTPS.
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
  img.addEventListener("error", mostrarMarcador, { once: true });
  contenedor.append(img);
}

for (const clave of ["portada", "asignatura", "wiki"]) {
  document.querySelectorAll(`[data-link="${clave}"]`).forEach((enlace) => {
    configurarEnlace(enlace, sitio[clave]);
  });

  document.querySelectorAll(`[data-url="${clave}"]`).forEach((texto) => {
    if (urlWeb(sitio[clave])) texto.textContent = sitio[clave];
  });
}

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

function abrirDetalle(elemento, esProyecto = false) {
  $("#detail-label").textContent = esProyecto
    ? "Proyecto / Ejemplo de estructura"
    : "Tarea / Ejemplo de estructura";

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

  const nota = $(".preview-caption span:last-child");
  nota.hidden = Boolean(elemento.imagen);

  configurarEnlace($("#detail-p5"), elemento.p5);
  configurarEnlace($("#detail-p5-text"), elemento.p5);
  configurarEnlace($("#detail-wiki"), elemento.wiki);
  configurarEnlace($("#detail-wiki-text"), elemento.wiki);

  $("#detail-p5-text").textContent = urlWeb(elemento.p5) || "[URL de p5.js]";
  $("#detail-wiki-text").textContent = urlWeb(elemento.wiki) || "[URL de wiki]";

  modal.showModal();
  modal.scrollTop = 0;
  document.body.classList.add("modal-open");
  $("#close-detail").focus();
}

tareas.forEach((tarea, indice) => {
  const tarjeta = document.createElement("article");
  tarjeta.className = "task-card";

  const vista = document.createElement("div");
  vista.className = "preview task-preview";

  pintarVista(vista, tarea.imagen, tarea.titulo, "Vista previa vacía");

  const informacion = document.createElement("div");
  informacion.className = "task-info";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "text-link task-open";
  boton.setAttribute("aria-label", `Ver tarea ${indice + 1}: ${tarea.titulo}`);
  boton.append(
    crearTexto("span", "", "Ver tarea"),
    crearTexto("span", "", "→")
  );
  boton.lastElementChild.setAttribute("aria-hidden", "true");
  boton.addEventListener("click", () => abrirDetalle(tarea));

  informacion.append(
    crearTexto("p", "eyebrow cyan", "Ejemplo de estructura"),
    crearTexto("h3", "", tarea.titulo),
    crearTexto("p", "muted", tarea.resumen),
    boton
  );

  tarjeta.append(vista, informacion);
  lista.append(tarjeta);
});

$("#project-title").textContent = proyecto.titulo;
$("#project-summary").textContent = proyecto.resumen;
pintarVista(
  $("#project-preview"),
  proyecto.imagen,
  proyecto.titulo,
  "Vista previa vacía"
);
$("#open-project").addEventListener("click", () => abrirDetalle(proyecto, true));

$("#close-detail").addEventListener("click", () => modal.close());

// También se puede cerrar con Escape, por el comportamiento de <dialog>.
modal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});

// Cerrar al pulsar fuera de la ventana.
modal.addEventListener("click", (evento) => {
  const limites = modal.getBoundingClientRect();
  const fuera =
    evento.clientX < limites.left ||
    evento.clientX > limites.right ||
    evento.clientY < limites.top ||
    evento.clientY > limites.bottom;

  if (evento.target === modal && fuera) modal.close();
});

function desplazarTareas(direccion) {
  const tarjeta = lista.querySelector(".task-card");
  if (!tarjeta) return;

  lista.scrollBy({
    left: direccion * (tarjeta.getBoundingClientRect().width + 20),
    behavior: reducirMovimiento.matches ? "instant" : "smooth"
  });
}

function actualizarControles() {
  $("#previous").disabled = lista.scrollLeft <= 1;
  $("#next").disabled =
    lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - 1;
}

$("#previous").addEventListener("click", () => desplazarTareas(-1));
$("#next").addEventListener("click", () => desplazarTareas(1));
lista.addEventListener("scroll", actualizarControles, { passive: true });
window.addEventListener("resize", actualizarControles);
actualizarControles();
