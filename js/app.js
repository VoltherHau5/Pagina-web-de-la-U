var loginForm = document.getElementById("login-form");
var loginError = document.getElementById("login-error");
var claveSesion = "sesion-docente";

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var email = document.getElementById("email").value.trim().toLowerCase();
  var password = document.getElementById("password").value;

  if (email.length > 0 && password.length > 0) {
    loginError.classList.add("hidden");
    guardarSesion(email);
    mostrarApp();
  } else {
    loginError.classList.remove("hidden");
  }
});

function guardarSesion(email) {
  try {
    localStorage.setItem(claveSesion, JSON.stringify({ correo: email }));
  } catch (err) {
    console.error("No se pudo guardar la sesión", err);
  }
}

function borrarSesion() {
  try {
    localStorage.removeItem(claveSesion);
  } catch (err) {
    console.error("No se pudo borrar la sesión", err);
  }
}

function revisarSesionGuardada() {
  try {
    var guardado = localStorage.getItem(claveSesion);
    if (guardado) {
      var datos = JSON.parse(guardado);
      if (datos.correo) {
        mostrarApp();
      }
    }
  } catch (err) {}
}

revisarSesionGuardada();

function mostrarApp() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  cargarDatosDocente();
  cargarInicio();
  cargarAsignaturas();
  cargarHorario();
  cargarPerfil();
  irAPagina("inicio");
}

document.getElementById("logout-btn").addEventListener("click", function () {
  borrarSesion();
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  loginForm.reset();
  cerrarMenu();
});

function cargarDatosDocente() {
  document.getElementById("user-name").textContent = docente.nombre;
  document.getElementById("user-avatar").textContent = docente.iniciales;
  document.getElementById("sidebar-avatar").textContent = docente.iniciales;
  document.getElementById("sidebar-name").textContent = docente.nombre;
  document.getElementById("sidebar-email").textContent = docente.correo;
}

var menuBtn = document.getElementById("menu-btn");
var sidebar = document.getElementById("sidebar");
var sidebarOverlay = document.getElementById("sidebar-overlay");

function abrirMenu() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("visible");
  menuBtn.classList.add("open");
}

function cerrarMenu() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("visible");
  menuBtn.classList.remove("open");
}

menuBtn.addEventListener("click", function () {
  if (sidebar.classList.contains("open")) {
    cerrarMenu();
  } else {
    abrirMenu();
  }
});

sidebarOverlay.addEventListener("click", cerrarMenu);

var links = document.querySelectorAll("[data-page]");
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function () {
    irAPagina(this.getAttribute("data-page"));
  });
}

function irAPagina(nombre) {
  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.add("hidden");
  }
  document.getElementById("page-" + nombre).classList.remove("hidden");

  var menuLinks = document.querySelectorAll(".menu-link");
  for (var i = 0; i < menuLinks.length; i++) {
    if (menuLinks[i].getAttribute("data-page") === nombre) {
      menuLinks[i].classList.add("active");
    } else {
      menuLinks[i].classList.remove("active");
    }
  }

  window.scrollTo(0, 0);
  cerrarMenu();
}

function cargarInicio() {
  document.getElementById("stat-asignaturas").textContent = asignaturas.length;
  document.getElementById("stat-clases").textContent = horario.length;

  var lista = document.getElementById("proximas-clases");
  lista.innerHTML = "";

  var ordenadas = horario.slice().sort(function (a, b) {
    if (a.dia !== b.dia) return a.dia - b.dia;
    return a.horaInicio - b.horaInicio;
  });

  var vistos = [];
  var proximas = [];
  for (var i = 0; i < ordenadas.length; i++) {
    if (vistos.indexOf(ordenadas[i].codigo) === -1) {
      vistos.push(ordenadas[i].codigo);
      proximas.push(ordenadas[i]);
    }
    if (proximas.length === 3) break;
  }

  for (var i = 0; i < proximas.length; i++) {
    var clase = proximas[i];
    var asignatura = buscarAsignatura(clase.codigo);

    var item = document.createElement("div");
    item.className = "class-item";
    item.setAttribute("data-codigo", asignatura.codigo);
    item.innerHTML =
      '<div class="class-day">' + nombresDiasCortos[clase.dia] + '</div>' +
      '<div class="class-info">' +
        '<h4>' + asignatura.nombre + '</h4>' +
        '<p>' + nombresDias[clase.dia] + ' - ' + formatearHora(clase.horaInicio) + ' - ' + formatearHora(clase.horaFin) + ' ' + clase.sala + '</p>' +
      '</div>';

    item.addEventListener("click", function () {
      abrirModal(this.getAttribute("data-codigo"));
    });
    lista.appendChild(item);
  }
}

