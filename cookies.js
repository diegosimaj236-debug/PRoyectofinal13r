/*=========================================================
    SecureWeb Manager
    cookies.js
    Administración de cookies
=========================================================*/

"use strict";

const COOKIE_DIAS = 7;

function inicializarCookies() {

    const info = $("#cookiesInfo");

    if (!info) return;

    const btnMostrar = $("#btnMostrarCookies");
    const btnEditar = $("#btnEditarCookie");
    const btnEliminar = $("#btnEliminarCookie");
    const btnTodas = $("#btnEliminarTodas");

    /*==================================
        CREAR COOKIE
    ==================================*/

    function crearCookie(nombre, valor, dias = COOKIE_DIAS) {

        const fecha = new Date();
        fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);

        document.cookie =
            encodeURIComponent(nombre) + "=" + encodeURIComponent(valor) +
            ";expires=" + fecha.toUTCString() +
            ";path=/";

    }

    /*==================================
        LEER COOKIE
    ==================================*/

    function leerCookie(nombre) {

        const nombreEQ = encodeURIComponent(nombre) + "=";
        const ca = document.cookie.split(";");

        for (let c of ca) {

            c = c.trim();

            if (c.indexOf(nombreEQ) === 0) {
                return decodeURIComponent(c.substring(nombreEQ.length));
            }

        }

        return null;

    }

    /*==================================
        ELIMINAR COOKIE
    ==================================*/

    function eliminarCookie(nombre) {

        document.cookie =
            encodeURIComponent(nombre) + "=;" +
            "expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

    }

    /*==================================
        ELIMINAR TODAS
    ==================================*/

    function eliminarTodasCookies() {

        const cookies = document.cookie.split(";");

        for (let c of cookies) {

            const nombre = c.split("=")[0].trim();
            eliminarCookie(nombre);

        }

        mostrarCookies();

    }

    /*==================================
        EDITAR COOKIE
    ==================================*/

    function editarCookieExistente(nombre) {

        const nuevo = prompt("Nuevo valor para " + nombre);
        if (nuevo === null) return;

        crearCookie(nombre, nuevo);
        mostrarCookies();

    }

    /*==================================
        MOSTRAR COOKIES
    ==================================*/

    function mostrarCookies() {

        if (document.cookie === "") {

            info.innerHTML = "<p>No hay cookies guardadas.</p>";
            return;

        }

        const cookies = document.cookie.split(";");

        let html = "<table class='tabla-cookies'>";
        html += "<thead><tr><th>Nombre</th><th>Valor</th><th>Acción</th></tr></thead><tbody>";

        cookies.forEach(c => {

            const [n, v] = c.split("=");
            const nombre = decodeURIComponent((n || "").trim());
            const valor = decodeURIComponent((v || "").trim());

            html += `
                <tr>
                    <td>${nombre}</td>
                    <td>${valor}</td>
                    <td><button class="btn-editar-cookie" data-nombre="${nombre}">Editar</button></td>
                </tr>
            `;

        });

        html += "</tbody></table>";

        info.innerHTML = html;

        // Bind de botones "Editar" por fila
        info.querySelectorAll(".btn-editar-cookie").forEach(boton => {

            boton.addEventListener("click", function () {

                editarCookieExistente(this.dataset.nombre);

            });

        });

    }

    /*==================================
        CREAR COOKIES DE LOGIN
        (Llamada desde autenticacion.js)
    ==================================*/

    function crearCookiesLogin(usuario) {

        crearCookie("usuarioLogin", usuario.usuario, 1);
        crearCookie("nombreLogin", usuario.nombre, 1);

    }

    /*==================================
        INFORMACIÓN COOKIES (para app.js)
    ==================================*/

    function informacionCookies() {

        const cookies = document.cookie === ""
            ? 0
            : document.cookie.split(";").length;

        return {
            total: cookies,
            detalle: document.cookie || "(sin cookies)"
        };

    }

    /*==================================
        EVENTOS
    ==================================*/

    btnMostrar.addEventListener("click", mostrarCookies);

    btnEditar.addEventListener("click", function () {

        const nombre = prompt("Nombre de la cookie a editar");

        if (!nombre) return;

        if (leerCookie(nombre) === null) {

            alert("No existe esa cookie.");
            return;

        }

        const nuevo = prompt("Nuevo valor");
        if (nuevo === null) return;

        crearCookie(nombre, nuevo);
        mostrarCookies();

    });

    btnEliminar.addEventListener("click", function () {

        const nombre = prompt("Nombre de la cookie a eliminar");

        if (!nombre) return;

        eliminarCookie(nombre);
        mostrarCookies();

    });

    btnTodas.addEventListener("click", function () {

        if (confirm("¿Eliminar TODAS las cookies?")) {

            eliminarTodasCookies();

        }

    });

    // Globals para los otros módulos
    window.crearCookiesLogin = crearCookiesLogin;
    window.informacionCookies = informacionCookies;
    window.mostrarCookies = mostrarCookies;
    window.crearCookie = crearCookie;
    window.leerCookie = leerCookie;

    mostrarCookies();

}

window.inicializarCookies = inicializarCookies;

