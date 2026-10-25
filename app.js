"use strict";

/* =====================================================
   CONTENIDO EDITABLE

   Imágenes: "./assets/imagen1.png"
   Enlaces: direcciones completas con https://
   Deja "" cuando todavía no tengas un dato.
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
   FUNCIONAMIENTO GENERAL
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
    elemento.removeAttribute("rel");
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

/* Enlaces y contacto */

for (const clave of ["asignatura", "wiki"]) {
  document.querySelectorAll(`[data-link="${clave}"]`).forEach((enlace) => {
    configurarEnlace(enlace, sitio[clave]);

    if (clave === "wiki" && urlWeb(sitio[clave])) {
      enlace.textContent = sitio[clave];
    }
  });

  document.querySelectorAll(`[data-url="${clave}"]`).forEach((texto) => {
    if (urlWeb(sitio[clave])) {
      texto.textContent = sitio[clave];
    }
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

/* Ventana de detalle */

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
  $("#close-detail").focus({ preventScroll: true });
}

/* Crear las cinco tarjetas */

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
  boton.setAttribute(
    "aria-label",
    `Ver tarea ${indice + 1}: ${tarea.titulo}`
  );
  boton.setAttribute("aria-haspopup", "dialog");
  boton.setAttribute("aria-controls", "detail");

  const flecha = crearTexto("span", "", "→");
  flecha.setAttribute("aria-hidden", "true");

  boton.append(crearTexto("span", "", "Ver tarea"), flecha);
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

/* Proyecto */

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

/* Cerrar el detalle: botón, Escape o clic fuera */

$("#close-detail").addEventListener("click", () => modal.close());

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

/* Carrusel */

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
   TU ANIMACIÓN P5.JS

   Se mantiene el movimiento de tu sketch.
   El lienzo se adapta al ancho y alto de la portada.
   Se utiliza modo instancia para evitar conflictos.
   ===================================================== */

function iniciarAnimacion() {
  const contenedor = $("#sketch-container");
  const boton = $("#toggle-animation");
  const fallback = $("#sketch-fallback");

  if (typeof window.p5 !== "function") {
    fallback.textContent =
      "No se pudo cargar la animación. Puedes verla en el enlace a p5.js.";
    return;
  }

  new window.p5((p) => {
    const num = 700;
    const particulas = [];

    let pausada = reducirMovimiento.matches;
    let observadorTamano;

    function actualizarEstado() {
      const detener = pausada || document.hidden;

      if (detener) {
        p.noLoop();
      } else {
        p.loop();
      }

      boton.textContent = pausada
        ? "Reproducir animación"
        : "Pausar animación";
    }

    function ajustarLienzo() {
      const nuevoAncho = Math.max(1, Math.round(contenedor.clientWidth));
      const nuevoAlto = Math.max(1, Math.round(contenedor.clientHeight));

      if (nuevoAncho === p.width && nuevoAlto === p.height) {
        return;
      }

      const anchoAnterior = Math.max(1, p.width);
      const altoAnterior = Math.max(1, p.height);

      for (const particula of particulas) {
        particula.x *= nuevoAncho / anchoAnterior;
        particula.y *= nuevoAlto / altoAnterior;
      }

      p.resizeCanvas(nuevoAncho, nuevoAlto);

      if (!p.isLooping()) {
        p.redraw();
      }
    }

    p.setup = function () {
      const ancho = Math.max(1, Math.round(contenedor.clientWidth));
      const alto = Math.max(1, Math.round(contenedor.clientHeight));

      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));

      const lienzo = p.createCanvas(ancho, alto);
      lienzo.parent(contenedor);
      lienzo.elt.setAttribute("aria-hidden", "true");

      p.noStroke();

      for (let i = 0; i < num; i++) {
        particulas.push({
          x: p.random(p.width),
          y: p.random(p.height),
          speed: p.random(0.5, 1.5),
          size: p.random(0.8, 2)
        });
      }

      fallback.hidden = true;
      boton.hidden = false;

      boton.addEventListener("click", () => {
        pausada = !pausada;
        actualizarEstado();
      });

      document.addEventListener("visibilitychange", actualizarEstado);

      reducirMovimiento.addEventListener("change", (evento) => {
        pausada = evento.matches;
        actualizarEstado();
      });

      if ("ResizeObserver" in window) {
        observadorTamano = new ResizeObserver(ajustarLienzo);
        observadorTamano.observe(contenedor);
      }

      actualizarEstado();
    };

    p.draw = function () {
      p.background(0);
      p.fill(255, 180);

      const mover = !pausada && !document.hidden;

      for (const particula of particulas) {
        if (mover) {
          // Movimiento principal hacia la derecha.
          particula.x += particula.speed;

          // Pequeña variación vertical de tu sketch.
          particula.y +=
            p.sin(particula.x * 0.01 + p.frameCount * 0.02) * 0.4;

          // Al salir por la derecha, reaparece por la izquierda.
          if (particula.x > p.width) {
            particula.x = 0;
            particula.y = p.random(p.height);
          }
        }

        p.ellipse(particula.x, particula.y, particula.size);
      }
    };

    p.windowResized = ajustarLienzo;
  }, contenedor);
}

iniciarAnimacion();
