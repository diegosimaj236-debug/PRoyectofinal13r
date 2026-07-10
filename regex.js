/*=========================================================
    SecureWeb Manager
    regex.js
=========================================================*/

"use strict";

function inicializarRegex() {

    const txtRegex = $("#regexInput");
    const txtTexto = $("#regexTexto");
    const btnRegex = $("#btnRegex");
    const btnReplace = $("#btnReplace");
    const resultadoRegex = $("#resultadoRegex");

    if (!txtRegex || !txtTexto) return;

    /*==================================
        LIMPIAR RESULTADO
    ==================================*/

    function limpiarResultadoRegex() {

        if (resultadoRegex) resultadoRegex.innerHTML = "";

    }

    /*==================================
        CREAR REGEXP
    ==================================*/

    function obtenerExpresion() {

        try {

            return new RegExp(txtRegex.value, "g");

        } catch (error) {

            mostrarMensaje(
                resultadoRegex,
                "Expresión regular inválida.",
                "error"
            );
            return null;

        }

    }

    /*==================================
        TEST() (con lastIndex reseteado)
    ==================================*/

    function ejecutarTest(expresion, texto) {

        expresion.lastIndex = 0;
        return expresion.test(texto);

    }

    /*==================================
        EXEC() (clon para evitar loops)
    ==================================*/

    function ejecutarExec(expresion, texto) {

        const resultados = [];

        // Clonamos el patrón para no alterar el original
        const clon = new RegExp(expresion.source, expresion.flags);
        let coincidencia;

        while ((coincidencia = clon.exec(texto)) !== null) {

            resultados.push({
                texto: coincidencia[0],
                indice: coincidencia.index
            });

            // Evitar loop infinito en matches de longitud 0
            if (coincidencia.index === clon.lastIndex) {
                clon.lastIndex++;
            }

        }

        return resultados;

    }

    /*==================================
        REPLACE()
    ==================================*/

    function ejecutarReplace(expresion, texto) {

        return texto.replace(
            expresion,
            "<span class='match'>$&</span>"
        );

    }

    /*==================================
        BUSCAR COINCIDENCIAS
    ==================================*/

    function buscarCoincidencias() {

        limpiarResultadoRegex();

        const patron = obtenerExpresion();
        if (!patron) return;

        const texto = txtTexto.value;

        if (texto === "") {

            mostrarMensaje(resultadoRegex, "Ingrese un texto.", "error");
            return;

        }

        const existe = ejecutarTest(
            new RegExp(patron.source, patron.flags.replace("g", "")),
            texto
        );

        if (!existe) {

            mostrarMensaje(resultadoRegex, "No se encontraron coincidencias.", "error");
            return;

        }

        const coincidencias = ejecutarExec(patron, texto);

        let html = "<h3>Coincidencias encontradas</h3><hr>";

        coincidencias.forEach((item, i) => {

            html += `
                <p>
                    <strong>#${i + 1}</strong>
                    "${item.texto}"
                    Posición: ${item.indice}
                </p>
            `;

        });

        resultadoRegex.innerHTML = html;

        registrarRegex(coincidencias.length);

    }

    /*==================================
        RESALTAR COINCIDENCIAS
    ==================================*/

    function reemplazarCoincidencias() {

        limpiarResultadoRegex();

        const patron = obtenerExpresion();
        if (!patron) return;

        const texto = txtTexto.value;

        resultadoRegex.innerHTML = ejecutarReplace(patron, texto);

    }

    /*==================================
        HISTORIAL
    ==================================*/

    function registrarRegex(total) {

        let historial = leerLocal("historialRegex") || [];

        historial.push({
            fecha: obtenerFechaHora(),
            patron: txtRegex.value,
            coincidencias: total
        });

        guardarLocal("historialRegex", historial);

    }

    /*==================================
        LIMPIAR CAMPOS
    ==================================*/

    function limpiarRegex() {

        txtRegex.value = "";
        txtTexto.value = "";
        limpiarResultadoRegex();

    }

    /*==================================
        EVENTOS
    ==================================*/

    btnRegex.addEventListener("click", buscarCoincidencias);
    btnReplace.addEventListener("click", reemplazarCoincidencias);

    txtRegex.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            e.preventDefault();
            buscarCoincidencias();
        }

    });

    limpiarResultadoRegex();

    window.buscarCoincidencias = buscarCoincidencias;
    window.limpiarRegex = limpiarRegex;

}

window.inicializarRegex = inicializarRegex;