function cargarAsignaturas(filtro) {
  filtro = filtro || "";
  var grid = document.getElementById("subjects-grid");
  var noResults = document.getElementById("no-results");
  grid.innerHTML = "";

  var texto = filtro.trim().toLowerCase();
  var filtradas = [];

  for (var i = 0; i < asignaturas.length; i++) 
    {
    var a = asignaturas[i];
    if (a.nombre.toLowerCase().indexOf(texto) !== -1 || a.codigo.toLowerCase().indexOf(texto) !== -1) {
      filtradas.push(a);
    }
  }

  if (filtradas.length === 0)
     {
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
  }

  for (var i = 0; i < filtradas.length; i++) 
    {
    var asignatura = filtradas[i];
    var numClases = contarClasesPorCodigo(asignatura.codigo);

    var card = document.createElement("div");
    card.className = "subject-card";
    card.setAttribute("data-codigo", asignatura.codigo);
    card.innerHTML =
      '<span class="subject-code">' + asignatura.codigo + '</span>' +
      '<h4>' + asignatura.nombre + '</h4>' +
      '<div class="subject-meta">' +
        '<span>' + asignatura.sala + '</span>' +
        '<span>' + numClases + ' Clases Por Semana</span>' +
        '<span>Creditos: ' + asignatura.creditos + '</span>' +
      '</div>';


    card.addEventListener("click", function () 
    {
      abrirModal(this.getAttribute("data-codigo"));
    });
    grid.appendChild(card);
  }
}

document.getElementById("search-input").addEventListener("input", function (event) {
  cargarAsignaturas(event.target.value);
});

var modalOverlay = document.getElementById("modal-overlay");

function abrirModal(codigo) {
  var asignatura = buscarAsignatura(codigo);
  var clasesDeEsta = horario.filter(function (h) 
  {
    return h.codigo === codigo;
  }).sort(function (a, b) {
    return a.dia - b.dia;
  });

  document.getElementById("modal-title").textContent = asignatura.nombre;
  document.getElementById("modal-creditos").textContent = "Creditos: " + asignatura.creditos;

  var body = document.getElementById("modal-body");
  var html = "";

  for (var i = 0; i < clasesDeEsta.length; i++) 
    {
    var c = clasesDeEsta[i];
    html += '<div class="modal-row">' +
      nombresDias[c.dia] + ' ' + formatearHora(c.horaInicio) + ' - ' + formatearHora(c.horaFin) +
    '</div>' +
    '<div class="modal-divider"></div>';
  }

  body.innerHTML = html;
  modalOverlay.classList.add("visible");
}

document.getElementById("modal-close").addEventListener("click", function () {
  modalOverlay.classList.remove("visible");
});

modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove("visible");
  }
});

function cargarHorario()
 {
  var tabla = document.getElementById("schedule-table");

  var html = "<thead><tr><th class='pill-hora'>HORA</th>";
  for (var dia = 1; dia <= 5; dia++) {
    var claseHeader = (dia % 2 === 1) ? "pill-naranja" : "pill-blanca";
    html += "<th class='" + claseHeader + "'>" + nombresDias[dia].toUpperCase() + "</th>";
  }
  html += "</tr></thead><tbody>";

  for (var h = 0; h < horasHorario.length; h++) {
    var hora = horasHorario[h];
    html += "<tr><td class='hour-col'>" + formatearHora(hora) + "</td>";

    for (var dia = 1; dia <= 5; dia++) {
      var entrada = null;
      for (var i = 0; i < horario.length; i++)
         {
        var e = horario[i];
        if (e.dia === dia && hora >= e.horaInicio && hora < e.horaFin) {
          entrada = e;
          break;
        }
      }

      if (entrada) 
        {
        var asignatura = buscarAsignatura(entrada.codigo);
        html += "<td><div class='schedule-block badge-" + asignatura.color + "' data-codigo='" + entrada.codigo + "'>" +
          "<strong>" + asignatura.codigo + "</strong>" +
          "<span>" + entrada.sala + "</span>" +
        "</div></td>";
      } else
         {

        html += "<td></td>";
      }

    }

    html += "</tr>";
  }

  html += "</tbody>";
  tabla.innerHTML = html;


  var bloques = tabla.querySelectorAll(".schedule-block");
  for (var i = 0; i < bloques.length; i++) {
    bloques[i].addEventListener("click", function () {
      abrirModal(this.getAttribute("data-codigo"));
    });
  }
}





function cargarPerfil() {
  document.getElementById("profile-avatar").textContent = docente.iniciales;
  document.getElementById("profile-name").textContent = docente.nombreCompleto;
  document.getElementById("profile-facultad").textContent = docente.facultad;
  document.getElementById("profile-name-value").textContent = docente.nombreCompleto;
  document.getElementById("profile-email-value").textContent = docente.correo;
  document.getElementById("profile-facultad-value").textContent = docente.facultad;
  document.getElementById("profile-subjects-value").textContent = asignaturas.length;
}
