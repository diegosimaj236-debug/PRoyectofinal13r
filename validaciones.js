/*=========================================================
    SecureWeb Manager
    validaciones.js
=========================================================*/

"use strict";

/*==================================
    EXPRESIONES REGULARES
==================================*/

const REGEX = {

    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/,

    correo: /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|edu\.gt)$/,

    telefono: /^[0-9]{8}$/,

    usuario: /^[A-Za-z][A-Za-z0-9]{7,14}$/,

    mayuscula: /[A-Z]/,

    minuscula: /[a-z]/,

    numero: /[0-9]/,

    especial: /[^A-Za-z0-9]/

};

/*==================================
    ELEMENTOS
==================================*/

function inicializarValidaciones() {

    const formRegistro = $("#registroForm");

    const txtNombre = $("#nombre");

    const txtCorreo = $("#correo");

    const txtTelefono = $("#telefono");

    const txtFecha = $("#fechaNacimiento");

    const txtUsuario = $("#usuario");

    const txtPassword = $("#password");

    const txtConfirmar = $("#confirmPassword");

    /*==================================
        ERRORES
    ==================================*/

    const errNombre = $("#errorNombre");

    const errCorreo = $("#errorCorreo");

    const errTelefono = $("#errorTelefono");

    const errFecha = $("#errorFecha");

    const errUsuario = $("#errorUsuario");

    const errPassword = $("#errorPassword");

    const errConfirmar = $("#errorConfirmPassword");

    // Bind helpers closures
    const setText = (el, msg) => { if (el) el.textContent = msg; };

    /*==================================
        VALIDAR NOMBRE
    ==================================*/

    function validarNombre() {

        const valor = limpiarNombre(txtNombre.value);

        txtNombre.value = valor;

        if (valor.length < 10) {

            setText(errNombre, "Debe contener mínimo 10 caracteres.");
            return false;

        }

        if (!REGEX.nombre.test(valor)) {

            setText(errNombre, "Ingrese nombre y apellido válidos.");
            return false;

        }

        setText(errNombre, "");
        return true;

    }

    /*==================================
        VALIDAR CORREO
    ==================================*/

    function validarCorreo() {

        const correo = (txtCorreo.value || "").trim().toLowerCase();

        if (!REGEX.correo.test(correo)) {

            setText(errCorreo, "Dominio no permitido.");
            return false;

        }

        const existe = obtenerUsuarios().some(
            usuario => usuario.correo === correo
        );

        if (existe) {

            setText(errCorreo, "El correo ya existe.");
            return false;

        }

        setText(errCorreo, "");
        return true;

    }

    /*==================================
        VALIDAR TELÉFONO
    ==================================*/

    function validarTelefono() {

        const telefono = (txtTelefono.value || "").trim();

        if (!REGEX.telefono.test(telefono)) {

            setText(errTelefono, "Debe contener 8 números.");
            return false;

        }

        setText(errTelefono, "");
        return true;

    }

    /*==================================
        VALIDAR FECHA
    ==================================*/

    function validarFecha() {

        if (txtFecha.value === "") {

            setText(errFecha, "Seleccione una fecha.");
            return false;

        }

        const edad = calcularEdad(txtFecha.value);

        if (edad < 13) {

            setText(errFecha, "Debe tener al menos 13 años.");
            return false;

        }

        if (edad > 100) {

            setText(errFecha, "Edad inválida.");
            return false;

        }

        setText(errFecha, "");
        return true;

    }

    /*==================================
        VALIDAR USUARIO
    ==================================*/

    function validarUsuario() {

        const usuario = (txtUsuario.value || "").trim();

        if (!REGEX.usuario.test(usuario)) {

            setText(errUsuario, "Debe iniciar con letra y tener entre 8 y 15 caracteres.");
            return false;

        }

        const existe = obtenerUsuarios().some(
            u => u.usuario === usuario
        );

        if (existe) {

            setText(errUsuario, "Nombre de usuario ocupado.");
            return false;

        }

        setText(errUsuario, "");
        return true;

    }

    /*==================================
        VALIDAR CONTRASEÑA
    ==================================*/

    function validarPassword() {

        const password = txtPassword.value || "";

        if (password.length < 10) {

            setText(errPassword, "Debe contener al menos 10 caracteres.");
            actualizarBarraPassword(0);
            return false;

        }

        if (!REGEX.mayuscula.test(password)) {

            setText(errPassword, "Debe contener una letra mayúscula.");
            actualizarBarraPassword(20);
            return false;

        }

        if (!REGEX.minuscula.test(password)) {

            setText(errPassword, "Debe contener una letra minúscula.");
            actualizarBarraPassword(40);
            return false;

        }

        if (!REGEX.numero.test(password)) {

            setText(errPassword, "Debe contener un número.");
            actualizarBarraPassword(60);
            return false;

        }

        if (!REGEX.especial.test(password)) {

            setText(errPassword, "Debe contener un carácter especial.");
            actualizarBarraPassword(80);
            return false;

        }

        setText(errPassword, "");
        actualizarBarraPassword(100);
        return true;

    }

    /*==================================
        FORTALEZA PASSWORD
    ==================================*/

    function actualizarBarraPassword(porcentaje) {

        const barra = $("#passwordStrength");

        const nivel = $("#passwordNivel");

        if (!barra) return;

        barra.style.width = porcentaje + "%";

        if (porcentaje <= 20) {

            barra.style.background = "#dc2626";
            if (nivel) nivel.textContent = "Fortaleza: Muy débil";
            return;

        }

        if (porcentaje <= 40) {

            barra.style.background = "#ea580c";
            if (nivel) nivel.textContent = "Fortaleza: Débil";
            return;

        }

        if (porcentaje <= 60) {

            barra.style.background = "#f59e0b";
            if (nivel) nivel.textContent = "Fortaleza: Media";
            return;

        }

        if (porcentaje <= 80) {

            barra.style.background = "#22c55e";
            if (nivel) nivel.textContent = "Fortaleza: Buena";
            return;

        }

        barra.style.background = "#16a34a";
        if (nivel) nivel.textContent = "Fortaleza: Muy fuerte";

    }

    /*==================================
        CONFIRMAR CONTRASEÑA
    ==================================*/

    function validarConfirmacion() {

        if (txtConfirmar.value !== txtPassword.value) {

            setText(errConfirmar, "Las contraseñas no coinciden.");
            return false;

        }

        setText(errConfirmar, "");
        return true;

    }

    /*==================================
        VALIDAR FORMULARIO
    ==================================*/

    function validarFormulario() {

        return (
            validarNombre() &&
            validarCorreo() &&
            validarTelefono() &&
            validarFecha() &&
            validarUsuario() &&
            validarPassword() &&
            validarConfirmacion()
        );

    }

    /*==================================
        LIMPIAR ERRORES
    ==================================*/

    function limpiarErrores() {

        setText(errNombre, "");
        setText(errCorreo, "");
        setText(errTelefono, "");
        setText(errFecha, "");
        setText(errUsuario, "");
        setText(errPassword, "");
        setText(errConfirmar, "");

    }

    /*==================================
        REGISTRAR USUARIO
    ==================================*/

    function registrarUsuario() {

        const usuarios = obtenerUsuarios();

        const nuevoUsuario = {

            id: generarID(),
            nombre: limpiarNombre(txtNombre.value),
            correo: txtCorreo.value.trim().toLowerCase(),
            telefono: txtTelefono.value.trim(),
            fechaNacimiento: txtFecha.value,
            edad: calcularEdad(txtFecha.value),
            usuario: txtUsuario.value.trim(),
            password: hashSimple(txtPassword.value),
            fechaRegistro: obtenerFechaHora(),
            ultimoAcceso: "Nunca",
            visitas: 0

        };

        usuarios.push(nuevoUsuario);

        guardarUsuarios(usuarios);

        return nuevoUsuario;

    }

    /*==================================
        MENSAJE DE REGISTRO
    ==================================*/

    function mensajeRegistro(usuario) {

        alert(
            `Usuario registrado correctamente.\n\n` +
            `Nombre: ${usuario.nombre}\n` +
            `Usuario: ${usuario.usuario}\n` +
            `Correo: ${usuario.correo}`
        );

    }

    /*==================================
        LIMPIAR FORMULARIO
    ==================================*/

    function limpiarFormulario() {

        formRegistro.reset();
        limpiarErrores();
        actualizarBarraPassword(0);
        const nivel = $("#passwordNivel");
        if (nivel) nivel.textContent = "";

    }

    /*==================================
        EVENTOS EN TIEMPO REAL
    ==================================*/

    txtNombre.addEventListener("keyup", validarNombre);
    txtCorreo.addEventListener("keyup", validarCorreo);
    txtTelefono.addEventListener("keyup", validarTelefono);
    txtFecha.addEventListener("change", validarFecha);
    txtUsuario.addEventListener("keyup", validarUsuario);

    txtPassword.addEventListener("keyup", () => {
        validarPassword();
        validarConfirmacion();
    });

    txtConfirmar.addEventListener("keyup", validarConfirmacion);

    /*==================================
        ENVÍO DEL FORMULARIO
    ==================================*/

    formRegistro.addEventListener("submit", function (e) {

        e.preventDefault();

        if (!validarFormulario()) return;

        const usuario = registrarUsuario();

        mensajeRegistro(usuario);

        limpiarFormulario();

        if (typeof actualizarDashboard === "function") {
            actualizarDashboard();
        }

    });

    /*==================================
        BLOQUEAR LETRAS EN TELÉFONO
    ==================================*/

    txtTelefono.addEventListener("keypress", function (e) {

        if (e.key < "0" || e.key > "9") {
            e.preventDefault();
        }

    });

    /*==================================
        MÁXIMO 8 DÍGITOS TELÉFONO
    ==================================*/

    txtTelefono.addEventListener("input", function () {

        this.value = this.value.replace(/\D/g, "").substring(0, 8);

    });

    /*==================================
        USUARIO SIN ESPACIOS
    ==================================*/

    txtUsuario.addEventListener("input", function () {

        this.value = this.value.replace(/\s/g, "");

    });

    /*==================================
        CORREO EN MINÚSCULAS
    ==================================*/

    txtCorreo.addEventListener("input", function () {

        this.value = this.value.toLowerCase();

    });

    /*==================================
        CONTRASEÑA SEGURA
    ==================================*/

    txtPassword.setAttribute("autocomplete", "new-password");
    txtConfirmar.setAttribute("autocomplete", "new-password");

    /*==================================
        INICIALIZACIÓN
    ==================================*/

    limpiarErrores();
    actualizarBarraPassword(0);

}

// Exponer para usar después del DOMContentLoaded
window.inicializarValidaciones = inicializarValidaciones;

