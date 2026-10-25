"use strict";

/* =====================================================
   CONTENIDO
   ===================================================== */

const tareas = [
  {
    titulo: "The Dark Side Of The Moon",
    descripcion: "",
    imagen: "./assets/encargo1.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_1_IE_-_The_Dark_Side_Of_The_Moon_-_Valentina_C%C3%B3rdova"
  },
  {
    titulo: "Tramas en extension radial",
    descripcion: "",
    imagen: "./assets/encargo2.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_2_IE_-_Valentina_C%C3%B3rdova_Rosas"
  },
  {
    titulo: "Movimiento concéntrico de romboide en transformación",
    descripcion: "",
    imagen: "./assets/encargo3.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_3_IE_-_Valentina_C%C3%B3rdova"
  },
  {
    titulo: "Floración radial en eco de luz",
    descripcion: "",
    imagen: "./assets/encargo4.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_4_IE_-_Valentina_C%C3%B3rdova"
  },
  {
    titulo: "Explosión estelar",
    descripcion: "",
    imagen: "./assets/encargo5.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_5_IE_-_Valentina_C%C3%B3rdova"
  }
];

const proyecto = {
  titulo: "Desplazamiento del eco lumínico en gradiente lineal",
  descripcion: "",
  imagen: "./assets/proyectofinal.png",
  wiki: "https://wiki.ead.pucv.cl/Desplazamiento_del_eco_lum%C3%ADnico_en_gradiente_lineal_-_Entrega_U1_IE"
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

/* Crear texto sin interpretar HTML */

function crearTexto(etiqueta, clase, contenido) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = contenido;
  return elemento;
}

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

  img.addEventListener("error", mostrarError, {
    once: true
  });

  img.src = url.href;
  contenedor.append(img);
}

/* =====================================================
   DETALLE DE TAREA O PROYECTO
   ===================================================== */

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
    elemento.titulo,
    true
  );

  const descripcion = (elemento.descripcion || "").trim();

  $("#detail-description").textContent = descripcion;
  $("#detail-description-block").hidden = !descripcion;

  const enlace = $("#detail-wiki");
  const url = urlWeb(elemento.wiki);

  enlace.hidden = !url;

  if (url) {
    enlace.href = url;
  } else {
    enlace.removeAttribute("href");
  }

  modal.showModal();
  modal.scrollTop = 0;

  document.body.classList.add("modal-open");

  $("#close-detail").focus({
    preventScroll: true
  });
}

/* Cerrar con el botón */

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

/* Cerrar al pulsar fuera del cuadro */

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

/* =====================================================
   CREAR LAS CINCO TARJETAS
   ===================================================== */

lista.replaceChildren();

tareas.forEach((tarea, indice) => {
  const tarjeta = document.createElement("article");
  tarjeta.className = "task-card reveal";

  tarjeta.style.setProperty(
    "--reveal-delay",
    `${Math.min(indice, 2) * 80}ms`
  );

  const vista = document.createElement("div");
  vista.className = "preview task-preview";

  pintarVista(vista, tarea.imagen, tarea.titulo);

  const informacion = document.createElement("div");
  informacion.className = "task-info";

  const etiqueta = crearTexto(
    "p",
    "eyebrow cyan",
    `Encargo ${indice + 1}`
  );

  const titulo = crearTexto("h3", "", tarea.titulo);

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
  abrirDetalle(
    proyecto,
    "Proyecto final · Entrega U1",
    true
  );
});

/* =====================================================
   DESPLAZAMIENTO HORIZONTAL DE TARJETAS
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
  const observadorLista = new ResizeObserver(actualizarControles);
  observadorLista.observe(lista);
}

actualizarControles();

/* =====================================================
   APARICIONES SUAVES AL DESPLAZARSE
   ===================================================== */

function iniciarApariciones() {
  const elementos = document.querySelectorAll(".reveal");

  if (
    reducirMovimiento.matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        entrada.target.classList.remove("is-pending");
        entrada.target.classList.add("is-visible");

        observador.unobserve(entrada.target);
      });
    },
    {
      threshold: 0.08
    }
  );

  elementos.forEach((elemento) => {
    elemento.classList.add("is-pending");
    observador.observe(elemento);
  });

  reducirMovimiento.addEventListener("change", (evento) => {
    if (!evento.matches) return;

    observador.disconnect();

    elementos.forEach((elemento) => {
      elemento.classList.remove("is-pending");
      elemento.classList.add("is-visible");
    });
  });
}

iniciarApariciones();

/* =====================================================
   MOVIMIENTO SUAVE DE LA PORTADA
   ===================================================== */

function iniciarMovimientoPortada() {
  const portada = $(".hero");
  const boton = $("#toggle-hero-motion");

  if (!portada || !boton) return;

  let pausaManual = false;

  function actualizarMovimiento() {
    const detener =
      pausaManual ||
      reducirMovimiento.matches ||
      document.hidden;

    portada.classList.toggle(
      "is-motion-paused",
      detener
    );

    boton.hidden = reducirMovimiento.matches;

    boton.textContent = pausaManual
      ? "Reanudar movimiento"
      : "Pausar movimiento";
  }

  boton.addEventListener("click", () => {
    pausaManual = !pausaManual;
    actualizarMovimiento();
  });

  reducirMovimiento.addEventListener(
    "change",
    actualizarMovimiento
  );

  document.addEventListener(
    "visibilitychange",
    actualizarMovimiento
  );

  actualizarMovimiento();
}

iniciarMovimientoPortada();
