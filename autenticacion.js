/*=========================================================
    SecureWeb Manager
    autenticacion.js
=========================================================*/

"use strict";

/*==================================
    ELEMENTOS LOGIN
==================================*/

function inicializarAutenticacion() {

    const loginForm = $("#loginForm");
    const loginUsuario = $("#loginUsuario");
    const loginPassword = $("#loginPassword");
    const mensajeLogin = $("#mensajeLogin");
    const btnCerrarSesion = $("#btnCerrarSesion");

    /*==================================
        BUSCAR USUARIO
    ==================================*/

    function obtenerUsuarioLogin(usuario) {

        return obtenerUsuarios().find(
            u => u.usuario === usuario
        );

    }

    /*==================================
        VERIFICAR CONTRASEÑA
    ==================================*/

    function verificarPassword(usuario, password) {

        return usuario.password === hashSimple(password);

    }

    /*==================================
        ACTUALIZAR ÚLTIMO ACCESO
    ==================================*/

    function actualizarUltimoAcceso(usuario) {

        const usuarios = obtenerUsuarios();
        const indice = usuarios.findIndex(
            u => u.id === usuario.id
        );

        if (indice === -1) return;

        usuarios[indice].ultimoAcceso = obtenerFechaHora();
        usuarios[indice].visitas = (usuarios[indice].visitas || 0) + 1;

        guardarUsuarios(usuarios);

    }

    /*==================================
        GUARDAR SESIÓN
    ==================================*/

    function iniciarSesion(usuario) {

        guardarSession("usuarioActivo", usuario);
        guardarSession("inicioSesion", Date.now());
        guardarSession("paginasVisitadas", 1);
        guardarSession("acciones", []);

    }

    /*==================================
        REGISTRAR ACCIONES
    ==================================*/

    function registrarAccion(accion) {

        let acciones = leerSession("acciones") || [];

        acciones.push({
            accion,
            fecha: obtenerFechaHora()
        });

        guardarSession("acciones", acciones);

    }

    /*==================================
        LOGIN
    ==================================*/

    function login() {

        const usuario = (loginUsuario.value || "").trim();
        const password = loginPassword.value || "";

        if (usuario === "" || password === "") {

            mostrarMensaje(mensajeLogin, "Complete todos los campos.", "error");
            return;

        }

        const datos = obtenerUsuarioLogin(usuario);

        if (!datos) {

            mostrarMensaje(mensajeLogin, "Usuario inexistente.", "error");
            return;

        }

        if (!verificarPassword(datos, password)) {

            mostrarMensaje(mensajeLogin, "Contraseña incorrecta.", "error");
            return;

        }

        actualizarUltimoAcceso(datos);
        iniciarSesion(datos);
        registrarAccion("Inicio de sesión");

        if (typeof crearCookiesLogin === "function") {
            crearCookiesLogin(datos);
        }

        mostrarMensaje(mensajeLogin, "Bienvenido " + datos.nombre, "ok");

        if (typeof actualizarDashboard === "function") {
            actualizarDashboard();
        }

        if (typeof comprobarSesion === "function") {
            comprobarSesion();
        }

    }

    /*==================================
        CERRAR SESIÓN
    ==================================*/

    function cerrarSesion() {

        eliminarSession("usuarioActivo");
        eliminarSession("inicioSesion");
        eliminarSession("paginasVisitadas");
        eliminarSession("acciones");

        mostrarMensaje(mensajeLogin, "Sesión finalizada.", "ok");

        if (typeof comprobarSesion === "function") {
            comprobarSesion();
        }

        if (typeof actualizarDashboard === "function") {
            actualizarDashboard();
        }

    }

    /*==================================
        USUARIO ACTIVO
    ==================================*/

    function usuarioActivo() {

        return leerSession("usuarioActivo");

    }

    /*==================================
        SESIÓN INICIADA
    ==================================*/

    function existeSesion() {

        return usuarioActivo() !== null && usuarioActivo() !== undefined;

    }

    /*==================================
        EVENTO LOGIN
    ==================================*/

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();
        login();

    });

    /*==================================
        ENTER EN PASSWORD
    ==================================*/

    loginPassword.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            e.preventDefault();
            login();

        }

    });

    /*==================================
        BOTÓN CERRAR SESIÓN
    ==================================*/

    if (btnCerrarSesion) {

        btnCerrarSesion.addEventListener("click", function () {

            if (confirm("¿Desea cerrar sesión?")) {

                cerrarSesion();

            }

        });

    }

    /*==================================
        CONTADOR DE PÁGINAS
    ==================================*/

    window.addEventListener("load", function () {

        if (!existeSesion()) return;

        let paginas = leerSession("paginasVisitadas") || 0;
        paginas++;
        guardarSession("paginasVisitadas", paginas);

    });

    /*==================================
        INICIALIZACIÓN
    ==================================*/

    if (mensajeLogin) limpiarMensaje(mensajeLogin);

    // Exportar globals para los demás módulos
    window.usuarioActivo = usuarioActivo;
    window.existeSesion = existeSesion;
    window.cerrarSesion = cerrarSesion;
    window.registrarAccion = registrarAccion;

}

window.inicializarAutenticacion = inicializarAutenticacion;

