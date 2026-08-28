var docente = {
  nombre: "Ronald Martelo",
  nombreCompleto: "Ronald Martelo Ching",
  correo: "rmarteloc@miusbctg.edu.co",
  facultad: "Facultad De Ingeniería",
  iniciales: "RM"
};

var asignaturas = [
  { codigo: "7065-3C", nombre: "Proyecto Integrador Web Multimedia", sala: "Sala De Sistemas VII", creditos: 3, color: 1 },
  { codigo: "7084-2C", nombre: "Introducción A La Ingeniería", sala: "Sala De Sistemas VI", creditos: 2, color: 2 },
  { codigo: "7087-3C", nombre: "Profesional Complementaria II", sala: "Sala De Sistemas III", creditos: 3, color: 3 },
  { codigo: "8770-3C", nombre: "Programación Orientada A Objetos", sala: "Sala De Sistemas IV", creditos: 2, color: 4 }
];

var horario = [
  { dia: 1, horaInicio: 7, horaFin: 9, codigo: "7065-3C", sala: "Sala De Sistemas VII" },
  { dia: 4, horaInicio: 8, horaFin: 9, codigo: "7065-3C", sala: "Sala De Sistemas VII" },
  { dia: 2, horaInicio: 7, horaFin: 9, codigo: "7084-2C", sala: "Sala De Sistemas VI" },
  { dia: 3, horaInicio: 9, horaFin: 11, codigo: "7084-2C", sala: "Sala De Sistemas VI" },
  { dia: 3, horaInicio: 7, horaFin: 9, codigo: "7087-3C", sala: "Sala De Sistemas III" },
  { dia: 5, horaInicio: 11, horaFin: 13, codigo: "8770-3C", sala: "Sala De Sistemas IV" }
];

var nombresDias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
var nombresDiasCortos = ["", "LUN", "MAR", "MIE", "JUE", "VIE"];
var horasHorario = [7, 8, 9, 10, 11, 12, 13];

function buscarAsignatura(codigo) {
  for (var i = 0; i < asignaturas.length; i++) {
    if (asignaturas[i].codigo === codigo) {
      return asignaturas[i];
    }
  }
  return null;
}

function contarClasesPorCodigo(codigo) {
  var total = 0;
  for (var i = 0; i < horario.length; i++) {
    if (horario[i].codigo === codigo) total++;
  }
  return total;
}

function formatearHora(hora) {
  var periodo = hora < 12 ? "AM" : "PM";
  var hora12 = hora % 12;
  if (hora12 === 0) hora12 = 12;
  return hora12 + ":00" + periodo;
}
