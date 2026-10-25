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
    codigo: `function setup() {
  createCanvas(300, 300);
}
function draw() {
  background(18, 20, 21);
  stroke(232, 141, 57);
  noFill();
  ellipse(width/2, height/2, 120 + sin(frameCount*0.05)*30);
}`
  },
  {
    titulo: "Tramas en extension radial",
    descripcion: "",
    imagen: "./assets/encargo2.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_2_IE_-_Valentina_C%C3%B3rdova_Rosas",
    codigo: `function setup() {
  createCanvas(300, 300);
}
function draw() {
  background(18, 20, 21);
  stroke(95, 168, 184);
  for(let i=0; i<12; i++){
    let a = (i/12)*TWO_PI + frameCount*0.02;
    line(width/2, height/2, width/2 + cos(a)*100, height/2 + sin(a)*100);
  }
}`
  },
  {
    titulo: "Movimiento concéntrico de romboide en transformación",
    descripcion: "",
    imagen: "./assets/encargo3.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_3_IE_-_Valentina_C%C3%B3rdova",
    codigo: `function setup() {
  createCanvas(300, 300);
}
function draw() {
  background(18, 20, 21);
  translate(width/2, height/2);
  rotate(frameCount*0.02);
  stroke(216, 195, 157);
  noFill();
  quad(0, -60, 80, 0, 0, 60, -80, 0);
}`
  },
  {
    titulo: "Floración radial en eco de luz",
    descripcion: "",
    imagen: "./assets/encargo4.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_4_IE_-_Valentina_C%C3%B3rdova",
    codigo: `function setup() {
  createCanvas(300, 300);
}
function draw() {
  background(18, 20, 21);
  stroke(232, 141, 57, 180);
  noFill();
  for(let r=10; r<120; r+=20){
    ellipse(width/2, height/2, r + sin(frameCount*0.03)*15);
  }
}`
  },
  {
    titulo: "Explosión estelar",
    descripcion: "",
    imagen: "./assets/encargo5.png",
    wiki: "https://wiki.ead.pucv.cl/Encargo_5_IE_-_Valentina_C%C3%B3rdova",
    codigo: `function setup() {
  createCanvas(300, 300);
}
function draw() {
  background(18, 20, 21);
  stroke(200, 90, 66);
  for(let i=0; i<20; i++){
    let a = random(TWO_PI);
    let r = random(20, 110);
    point(width/2 + cos(a)*r, height/2 + sin(a)*r);
  }
}`
  }
];

const proyecto = {
  titulo: "Desplazamiento del eco lumínico en gradiente lineal",
  descripcion: "",
  imagen: "./assets/proyectofinal.png",
  wiki: "https://wiki.ead.pucv.cl/Desplazamiento_del_eco_lum%C3%ADnico_en_gradiente_lineal_-_Entrega_U1_IE",
  codigo: `function setup() {
  createCanvas(300, 300);
}
function draw() {
  background(18, 20, 21);
  translate(width/2, height/2);
  stroke(232, 141, 57);
  for(let i=0; i<8; i++){
    rotate(PI/4 + frameCount*0.01);
    line(0, 0, 90, 0);
  }
}`
};

/* =====================================================
   ELEMENTOS GENERALES
   ===================================================== */

const $ = (selector) => document.querySelector(selector);

const lista = $("#task-list");
const modal = $("#detail");
const botonAnterior = $("#previous");
const botonSiguiente = $("#next");

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

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

