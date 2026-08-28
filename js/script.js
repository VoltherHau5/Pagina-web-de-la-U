/* =====================================================
   DATOS DE EJEMPLO
   (en un sistema real esto vendría de una base de datos)
===================================================== */
const DOCENTE = {
  nombre: "Ronald Martelo Ching",
  correo: "ronald.martelo@usbcartagena.edu.co",
  iniciales: "RM"
};

const ASIGNATURAS = [
  { codigo:"ING-204", nombre:"Programación Orientada a Objetos", creditos:3, salonPrincipal:"Lab. 302" },
  { codigo:"ING-315", nombre:"Bases de Datos II", creditos:4, salonPrincipal:"Aula 401" },
  { codigo:"MMD-210", nombre:"Diseño de Interfaces Multimedia", creditos:3, salonPrincipal:"Lab. Multimedia" },
  { codigo:"ING-401", nombre:"Ingeniería de Software", creditos:4, salonPrincipal:"Aula 205" },
  { codigo:"MMD-330", nombre:"Desarrollo de Videojuegos", creditos:3, salonPrincipal:"Lab. 302" },
];

// día (1=Lunes..5=Viernes), hora de inicio (formato 24h) y duración en horas
const HORARIO = [
  { dia:1, horaInicio:8,  duracion:2, codigo:"ING-204", salon:"Lab. 302" },
  { dia:1, horaInicio:14, duracion:2, codigo:"ING-401", salon:"Aula 205" },
  { dia:2, horaInicio:10, duracion:2, codigo:"MMD-210", salon:"Lab. Multimedia" },
  { dia:3, horaInicio:8,  duracion:3, codigo:"ING-315", salon:"Aula 401" },
  { dia:3, horaInicio:16, duracion:2, codigo:"MMD-330", salon:"Lab. 302" },
  { dia:4, horaInicio:10, duracion:2, codigo:"ING-204", salon:"Lab. 302" },
  { dia:4, horaInicio:14, duracion:2, codigo:"ING-401", salon:"Aula 205" },
  { dia:5, horaInicio:8,  duracion:2, codigo:"ING-315", salon:"Aula 401" },
];

const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const DIAS_CORTO = ["", "LUN", "MAR", "MIÉ", "JUE", "VIE"];
const HORAS_TABLA = [7,8,9,10,11,12,13,14,15,16,17,18]; // franja del horario

function asignaturaPorCodigo(codigo){
  return ASIGNATURAS.find(a => a.codigo === codigo);
}

function formatoHora(h){
  const periodo = h < 12 ? "a.m." : "p.m.";
  let h12 = h % 12; if(h12 === 0) h12 = 12;
  return `${h12}:00 ${periodo}`;
}

/* =====================================================
   LOGIN  (RF01)
   La sesión se guarda con window.storage para que, si
   recargas la página, sigas conectado (equivalente a
   usar localStorage, pero soportado en este entorno).
===================================================== */
const formLogin = document.getElementById("form-login");
const errorLogin = document.getElementById("error-login");
const CLAVE_SESION = "sesion-docente";

formLogin.addEventListener("submit", async function(e){
  e.preventDefault();
  const correo = document.getElementById("input-correo").value.trim().toLowerCase();
  const clave = document.getElementById("input-clave").value;

  // Validación simple de demo: cualquier contraseña sirve si el correo coincide
  if(correo === DOCENTE.correo && clave.length > 0){
    errorLogin.classList.add("oculto");
    await guardarSesion(correo);
    iniciarSesion();
  } else {
    errorLogin.classList.remove("oculto");
  }
});

async function guardarSesion(correo){
  try{
    await window.storage.set(CLAVE_SESION, JSON.stringify({ correo, fecha: Date.now() }));
  }catch(err){
    console.error("No se pudo guardar la sesión:", err);
  }
}

async function haySesionGuardada(){
  try{
    const resultado = await window.storage.get(CLAVE_SESION);
    return resultado && JSON.parse(resultado.value).correo === DOCENTE.correo;
  }catch(err){
    return false; // no existe la clave todavía, es normal la primera vez
  }
}

async function borrarSesion(){
  try{
    await window.storage.delete(CLAVE_SESION);
  }catch(err){
    console.error("No se pudo borrar la sesión:", err);
  }
}

function iniciarSesion(){
  document.getElementById("pantalla-login").classList.add("oculto");
  document.getElementById("app").classList.remove("oculto");
  pintarDatosDocente();
  pintarInicio();
  pintarAsignaturas();
  pintarHorario();
  pintarPerfil();
  mostrarVista("inicio");
}

