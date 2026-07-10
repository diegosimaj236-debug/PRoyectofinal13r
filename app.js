/*=========================================================
    SecureWeb Manager
    app.js
    Control principal del sistema
=========================================================*/

"use strict";

const APP_CONFIG = {

    nombre: "SecureWeb Manager",

    version: "1.0.0",

    autor: "Sistema Web Administrativo",

    fechaInicio: obtenerFechaHora()

};

/*==================================
    NAVEGACIÓN ENTRE SECCIONES
==================================*/

function mostrarSeccion(id) {

    const secciones = document.querySelectorAll(".modulo");

    secciones.forEach(seccion => {
        seccion.style.display = "none";
    });

    const actual = document.getElementById(id);

    if (actual) {

        actual.style.display = "block";

        // Marcar el botón activo del menú
        const botones = document.querySelectorAll("[data-section]");
        botones.forEach(b => b.classList.remove("active"));

        const botonActivo = document.querySelector(`[data-section="${id}"]`);
        if (botonActivo) botonActivo.classList.add("active");

    }

    if (typeof registrarAccion === "function") {
        registrarAccion("Ingresó a sección: " + id);
    }

}

/*==================================
    MENÚ
==================================*/

function configurarMenu() {

    const botones = document.querySelectorAll("[data-section]");

    botones.forEach(boton => {

        boton.addEventListener("click", function (e) {

            e.preventDefault();

            mostrarSeccion(this.dataset.section);

        });

    });

}

/*==================================
    TEMA DEL SISTEMA
==================================*/

function cargarPreferencias() {

    const preferencias = leerLocal("preferencias");

    if (!preferencias) {

        guardarLocal("preferencias", { tema: "claro" });
        return;

    }

    aplicarTema(preferencias.tema);

}

function aplicarTema(tema) {

    document.body.dataset.tema = tema;

}

function cambiarTema() {

    const actual = leerLocal("preferencias") || { tema: "claro" };

    const nuevo = actual.tema === "claro" ? "oscuro" : "claro";

    guardarLocal("preferencias", { tema: nuevo });
    aplicarTema(nuevo);

    if (typeof registrarAccion === "function") {
        registrarAccion("Cambió el tema a " + nuevo);
    }

}

/*==================================
    INFORMACIÓN DEL SISTEMA
==================================*/

function informacionSistema() {

    return {

        aplicacion: APP_CONFIG.nombre,
        version: APP_CONFIG.version,
        fecha: obtenerFechaHora(),
        usuarios: obtenerUsuarios().length,
        cookies: typeof informacionCookies === "function"
            ? informacionCookies()
            : "(no disponible)",
        almacenamiento: typeof informacionStorage === "function"
            ? informacionStorage()
            : "(no disponible)"

    };

}

/*==================================
    MOSTRAR INFORMACIÓN
==================================*/

function mostrarInformacionSistema() {

    const elemento = $("#infoSistema");

    if (!elemento) return;

    elemento.innerHTML = `
        <h3>${APP_CONFIG.nombre}</h3>
        <p>Versión: ${APP_CONFIG.version}</p>
        <p>Usuarios registrados: ${obtenerUsuarios().length}</p>
        <p>Fecha: ${obtenerFechaHora()}</p>
    `;

}

/*==================================
    SEGURIDAD BÁSICA
==================================*/

function protegerSistema() {

    document.addEventListener("contextmenu", function (e) {

        if (e.target.tagName === "IMG") {
            e.preventDefault();
        }

    });

}

/*==================================
    VALIDAR SESIÓN AL CARGAR
==================================*/

function comprobarSesion() {

    const usuario = typeof usuarioActivo === "function"
        ? usuarioActivo()
        : null;

    document.querySelectorAll(".privado").forEach(elemento => {

        elemento.style.display = usuario ? "block" : "none";

    });

}

/*==================================
    RELOJ DEL SISTEMA
==================================*/

function iniciarReloj() {

    const reloj = $("#reloj");

    if (!reloj) return;

    setInterval(() => {

        reloj.textContent = new Date().toLocaleString("es-GT");

    }, 1000);

}

/*==================================
    CERRAR SISTEMA
==================================*/

function salirSistema() {

    if (confirm("¿Desea cerrar sesión?")) {

        if (typeof cerrarSesion === "function") {
            cerrarSesion();
        }

        mostrarSeccion("login");

    }

}

/*==================================
    ARRANQUE PRINCIPAL
==================================*/

function cargarSistema() {

    cargarPreferencias();
    configurarMenu();
    comprobarSesion();
    mostrarInformacionSistema();
    iniciarReloj();
    protegerSistema();

    // Mostrar la sección "registro" por defecto
    mostrarSeccion("registro");

}

/*==================================
    INICIALIZACIÓN DE SUBSISTEMAS
==================================*/

function inicializarTodo() {

    // Dependencias primero (orden importa)
    if (typeof inicializarValidaciones === "function") {
        inicializarValidaciones();
    }

    if (typeof inicializarAutenticacion === "function") {
        inicializarAutenticacion();
    }

    if (typeof inicializarSeguridad === "function") {
        inicializarSeguridad();
    }

    if (typeof inicializarRegex === "function") {
        inicializarRegex();
    }

    if (typeof inicializarCookies === "function") {
        inicializarCookies();
    }

    if (typeof inicializarStorage === "function") {
        inicializarStorage();
    }

    if (typeof inicializarDashboard === "function") {
        inicializarDashboard();
    }

    // Ahora sí, configurar todo el sistema
    cargarSistema();

}

/*==================================
    EVENTOS GLOBALES
==================================*/

document.addEventListener("DOMContentLoaded", inicializarTodo);

/*==================================
    EXPORTACIONES GLOBALES
==================================*/

window.SecureWebManager = {

    version: APP_CONFIG.version,
    informacion: informacionSistema,
    tema: cambiarTema,
    cerrar: salirSistema,
    mostrarSeccion: mostrarSeccion

};

