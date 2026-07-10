// Verificación estática: IDs/selectores referenciados por el JS que existan en el HTML
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const idsInHtml = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
console.log("IDs en HTML:", idsInHtml.length);

const jsFiles = ['utilidades.js','validaciones.js','autenticacion.js','seguridad.js','regex.js','cookies.js','storage.js','dashboard.js','app.js'];

const selectors = new Set();
for (const f of jsFiles) {
  const code = fs.readFileSync(f, 'utf8');
  const patterns = [
    /\$\("([^"]+)"\)/g,
    /\$\$?\("([^"]+)"\)/g,
    /querySelector(?:All)?\("([^"]+)"\)/g,
    /getElementById\("([^"]+)"\)/g
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(code)) !== null) selectors.add(m[1]);
  }
}

console.log("Selectores que el JS consulta:", selectors.size);

const missing = [];
for (const sel of selectors) {
  if (!sel) continue;
  if (sel.startsWith('#')) {
    if (!idsInHtml.includes(sel.slice(1))) missing.push(sel);
  } else if (sel.startsWith('.')) {
    const cls = sel.slice(1);
    const rx = new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"`);
    if (!rx.test(html)) missing.push(sel);
  } else if (sel.startsWith('[')) {
    const attr = sel.match(/\[([a-zA-Z_-]+)/);
    if (attr && !html.includes(attr[1])) missing.push(sel);
  }
}
console.log("Selectores faltantes:", missing.length === 0 ? "NINGUNO" : missing);