// Al cargar la página, revisamos si ya había una sesión guardada
(async function comprobarSesionAlCargar(){
  const activa = await haySesionGuardada();
  if(activa) iniciarSesion();
})();

/* =====================================================
   CERRAR SESIÓN  (RF06)
===================================================== */
document.getElementById("btn-cerrar-sesion").addEventListener("click", async function(){
  await borrarSesion();
  document.getElementById("app").classList.add("oculto");
  document.getElementById("pantalla-login").classList.remove("oculto");
  document.getElementById("form-login").reset();
  cerrarMenu();
});

/* =====================================================
   DATOS DEL DOCENTE  (RF02)
===================================================== */
function pintarDatosDocente(){
  document.getElementById("topbar-nombre").innerHTML =
    `${DOCENTE.nombre}<small>${DOCENTE.correo}</small>`;
  document.getElementById("topbar-avatar").textContent = DOCENTE.iniciales;
  document.getElementById("menu-avatar").textContent = DOCENTE.iniciales;
  document.getElementById("menu-nombre").textContent = DOCENTE.nombre;
  document.getElementById("menu-correo").textContent = DOCENTE.correo;
  document.getElementById("saludo-inicio").textContent =
    `Hola, ${DOCENTE.nombre.split(" ")[0]}`;
}

/* =====================================================
   MENÚ HAMBURGUESA  (RF10)
===================================================== */
const btnHamburguesa = document.getElementById("btn-hamburguesa");
const menuLateral = document.getElementById("menu-lateral");
const menuOverlay = document.getElementById("menu-overlay");

function abrirMenu(){
  menuLateral.classList.add("visible");
  menuOverlay.classList.add("visible");
  btnHamburguesa.classList.add("activo");
}
function cerrarMenu(){
  menuLateral.classList.remove("visible");
  menuOverlay.classList.remove("visible");
  btnHamburguesa.classList.remove("activo");
}
btnHamburguesa.addEventListener("click", function(){
  menuLateral.classList.contains("visible") ? cerrarMenu() : abrirMenu();
});
menuOverlay.addEventListener("click", cerrarMenu);

/* =====================================================
   NAVEGACIÓN ENTRE VISTAS
===================================================== */
function mostrarVista(nombre){
  document.querySelectorAll(".vista").forEach(v => v.classList.add("oculto"));
  document.getElementById("vista-" + nombre).classList.remove("oculto");
  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.toggle("activo", item.dataset.vista === nombre);
  });
  window.scrollTo({top:0, behavior:"smooth"});
  cerrarMenu();
}

document.querySelectorAll("[data-vista]").forEach(el => {
  el.addEventListener("click", () => mostrarVista(el.dataset.vista));
});

/* =====================================================
   VISTA: INICIO  (resumen + próximas clases, RF04/RF11)
===================================================== */
function pintarInicio(){
  document.getElementById("num-asignaturas").textContent = ASIGNATURAS.length;
  document.getElementById("num-clases-semana").textContent = HORARIO.length;
  const salones = new Set(HORARIO.map(h => h.salon));
  document.getElementById("num-salones").textContent = salones.size;

  const contenedor = document.getElementById("lista-proximas-clases");
  contenedor.innerHTML = "";

  // ordenar por día y hora, mostrar las primeras 4
  const ordenadas = [...HORARIO].sort((a,b) => a.dia - b.dia || a.horaInicio - b.horaInicio).slice(0,4);

  ordenadas.forEach(clase => {
    const asig = asignaturaPorCodigo(clase.codigo);
    const fila = document.createElement("div");
    fila.className = "fila-proxima-clase";
    fila.innerHTML = `
      <div class="fila-proxima-clase__dia">
        <span>${DIAS_CORTO[clase.dia]}</span>
        <span>${formatoHora(clase.horaInicio).replace(" ","").replace(":00","")}</span>
      </div>
      <div class="fila-proxima-clase__info">
        <h4>${asig.nombre}</h4>
        <p>${DIAS[clase.dia]} · ${formatoHora(clase.horaInicio)} · ${clase.salon}</p>
      </div>
    `;
    fila.addEventListener("click", () => abrirModalAsignatura(asig.codigo));
    contenedor.appendChild(fila);
  });
}

