/*=========================================================
    SecureWeb Manager
    storage.js
=========================================================*/

"use strict";

function inicializarStorage() {

    const STORAGE = {

        usuarios: "usuarios",
        historial: "historialEncriptacion",
        preferencias: "preferencias"

    };

    /*==================================
        OBTENER
    ==================================*/

    function obtenerStorage(clave) {

        const datos = localStorage.getItem(clave);

        if (datos === null) return [];

        try {

            return JSON.parse(datos);

        } catch (e) {

            return [];

        }

    }

    /*==================================
        GUARDAR
    ==================================*/

    function guardarStorage(clave, datos) {

        localStorage.setItem(clave, JSON.stringify(datos));

    }

    /*==================================
        AGREGAR
    ==================================*/

    function agregarStorage(clave, objeto) {

        const datos = obtenerStorage(clave);
        datos.push(objeto);
        guardarStorage(clave, datos);

    }

    /*==================================
        ELIMINAR
    ==================================*/

    function eliminarStorage(clave, id) {

        const datos = obtenerStorage(clave).filter(
            item => item.id !== id
        );
        guardarStorage(clave, datos);

    }

    /*==================================
        BUSCAR
    ==================================*/

    function buscarStorage(clave, texto) {

        const t = texto.toLowerCase();

        return obtenerStorage(clave).filter(item => {

            return JSON.stringify(item).toLowerCase().includes(t);

        });

    }

    /*==================================
        EDITAR
    ==================================*/

    function editarStorage(clave, id, nuevosDatos) {

        const datos = obtenerStorage(clave).map(item => {

            if (item.id === id) {

                return { ...item, ...nuevosDatos };

            }

            return item;

        });

        guardarStorage(clave, datos);

    }

    /*==================================
        EXPORTAR USUARIOS
    ==================================*/

    function exportarUsuarios() {

        exportarJSON(
            "usuarios.json",
            obtenerStorage(STORAGE.usuarios)
        );

    }

    /*==================================
        MOSTRAR USUARIOS
    ==================================*/

    function mostrarUsuarios() {

        const contenedor = $("#storageInfo");

        if (!contenedor) return;

        const usuarios = obtenerStorage(STORAGE.usuarios);

        if (usuarios.length === 0) {

            contenedor.innerHTML = "<p>No existen usuarios.</p>";
            return;

        }

        let html = "";

        usuarios.forEach(usuario => {

            html += `
                <div class="usuario-storage">
                    <strong>${usuario.nombre}</strong>
                    <br>
                    Usuario: ${usuario.usuario}
                    <br>
                    Correo: ${usuario.correo}
                    <hr>
                </div>
            `;

        });

        contenedor.innerHTML = html;

    }

    /*==================================
        BUSCAR USUARIO
    ==================================*/

    function buscarUsuarioStorage() {

        const texto = prompt("Ingrese usuario");

        if (!texto) return;

        const encontrados = buscarStorage(STORAGE.usuarios, texto);
        const contenedor = $("#storageInfo");

        if (!contenedor) return;

        if (encontrados.length === 0) {

            contenedor.innerHTML = "<p>No encontrado.</p>";
            return;

        }

        let html = "";

        encontrados.forEach(usuario => {

            html += `<p>${usuario.nombre} - ${usuario.usuario}</p>`;

        });

        contenedor.innerHTML = html;

    }

    /*==================================
        ELIMINAR USUARIO
    ==================================*/

    function eliminarUsuarioStorage() {

        const usuario = prompt("Usuario a eliminar");

        if (!usuario) return;

        const usuarios = obtenerStorage(STORAGE.usuarios);
        const encontrado = usuarios.find(u => u.usuario === usuario);

        if (!encontrado) {

            alert("No existe.");
            return;

        }

        eliminarStorage(STORAGE.usuarios, encontrado.id);
        mostrarUsuarios();

        if (typeof registrarAccion === "function") {
            registrarAccion("Eliminó usuario");
        }

        if (typeof actualizarDashboard === "function") {
            actualizarDashboard();
        }

    }

    /*==================================
        INFORMACIÓN
    ==================================*/

    function informacionStorage() {

        return {

            local: localStorage.length,
            session: sessionStorage.length,
            usuarios: obtenerStorage(STORAGE.usuarios).length,
            historial: obtenerStorage(STORAGE.historial).length

        };

    }

    /*==================================
        EVENTOS
    ==================================*/

    const btnExportar = $("#btnExportarJSON");
    if (btnExportar) {
        btnExportar.addEventListener("click", function () {
            exportarUsuarios();
            if (typeof registrarAccion === "function") {
                registrarAccion("Exportó JSON");
            }
        });
    }

    const btnBuscar = $("#btnBuscarUsuario");
    if (btnBuscar) {
        btnBuscar.addEventListener("click", buscarUsuarioStorage);
    }

    const btnEliminar = $("#btnEliminarUsuario");
    if (btnEliminar) {
        btnEliminar.addEventListener("click", eliminarUsuarioStorage);
    }

    mostrarUsuarios();

    // Exponer
    window.exportarUsuarios = exportarUsuarios;
    window.mostrarUsuarios = mostrarUsuarios;
    window.buscarUsuarioStorage = buscarUsuarioStorage;
    window.eliminarUsuarioStorage = eliminarUsuarioStorage;
    window.informacionStorage = informacionStorage;
    window.STORAGE = STORAGE;

}

window.inicializarStorage = inicializarStorage;