function pintarVista(contenedor, imagen, titulo, cargaInmediata = false) {
  contenedor.replaceChildren();

  function mostrarError() {
    contenedor.replaceChildren(
      crearTexto("p", "image-fallback", "Vista previa no disponible")
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
   SANDBOX P5.JS EN MODAL
   ===================================================== */

let p5Instancia = null;

function destruirInstanciaP5() {
  if (p5Instancia) {
    p5Instancia.remove();
    p5Instancia = null;
  }
  const contenedorCanvas = $("#p5-sandbox-canvas");
  if (contenedorCanvas) contenedorCanvas.replaceChildren();
}

function ejecutarCodigoP5(codigoUsuario) {
  destruirInstanciaP5();

  const contenedorCanvas = $("#p5-sandbox-canvas");
  if (!contenedorCanvas) return;

  try {
    const scriptSketch = new Function("p", `with(p) { ${codigoUsuario} }`);

    p5Instancia = new p5((p) => {
      try {
        scriptSketch(p);
      } catch (err) {
        console.warn("Error p5:", err);
      }
    }, contenedorCanvas);
  } catch (err) {
    console.error("Error de código p5.js:", err);
  }
}

const tabBtnPreview = $("#tab-btn-preview");
const tabBtnCode = $("#tab-btn-code");
const tabPreview = $("#modal-tab-preview");
const tabCode = $("#modal-tab-code");
const btnEjecutar = $("#run-p5-code");
const txtCodigoInput = $("#p5-code-input");

function cambiarPestaña(mostrarCodigo) {
  if (!tabBtnPreview || !tabBtnCode) return;

  tabBtnPreview.classList.toggle("active", !mostrarCodigo);
  tabBtnPreview.setAttribute("aria-selected", !mostrarCodigo);
  tabPreview.hidden = mostrarCodigo;

  tabBtnCode.classList.toggle("active", mostrarCodigo);
  tabBtnCode.setAttribute("aria-selected", mostrarCodigo);
  tabCode.hidden = !mostrarCodigo;

  if (mostrarCodigo && txtCodigoInput) {
    ejecutarCodigoP5(txtCodigoInput.value);
  } else {
    destruirInstanciaP5();
  }
}

if (tabBtnPreview && tabBtnCode) {
  tabBtnPreview.addEventListener("click", () => cambiarPestaña(false));
  tabBtnCode.addEventListener("click", () => cambiarPestaña(true));
}

if (btnEjecutar && txtCodigoInput) {
  btnEjecutar.addEventListener("click", () => {
    ejecutarCodigoP5(txtCodigoInput.value);
  });
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

  pintarVista($("#detail-preview"), elemento.imagen, elemento.titulo, true);

  if (txtCodigoInput) {
    txtCodigoInput.value = elemento.codigo || "// Código p5.js no disponible.";
  }

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

$("#close-detail").addEventListener("click", () => modal.close());

modal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  destruirInstanciaP5();
  if (ultimoBoton && ultimoBoton.isConnected) {
    ultimoBoton.focus({ preventScroll: true });
  }
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
pintarVista($("#project-preview"), proyecto.imagen, proyecto.titulo);

$("#open-project").addEventListener("click", () => {
  abrirDetalle(proyecto, "Proyecto final · Entrega U1", true);
});

/* =====================================================
   DESPLAZAMIENTO HORIZONTAL Y FILTROS
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

function iniciarFiltroTareas() {
  const buscador = $("#task-search");
  const botonesFiltro = document.querySelectorAll(".tag-btn");
  const tarjetas = document.querySelectorAll(".task-card");

  if (!buscador || !tarjetas.length) return;

  let filtroActivo = "todos";
  let textoBusqueda = "";

  function aplicarFiltros() {
    tarjetas.forEach((tarjeta, indice) => {
      const tituloTexto = tarjeta.querySelector("h3")?.textContent.toLowerCase() || "";
      const numeroEncargo = (indice + 1).toString();

      const coincideFiltro = filtroActivo === "todos" || filtroActivo === numeroEncargo;
      const coincideTexto = tituloTexto.includes(textoBusqueda);

      tarjeta.classList.toggle("is-hidden", !(coincideFiltro && coincideTexto));
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
   CANVAS GENERATIVO LUMÍNICO Y EFECTOS
   ===================================================== */

function iniciarMovimientoPortada() {
  const hero = $(".hero");
  const canvas = $("#hero-canvas");
  if (!hero || !canvas) return;

  const ctx = canvas.getContext("2d");
  let animId = null;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let ancho = (canvas.width = hero.clientWidth);
  let alto = (canvas.height = hero.clientHeight);

  function redimensionar() {
    ancho = canvas.width = hero.clientWidth;
    alto = canvas.height = hero.clientHeight;
    mouse.targetX = ancho * 0.65;
    mouse.targetY = alto * 0.5;
  }

  window.addEventListener("resize", redimensionar);
  redimensionar();

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
  });

  let t = 0;

  function renderizar() {
    ctx.fillStyle = "rgba(18, 20, 21, 0.22)";
    ctx.fillRect(0, 0, ancho, alto);

    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    t += 0.008;

    const centroX = ancho * 0.62;
    const centroY = alto * 0.5;
    const lineas = 36;
    const radioBase = Math.min(ancho, alto) * 0.28;

    for (let i = 0; i < lineas; i++) {
      const angulo = (i / lineas) * Math.PI * 2 + Math.sin(t * 0.5 + i * 0.1) * 0.2;
      const x1 = centroX + Math.cos(angulo) * (radioBase * 0.2);
      const y1 = centroY + Math.sin(angulo) * (radioBase * 0.2);

      const x2 = centroX + Math.cos(angulo) * radioBase + (mouse.x - centroX) * 0.15;
      const y2 = centroY + Math.sin(angulo) * radioBase + (mouse.y - centroY) * 0.15;

      const gradiente = ctx.createLinearGradient(x1, y1, x2, y2);
      gradiente.addColorStop(0, i % 2 === 0 ? "rgba(232, 141, 57, 0.6)" : "rgba(95, 168, 184, 0.5)");
      gradiente.addColorStop(1, "transparent");

      ctx.strokeStyle = gradiente;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    if (!reducirMovimiento.matches && !document.hidden) {
      animId = requestAnimationFrame(renderizar);
    }
  }

  function actualizar() {
    if (reducirMovimiento.matches || document.hidden) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else if (!animId) {
      renderizar();
    }
  }

  actualizar();
}

iniciarMovimientoPortada();

/* =====================================================
   CURSOR Y TRAGALUZ EN SCROLL
   ===================================================== */

function iniciarCursorPersonalizado() {
  const cursor = $("#custom-cursor");
  if (!cursor || reducirMovimiento.matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let mouseX = -100, mouseY = -100, cursorX = -100, cursorY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add("is-active");
  });

  function animarCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animarCursor);
  }

  animarCursor();

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, input, .task-card, .project-card")) {
      cursor.classList.add("is-hovering");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("a, button, input, .task-card, .project-card")) {
      cursor.classList.remove("is-hovering");
    }
  });
}

function iniciarEfectoTragaluz() {
  const tragaluz = $("#skylight-beam");
  if (!tragaluz || reducirMovimiento.matches) return;

  let mouseX = window.innerWidth * 0.7;
  let targetX = mouseX, targetY = 0, actualY = 0;

  window.addEventListener("mousemove", (e) => { targetX = e.clientX; });

  function animarLuz() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const porcentajeScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    targetY = (window.innerHeight * 0.2) + (porcentajeScroll * window.innerHeight * 0.6);
    mouseX += (targetX - mouseX) * 0.05;
    actualY += (targetY - actualY) * 0.05;

    tragaluz.style.setProperty("--beam-x", `${(mouseX / window.innerWidth) * 100}%`);
    tragaluz.style.setProperty("--beam-y", `${(actualY / window.innerHeight) * 100}%`);

    requestAnimationFrame(animarLuz);
  }

  animarLuz();
}

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

  elementos.forEach((el) => {
    el.classList.add("is-pending");
    observador.observe(el);
  });
}

iniciarCursorPersonalizado();
iniciarEfectoTragaluz();
iniciarApariciones();
