import crearTabla from "./tablaDinamica.js";
import Anuncio_Mascota from "./entidades/Anuncio_Mascota.js";
import { validarCampoVacio, validarPrecio, validarLongitudMaxima, validarChecked } from "./entidades/validaciones.js";
import Alerta from "./entidades/alertaCustomizada.js";

const listado = JSON.parse(localStorage.getItem("Elementos")) || [];
const $tableContainer = document.getElementById("listado");
const $form = document.forms[0];
const $spinner = document.getElementById("spinner");
const $anuncio = document.querySelector(".anuncio");
const { btn_editar, btn_eliminar, btn_cancelar } = $form;
const { titulo, transaccion, descripcion, precio, raza, fecha, vacunas } = $form;
const $accesorios = $form.querySelectorAll(".accesorios");


let anuncio = document.querySelector("#anunciosDinamicos");
let alerta = new Alerta("Alta", "Alta dada exitosamente");


let table;
let _id = -1;
if (listado.length > 0) {
    actualizarTabla(listado)
        .then(() => $spinner.style.display = "none");
}
else {
    $spinner.style.display = "none";
}

//Evento submit del formulario
$form.addEventListener("submit", e => {
    const form = e.target;
    e.preventDefault();
    //Alta
    if (btn_editar.classList.contains("alta")) {

        if (validarEntrada(form)) {
            listado.push(new Anuncio_Mascota(Date.now(), titulo.value,
                transaccion.value, descripcion.value, precio.value,
                raza.value, fecha.value, vacunas.value, obtenerListaAccesorios()));

            localStorage.setItem("Elementos", JSON.stringify(listado));
            alerta.editarAnuncio("Alta", "Alta dada exitosamente");
            actualizarTabla(listado)
                .then(() => $spinner.style.display = "none")
                .then(() => alerta.MostarAnuncio(anuncio));

            form.reset();
            $anuncio.classList.add("hidden");
        } else {
            $anuncio.classList.remove("hidden");
            $anuncio.innerHTML = "Datos incompletos!";
        }
    }
    //Modificacion
    else {
        if (btn_editar.classList.contains("editar")) {
            const objeto = listado[buscarPorId(listado, _id)];
            if (objeto) {
                objeto.titulo = titulo.value;
                objeto.transaccion = transaccion.value;
                objeto.descripcion = descripcion.value;
                objeto.precio = precio.value;
                objeto.raza = raza.value;
                objeto.fecha = fecha.value;
                objeto.vacuna = vacunas.value;
                objeto.accesorios = obtenerListaAccesorios();
                if (validarEntrada()) {
                    localStorage.setItem("Elementos", JSON.stringify(listado));
                    alerta.editarAnuncio("Modificacion", "Modificaco exitosamente");
                    actualizarTabla(listado)
                        .then(() => $spinner.style.display = "none")
                        .then(() => alerta.MostarAnuncio(anuncio))
                        .then(() => unsetId())
                        .then(() => $form.reset());
                }
            }
        }
    }
});

$form.addEventListener("reset", e => {
    for (const iterator of $form) {
        if (iterator.classList.contains("correcto"))
            iterator.classList.remove("correcto");
    }
});

//Envento cambio en el valor de los inputs
document.addEventListener("input", e => {
    const form = e.target;
    titulo.addEventListener("blur", validarLongitudMaxima);
    transaccion[0].addEventListener("blur", validarCampoVacio);
    transaccion[1].addEventListener("blur", validarCampoVacio);
    descripcion.addEventListener("blur", validarLongitudMaxima);
    precio.addEventListener("blur", validarPrecio);
    raza.addEventListener("blur", validarCampoVacio);
    fecha.addEventListener("blur", validarCampoVacio);
    vacunas.addEventListener("blur", validarCampoVacio);
    $accesorios.forEach(e => e.addEventListener("blur", validarChecked));

});

//Evento de click en la tabla
window.addEventListener("click", e => {

    if (e.target.matches("tr td")) {
        setId(e.target.parentElement.dataset.id);
        btn_editar.classList.replace("alta", "editar");
        document.querySelector(".editar div span").innerHTML = "Modificar";
        inicializarCampos();
    }
});

//Evento click del boton Eliminar
btn_eliminar.addEventListener("click", () => {
    listado.splice(buscarPorId(listado, _id), 1);
    localStorage.setItem("Elementos", JSON.stringify(listado));
    alerta.editarAnuncio("Baja", "Dado de Baja exitosamente");
    actualizarTabla(listado)
        .then(() => $spinner.style.display = "none")
        .then(() => alerta.MostarAnuncio(anuncio));
    unsetId();
});

//Evento click del boton
btn_cancelar.addEventListener("click", unsetId);

function actualizarTabla(vec) {
    return new Promise((res, rej) => {
        if ($tableContainer.contains(table)) {
            $tableContainer.removeChild(table);
            $spinner.style.display = "inherit";
        }
        setTimeout(() => {

            table = crearTabla(vec);
            $tableContainer.appendChild(table);
            res();
        }, 1000);
    });
}

function setId(id) {
    _id = id;
    if (_id > 0) {
        btn_editar.classList.replace("alta", "editar",);
        btn_cancelar.classList.remove("hidden");
        btn_eliminar.classList.remove("hidden");
    }
}

function unsetId() {
    _id = -1;
    btn_editar.classList.replace("editar", "alta");
    btn_cancelar.classList.add("hidden");
    btn_eliminar.classList.add("hidden");
    document.querySelector(".alta div span").innerHTML = "Guardar";
}

function buscarPorId(lista, id) {
    if (lista) {
        return lista.findIndex(el => el.id == id);
    }
}

function inicializarCampos() {
    const elemento = listado[buscarPorId(listado, _id)];
    titulo.value = elemento.titulo;
    titulo.setAttribute("class", "correcto");
    elemento.transaccion == "perro" ? transaccion[0].checked = true : transaccion[1].checked = true;
    transaccion[0].setAttribute("class", "correcto");
    descripcion.value = elemento.descripcion;
    descripcion.setAttribute("class", "correcto");
    precio.value = elemento.precio;
    precio.setAttribute("class", "correcto");
    raza.value = elemento.raza;
    raza.setAttribute("class", "correcto");
    fecha.value = elemento.fecha;
    fecha.setAttribute("class", "correcto");
    vacunas.value = elemento.vacuna;
    vacunas.setAttribute("class", "correcto");
    if (elemento.accesorios.length > 0) {
        for (const iterator of $accesorios) {
            if (elemento.accesorios.includes(iterator.value)) {
                iterator.checked = true;
            }
        }
    }
    $form.querySelector("#field_accesorios").classList.add("correcto");
}

//Verifica que las clases tengan la clase correcto
function validarEntrada() {

    if (
        titulo.matches(".correcto") &&
        (transaccion[0].matches(".correcto") || transaccion[1].matches(".correcto")) &&
        ($form.querySelector("#field_accesorios").matches(".correcto")) &&
        descripcion.matches(".correcto") &&
        precio.matches(".correcto") &&
        raza.matches(".correcto") &&
        fecha.matches(".correcto") &&
        vacunas.matches(".correcto")) {
        document.querySelector(".anuncio").classList.add("hidden");
            return true;
    } else {

        return false;
    }
}

function obtenerListaAccesorios() {
    let listaAcesorios = [];
    if ($accesorios.length > 0) {
        ($accesorios.forEach(element => {
            if (element.checked) {
                listaAcesorios.push(element.value);
            }
        }));
    }
    return listaAcesorios;

}