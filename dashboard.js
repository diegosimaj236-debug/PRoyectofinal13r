/*=========================================================
    SecureWeb Manager
    dashboard.js
=========================================================*/

"use strict";

function inicializarDashboard() {

    const totalUsuarios = $("#totalUsuarios");
    const totalCookies = $("#totalCookies");
    const totalHistorial = $("#totalHistorial");
    const totalSesiones = $("#totalSesiones");
    const totalEncriptados = $("#totalEncriptados");

    const tablaUsuarios = $("#tablaUsuarios");
    const buscarDashboard = $("#buscarDashboard");
    const btnExportarTabla = $("#btnExportarTabla");

    if (!tablaUsuarios) return;

    /*==================================
        CONTADORES (con guarda contra null)
    ==================================*/

    function actualizarContadores() {

        const usuarios = obtenerUsuarios();

        if (totalUsuarios) totalUsuarios.textContent = usuarios.length;

        if (totalCookies) {

            totalCookies.textContent = document.cookie === ""
                ? 0
                : document.cookie.split(";").length;

        }

        const historial = leerLocal("historialEncriptacion") || [];

        if (totalHistorial) totalHistorial.textContent = historial.length;
        if (totalSesiones) totalSesiones.textContent = sessionStorage.length;
        if (totalEncriptados) totalEncriptados.textContent = historial.length;

    }

    /*==================================
        TABLA
    ==================================*/

    function cargarTablaUsuarios() {

        const usuarios = obtenerUsuarios();

        tablaUsuarios.innerHTML = "";

        if (usuarios.length === 0) {

            tablaUsuarios.innerHTML = `
                <tr>
                    <td colspan="7">No existen usuarios.</td>
                </tr>
            `;
            return;

        }

        usuarios.forEach(usuario => {

            tablaUsuarios.innerHTML += `
                <tr>
                    <td>${usuario.id || ""}</td>
                    <td>${usuario.nombre || ""}</td>
                    <td>${usuario.usuario || ""}</td>
                    <td>${usuario.correo || ""}</td>
                    <td>${usuario.edad || ""}</td>
                    <td>${usuario.visitas || 0}</td>
                    <td>${usuario.ultimoAcceso || ""}</td>
                </tr>
            `;

        });

    }

    /*==================================
        BUSCADOR
    ==================================*/

    if (buscarDashboard) {

        buscarDashboard.addEventListener("keyup", function () {

            const texto = this.value.toLowerCase();
            const filas = tablaUsuarios.querySelectorAll("tr");

            filas.forEach(fila => {

                fila.style.display = fila.textContent.toLowerCase().includes(texto)
                    ? ""
                    : "none";

            });

        });

    }

    /*==================================
        EXPORTAR TABLA
    ==================================*/

    if (btnExportarTabla) {

        btnExportarTabla.addEventListener("click", function () {

            exportarJSON(
                "usuarios_dashboard.json",
                obtenerUsuarios()
            );

            if (typeof registrarAccion === "function") {
                registrarAccion("Exportó dashboard");
            }

        });

    }

    /*==================================
        ACTUALIZACIÓN AUTOMÁTICA
    ==================================*/

    setInterval(actualizarContadores, 1000);

    // Sólo ejecutar si la sección dashboard existe en el DOM
    const dashSection = $("#dashboard");
    if (dashSection) {

        setInterval(actualizarDashboard, 5000);
        actualizarDashboard();

    }

    function actualizarDashboard() {

        actualizarContadores();
        cargarTablaUsuarios();

    }

    window.actualizarDashboard = actualizarDashboard;
    window.cargarTablaUsuarios = cargarTablaUsuarios;

}

window.inicializarDashboard = inicializarDashboard;