/* =====================================================
   VISTA: ASIGNATURAS  (RF03 / RF13 buscar)
===================================================== */
function pintarAsignaturas(filtro = ""){
  const grid = document.getElementById("grid-asignaturas");
  const sinResultados = document.getElementById("sin-resultados");
  grid.innerHTML = "";

  const texto = filtro.trim().toLowerCase();
  const filtradas = ASIGNATURAS.filter(a =>
    a.nombre.toLowerCase().includes(texto) || a.codigo.toLowerCase().includes(texto)
  );

  sinResultados.classList.toggle("oculto", filtradas.length > 0);

  filtradas.forEach(asig => {
    const clasesDeEsta = HORARIO.filter(h => h.codigo === asig.codigo);
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-asignatura";
    tarjeta.innerHTML = `
      <span class="tarjeta-asignatura__codigo">${asig.codigo}</span>
      <h4>${asig.nombre}</h4>
      <div class="tarjeta-asignatura__meta">
        <span>📍 ${asig.salonPrincipal}</span>
        <span>🗓️ ${clasesDeEsta.length} clase(s) por semana</span>
        <span>🎓 ${asig.creditos} créditos</span>
      </div>
    `;
    tarjeta.addEventListener("click", () => abrirModalAsignatura(asig.codigo));
    grid.appendChild(tarjeta);
  });
}

document.getElementById("input-buscar-asignatura").addEventListener("input", function(e){
  pintarAsignaturas(e.target.value);
});

/* =====================================================
   MODAL DETALLE ASIGNATURA  (RF05 / RF12)
===================================================== */
const modalOverlay = document.getElementById("modal-overlay");

function abrirModalAsignatura(codigo){
  const asig = asignaturaPorCodigo(codigo);
  const clases = HORARIO.filter(h => h.codigo === codigo)
    .sort((a,b) => a.dia - b.dia);

  document.getElementById("modal-codigo").textContent = "CÓDIGO " + asig.codigo;
  document.getElementById("modal-nombre").textContent = asig.nombre;

  const cuerpo = document.getElementById("modal-cuerpo");
  let filas = `
    <div class="modal__fila">
      <span class="icono">🎓</span>
      <div><label>Créditos</label><span>${asig.creditos}</span></div>
    </div>
  `;
  clases.forEach(c => {
    filas += `
      <div class="modal__fila">
        <span class="icono">🗓️</span>
        <div><label>${DIAS[c.dia]}</label><span>${formatoHora(c.horaInicio)} · ${c.salon}</span></div>
      </div>
    `;
  });
  cuerpo.innerHTML = filas;

  modalOverlay.classList.add("visible");
}

document.getElementById("btn-cerrar-modal").addEventListener("click", () => modalOverlay.classList.remove("visible"));
modalOverlay.addEventListener("click", (e) => { if(e.target === modalOverlay) modalOverlay.classList.remove("visible"); });

/* =====================================================
   VISTA: HORARIO SEMANAL  (RF04 / RF11 / RF12)
===================================================== */
function pintarHorario(){
  const tabla = document.getElementById("tabla-horario");
  let html = "<thead><tr><th>Hora</th>";
  for(let d=1; d<=5; d++) html += `<th>${DIAS[d]}</th>`;
  html += "</tr></thead><tbody>";

  HORAS_TABLA.forEach(hora => {
    html += `<tr><td class="col-hora">${formatoHora(hora)}</td>`;
    for(let d=1; d<=5; d++){
      const clase = HORARIO.find(h => h.dia === d && h.horaInicio === hora);
      if(clase){
        const asig = asignaturaPorCodigo(clase.codigo);
        html += `<td>
          <div class="bloque-clase" data-codigo="${clase.codigo}">
            <h5>${asig.codigo}</h5>
            <p>${clase.salon}</p>
          </div>
        </td>`;
      } else {
        html += "<td></td>";
      }
    }
    html += "</tr>";
  });

  html += "</tbody>";
  tabla.innerHTML = html;

  tabla.querySelectorAll(".bloque-clase").forEach(bloque => {
    bloque.addEventListener("click", () => abrirModalAsignatura(bloque.dataset.codigo));
  });
}

/* =====================================================
   VISTA: PERFIL  (RF02)
===================================================== */
function pintarPerfil(){
  document.getElementById("perfil-avatar").textContent = DOCENTE.iniciales;
  document.getElementById("perfil-nombre").textContent = DOCENTE.nombre;
  document.getElementById("perfil-nombre-dato").textContent = DOCENTE.nombre;
  document.getElementById("perfil-correo-dato").textContent = DOCENTE.correo;
  document.getElementById("perfil-num-asignaturas").textContent = ASIGNATURAS.length;
}
