/*=========================================================
    SecureWeb Manager
    seguridad.js
    Encriptación
=========================================================*/

"use strict";

/*==================================
    TABLA DE ENCRIPTACIÓN
    (Mayúsculas y minúsculas con códigos distintos para no
     perder la capitalización al desencriptar)
==================================*/

const TABLA_ENCRIPTACION = {

    "A": "@1A",
    "E": "#2E",
    "I": "&3I",
    "O": "*4O",
    "U": "%5U",

    "a": "@1a",
    "e": "#2e",
    "i": "&3i",
    "o": "*4o",
    "u": "%5u"

};

/*==================================
    TABLA INVERSA (construida desde la principal)
==================================*/

const TABLA_DESENCRIPTACION = {};

Object.keys(TABLA_ENCRIPTACION).forEach(letra => {

    TABLA_DESENCRIPTACION[
        TABLA_ENCRIPTACION[letra]
    ] = letra;

});

/*==================================
    INICIALIZACIÓN DEL MÓDULO
==================================*/

function inicializarSeguridad() {

    const txtOriginal = $("#textoOriginal");
    const txtResultado = $("#textoResultado");
    const btnEncriptar = $("#btnEncriptar");
    const btnDesencriptar = $("#btnDesencriptar");
    const lblAntes = $("#caracteresAntes");
    const lblDespues = $("#caracteresDespues");
    const lblFecha = $("#fechaOperacion");

    if (!txtOriginal || !txtResultado) return;

    /*==================================
        CONTAR CARACTERES
    ==================================*/

    function contarCaracteres(texto) {
        return texto.length;
    }

    /*==================================
        ACTUALIZAR ESTADÍSTICAS
    ==================================*/

    function actualizarEstadisticas(original, resultado) {

        if (lblAntes) lblAntes.textContent = "Caracteres originales: " + contarCaracteres(original);
        if (lblDespues) lblDespues.textContent = "Caracteres finales: " + contarCaracteres(resultado);
        if (lblFecha) lblFecha.textContent = "Fecha: " + obtenerFechaHora();

    }

    /*==================================
        ENCRIPTAR
    ==================================*/

    function encriptarTexto(texto) {

        let salida = "";

        for (let letra of texto) {

            if (TABLA_ENCRIPTACION[letra]) {

                salida += TABLA_ENCRIPTACION[letra];

            } else {

                salida += letra;

            }

        }

        return salida;

    }

    /*==================================
        DESENCRIPTAR
    ==================================*/

    function desencriptarTexto(texto) {

        let resultado = texto;

        // Ordenar por longitud descendente para evitar
        // que códigos cortos se "coman" los largos
        const codigos = Object.keys(TABLA_DESENCRIPTACION)
            .sort((a, b) => b.length - a.length);

        codigos.forEach(codigo => {

            resultado = resultado.replace(
                new RegExp(
                    codigo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                    "g"
                ),
                TABLA_DESENCRIPTACION[codigo]
            );

        });

        return resultado;

    }

    /*==================================
        HISTORIAL
    ==================================*/

    function guardarHistorial(original, resultado, tipo) {

        let historial = leerLocal("historialEncriptacion") || [];

        historial.push({
            tipo,
            original,
            resultado,
            fecha: obtenerFechaHora()
        });

        guardarLocal("historialEncriptacion", historial);

    }

    /*==================================
        ENCRIPTAR BOTÓN
    ==================================*/

    function ejecutarEncriptacion() {

        const texto = txtOriginal.value;

        if (texto === "") {

            alert("Ingrese un texto.");
            return;

        }

        const resultado = encriptarTexto(texto);

        txtResultado.value = resultado;

        actualizarEstadisticas(texto, resultado);
        guardarHistorial(texto, resultado, "Encriptado");

        if (typeof registrarAccion === "function") {
            registrarAccion("Texto encriptado");
        }

        if (typeof actualizarDashboard === "function") {
            actualizarDashboard();
        }

    }

    /*==================================
        DESENCRIPTAR BOTÓN
    ==================================*/

    function ejecutarDesencriptacion() {

        const texto = txtOriginal.value;

        if (texto === "") {

            alert("Ingrese un texto.");
            return;

        }

        const resultado = desencriptarTexto(texto);

        txtResultado.value = resultado;

        actualizarEstadisticas(texto, resultado);
        guardarHistorial(texto, resultado, "Desencriptado");

        if (typeof registrarAccion === "function") {
            registrarAccion("Texto desencriptado");
        }

        if (typeof actualizarDashboard === "function") {
            actualizarDashboard();
        }

    }

    /*==================================
        LIMPIAR
    ==================================*/

    function limpiarEncriptador() {

        txtOriginal.value = "";
        txtResultado.value = "";

        if (lblAntes) lblAntes.textContent = "";
        if (lblDespues) lblDespues.textContent = "";
        if (lblFecha) lblFecha.textContent = "";

    }

    /*==================================
        EXPORTAR HISTORIAL
    ==================================*/

    function exportarHistorial() {

        exportarJSON(
            "historial_encriptacion.json",
            leerLocal("historialEncriptacion")
        );

    }

    /*==================================
        EVENTOS
    ==================================*/

    btnEncriptar.addEventListener("click", ejecutarEncriptacion);
    btnDesencriptar.addEventListener("click", ejecutarDesencriptacion);

    txtOriginal.addEventListener("keydown", function (e) {

        if (e.ctrlKey && e.key === "Enter") {
            ejecutarEncriptacion();
        }

    });

    limpiarEncriptador();

    // Exponer funciones globalmente
    window.ejecutarEncriptacion = ejecutarEncriptacion;
    window.ejecutarDesencriptacion = ejecutarDesencriptacion;
    window.limpiarEncriptador = limpiarEncriptador;
    window.exportarHistorial = exportarHistorial;

}

window.inicializarSeguridad = inicializarSeguridad;

