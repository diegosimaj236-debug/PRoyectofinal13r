/*=========================================================
    SecureWeb Manager
    utilidades.js
    Funciones globales reutilizables
=========================================================*/

"use strict";

/*=============================
    SELECTORES
=============================*/

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

/*=============================
    ID ÚNICO
=============================*/

function generarID() {

    return "USR-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).substring(2, 8).toUpperCase();

}

/*=============================
    FECHA ACTUAL
=============================*/

function obtenerFechaHora() {

    const fecha = new Date();

    return fecha.toLocaleString("es-GT", {

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

}

/*=============================
    MENSAJES
=============================*/

function mostrarMensaje(elemento, mensaje, tipo = "ok") {

    if (!elemento) return;

    elemento.textContent = mensaje;

    elemento.style.padding = "12px";

    elemento.style.marginTop = "15px";

    elemento.style.borderRadius = "10px";

    elemento.style.fontWeight = "bold";

    if (tipo === "ok") {

        elemento.style.background = "#dcfce7";
        elemento.style.color = "#166534";

    } else {

        elemento.style.background = "#fee2e2";
        elemento.style.color = "#991b1b";

    }

}

/*=============================
    LIMPIAR MENSAJE
=============================*/

function limpiarMensaje(elemento) {

    if (!elemento) return;

    elemento.textContent = "";

    elemento.removeAttribute("style");

}

/*=============================
    STORAGE
=============================*/

function guardarLocal(clave, valor) {

    localStorage.setItem(

        clave,
        JSON.stringify(valor)
    );

}

function leerLocal(clave) {

    const datos = localStorage.getItem(clave);

    return datos ? JSON.parse(datos) : null;

}

function eliminarLocal(clave) {

    localStorage.removeItem(clave);

}

/*=============================
    SESSION
=============================*/

function guardarSession(clave, valor) {

    sessionStorage.setItem(

        clave,
        JSON.stringify(valor)
    );

}

function leerSession(clave) {

    const datos = sessionStorage.getItem(clave);

    return datos ? JSON.parse(datos) : null;

}

function eliminarSession(clave) {

    sessionStorage.removeItem(clave);

}

/*=============================
    USUARIOS
=============================*/

function obtenerUsuarios() {

    return leerLocal("usuarios") || [];

}

function guardarUsuarios(lista) {

    guardarLocal("usuarios", lista);

}

/*=============================
    BUSCAR USUARIO
=============================*/

function buscarUsuario(usuario) {

    return obtenerUsuarios().find(

        u => u.usuario === usuario
    );

}

/*=============================
    EXPORTAR JSON
=============================*/

function exportarJSON(nombre, datos) {

    const blob = new Blob(

        [
            JSON.stringify(
                datos,
                null,
                4
            )
        ],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");

    enlace.href = url;

    enlace.download = nombre;

    enlace.click();

    URL.revokeObjectURL(url);

}

/*=============================
    CALCULAR EDAD
=============================*/

function calcularEdad(fechaNacimiento) {

    const hoy = new Date();

    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (
        mes < 0 ||
        (mes === 0 &&
        hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    return edad;

}

/*=============================
    CAPITALIZAR
=============================*/

function capitalizar(texto) {

    return texto

        .toLowerCase()
        .replace(/\b\w/g, letra => letra.toUpperCase());

}

/*=============================
    FORMATEAR NOMBRE
=============================*/

function limpiarNombre(nombre) {

    return capitalizar(

        nombre.trim()
    );

}

/*=============================
    HASH SIMPLE
    (Se mejorará en seguridad.js)
=============================*/

function hashSimple(texto) {

    let hash = 0;

    for (let i = 0; i < texto.length; i++) {

        hash =
            ((hash << 5) - hash)
            + texto.charCodeAt(i);
        hash |= 0;

    }

    return Math.abs(hash).toString(16);

}

/*=============================
    INICIALIZACIÓN
=============================*/

if (!leerLocal("usuarios")) {

    guardarLocal("usuarios", []);

}

if (!leerLocal("historialEncriptacion")) {

    guardarLocal(
        "historialEncriptacion",
        []
    );

}

if (!leerLocal("preferencias")) {

    guardarLocal("preferencias", {
        tema: "claro"
    });

}

