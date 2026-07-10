// Test de runtime: carga todos los JS en jsdom y dispara DOMContentLoaded
const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'http://localhost/'
});

// Reemplazar las rutas de los scripts locales para que sean resolvibles
const jsFiles = ['utilidades.js','validaciones.js','autenticacion.js','seguridad.js','regex.js','cookies.js','storage.js','dashboard.js','app.js'];

// Inyectar los scripts manualmente
let scripts = '';
for (const f of jsFiles) scripts += `<script>${fs.readFileSync(f,'utf8')}</script>`;

const newHtml = html.replace(/<script[^>]*><\/script>/g, '');
const newDom = new JSDOM(newHtml.replace(/<\/body>/, scripts + '</body>'), {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'http://localhost/'
});

const { window } = newDom;
const errors = [];
window.addEventListener('error', e => errors.push('Error: ' + e.message));

// Esperar un poco para que se ejecuten los scripts
setTimeout(() => {
    console.log('=== Verificación de runtime ===');
    console.log('Errores:', errors.length === 0 ? 'NINGUNO' : errors);
    console.log('Funciones window:');
    console.log(' - mostrarSeccion:', typeof window.mostrarSeccion);
    console.log(' - cerrarSesion:', typeof window.cerrarSesion);
    console.log(' - actualizarDashboard:', typeof window.actualizarDashboard);
    console.log(' - crearCookiesLogin:', typeof window.crearCookiesLogin);
    console.log(' - informacionCookies:', typeof window.informacionCookies);
    console.log(' - ejecutarEncriptacion:', typeof window.ejecutarEncriptacion);
    console.log(' - buscarCoincidencias:', typeof window.buscarCoincidencias);
    console.log(' - SecureWebManager:', typeof window.SecureWebManager);

    console.log('\n=== DOM cargado ===');
    console.log(' - Secciones:', newDom.window.document.querySelectorAll('.modulo').length);
    console.log(' - Sección visible (registro):', newDom.window.document.getElementById('registro').style.display);
    console.log(' - Formulario existe:', !!newDom.window.document.getElementById('registroForm'));

    // Probar mostrarSeccion
    window.mostrarSeccion('dashboard');
    console.log('\n=== Después de mostrarSeccion("dashboard") ===');
    console.log(' - Style display:', newDom.window.document.getElementById('dashboard').style.display);

    process.exit(errors.length === 0 ? 0 : 1);
}, 500);

