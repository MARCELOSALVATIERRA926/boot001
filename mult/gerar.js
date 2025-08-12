/**
 * gerar.js - Versión desofuscada y traducida al español
 *
 * Hecho: unificar la lógica principal, peticiones, descargas, ejecución dinámica y manipulación de archivos.
 * ⚠️ Marqué con "// ⚠️ posible riesgo" las operaciones potencialmente peligrosas.
 *
 * Nota: El token real proviene de un módulo de configuración externo (./config).
 * Si quieres que revele el token real, tendrás que abrir el archivo de configuración correspondiente.
 */

/* ---------------------------
   IMPORTACIONES Y CONFIG
   --------------------------- */
const axios = require('axios');               // Cliente HTTP
const fs = require('fs');                     // Sistema de archivos
const ms = require('ms');                     // (opcional) convierte tiempos (e.g. "1d" -> ms)
const moment = require('moment');             // Manejo de fechas
// Se asume que existe un archivo ./config.js o config.json que exporta { config }
let token = '';
try {
  const { config } = require('./config');    // ⚠️ posible riesgo: contiene token/credenciales
  token = '' + (config && config.token ? config.token : '');
} catch (err) {
  console.warn('No se pudo cargar ./config — asegúrate de que exista y exporte { config } (p.ej. config.token).');
}

/* ---------------------------------------------------
   UTILIDADES BÁSICAS
   --------------------------------------------------- */

/**
 * Cabeceras comunes con token (si existe).
 * Si no hay token, las peticiones se harán sin Authorization.
 */
function cabecerasConToken(extra = {}) {
  const cabeceras = Object.assign({}, extra);
  if (token && token.length > 0) {
    cabeceras['Authorization'] = `Bearer ${token}`; // ⚠️ posible riesgo: token sensible
  }
  return cabeceras;
}

/**
 * Lectura segura de JSON desde archivo.
 */
function leerJSON(ruta) {
  try {
    const contenido = fs.readFileSync(ruta, 'utf8');
    return JSON.parse(contenido);
  } catch (err) {
    console.error(`leerJSON: no se pudo leer ${ruta}:`, err.message);
    return null;
  }
}

/**
 * Guardar objeto como JSON en disco.
 */
function guardarJSON(ruta, objeto) {
  try {
    fs.writeFileSync(ruta, JSON.stringify(objeto, null, 2), 'utf8');
    console.log(`Archivo guardado: ${ruta}`);
  } catch (err) {
    console.error(`guardarJSON: error guardando ${ruta}:`, err.message);
  }
}

/* ---------------------------------------------------
   PETICIONES HTTP (con axios)
   --------------------------------------------------- */

/**
 * Realiza un GET y devuelve datos (o null en error).
 * @param {string} url
 */
async function obtenerDatosGET(url) {
  try {
    const resp = await axios.get(url, { headers: cabecerasConToken() });
    return resp.data;
  } catch (err) {
    console.error('obtenerDatosGET: error en GET', url, err.message);
    return null;
  }
}

/**
 * Realiza un POST con JSON y devuelve la respuesta.
 * @param {string} url
 * @param {object} payload
 */
async function enviarDatosPOST(url, payload) {
  try {
    const resp = await axios.post(url, payload, {
      headers: cabecerasConToken({ 'Content-Type': 'application/json' })
    });
    return resp.data;
  } catch (err) {
    console.error('enviarDatosPOST: error en POST', url, err.message);
    return null;
  }
}

/* ---------------------------------------------------
   DESCARGAS Y EJECUCIÓN DINÁMICA
   --------------------------------------------------- */

/**
 * Descarga binario/archivo desde una URL y lo guarda en destino.
 * ⚠️ posible riesgo: escribe archivos descargados desde internet.
 * @param {string} url
 * @param {string} destino - ruta local donde guardar
 */
async function descargarArchivo(url, destino) {
  try {
    const resp = await axios.get(url, { responseType: 'arraybuffer', headers: cabecerasConToken() });
    fs.writeFileSync(destino, Buffer.from(resp.data), { flag: 'w' });
    console.log(`descargarArchivo: guardado ${destino}`);
    return true;
  } catch (err) {
    console.error('descargarArchivo: error', url, err.message);
    return false;
  }
}

/**
 * Ejecuta código JS recibido como texto en un contexto nuevo.
 * ⚠️ posible riesgo: ejecución dinámica de código -> puede ejecutar XSS / malware.
 * Se recomienda NO usar esto con código no verificado.
 *
 * @param {string} codigoTexto
 */
function ejecutarCodigoDinamico(codigoTexto) {
  try {
    // Ejecutar en una Function evita usar eval directamente, pero sigue siendo peligroso.
    const fn = new Function(codigoTexto);
    fn();
    console.log('ejecutarCodigoDinamico: ejecución finalizada.');
  } catch (err) {
    console.error('ejecutarCodigoDinamico: error al ejecutar código dinámico:', err.message);
  }
}

/* ---------------------------------------------------
   LÓGICA PRINCIPAL (ejemplo de flujo extraído)
   --------------------------------------------------- */

/**
 * Procesa una rutina de ejemplo:
 *  - obtiene datos de un endpoint
 *  - guarda localmente
 *  - descarga un script remoto y lo ejecuta (si se permite)
 *  - reporta resultados a un endpoint
 *
 * NOTA: reemplace las URLs por las reales que quieras usar.
 */
async function flujoPrincipal(opciones = {}) {
  // Opciones por defecto (inferencia si es que no estaban explícitas)
  const defaults = {
    urlDatos: 'https://ejemplo.com/api/datos',       // (inferencia) URL de ejemplo
    rutaDatosLocal: 'datos.json',
    urlScript: 'https://ejemplo.com/script.js',     // (inferencia) script a descargar/ejecutar
    rutaScriptLocal: 'script_descargado.js',
    endpointReporte: 'https://ejemplo.com/api/reportar', // (inferencia) endpoint para reportes
    ejecutarScriptDescargado: false                  // por seguridad, FALSE por defecto
  };
  const cfg = Object.assign({}, defaults, opciones);

  console.log(`Inicio del flujo: obteniendo datos de ${cfg.urlDatos}`);
  const datos = await obtenerDatosGET(cfg.urlDatos);
  if (!datos) {
    console.warn('flujoPrincipal: no se obtuvieron datos, abortando flujo principal.');
    return;
  }

  // Guardar datos localmente
  guardarJSON(cfg.rutaDatosLocal, datos);

  // Si se pidió, descargar y ejecutar script remoto
  if (cfg.ejecutarScriptDescargado) {
    console.warn('flujoPrincipal: ejecutarScriptDescargado está activo — operación peligrosa.');
    const bajado = await descargarArchivo(cfg.urlScript, cfg.rutaScriptLocal);
    if (bajado) {
      try {
        const codigo = fs.readFileSync(cfg.rutaScriptLocal, 'utf8');
        ejecutarCodigoDinamico(codigo); // ⚠️ posible riesgo
      } catch (err) {
        console.error('flujoPrincipal: error leyendo o ejecutando script descargado:', err.message);
      }
    }
  } else {
    console.log('flujoPrincipal: ejecutarScriptDescargado desactivado — no se descargó ni ejecutó script.');
  }

  // Preparar reporte
  const reporte = {
    fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
    origen: cfg.urlDatos,
    estado: 'completado',
    resumen: {
      totalElementos: Array.isArray(datos) ? datos.length : null,
      nombreArchivo: cfg.rutaDatosLocal
    }
  };

  // Enviar reporte
  console.log(`flujoPrincipal: enviando reporte a ${cfg.endpointReporte}`);
  const respuestaReporte = await enviarDatosPOST(cfg.endpointReporte, reporte); // ⚠️ posible riesgo
  if (respuestaReporte) {
    console.log('flujoPrincipal: reporte enviado, respuesta:', respuestaReporte);
  } else {
    console.warn('flujoPrincipal: no se pudo enviar el reporte.');
  }
}

/* ---------------------------------------------------
   FUNCIONES AUXILIARES DETECTADAS EN EL ORIGINAL
   ---------------------------------------------------
   (aquí se reconstruyen funciones que el archivo original contenía,
    simplificadas y renombradas al español)
*/

/**
 * Ejemplo de función que valida texto con expresiones regulares.
 * En el original había comprobaciones anti-debug; aquí conservamos
 * sólo una versión útil (validación de formato).
 */
function validarConRegex(texto, patronStr, flags = '') {
  try {
    const re = new RegExp(patronStr, flags);
    return re.test(texto);
  } catch (err) {
    console.error('validarConRegex: patrón inválido', patronStr, err.message);
    return false;
  }
}

/**
 * Ejemplo de función que transforma tiempos legibles a ms (usa ms lib).
 * Mantengo por compatibilidad.
 */
function transformarTiempo(tiempo) {
  try {
    return ms(tiempo);
  } catch (err) {
    console.warn('transformarTiempo: ms no pudo convertir', tiempo);
    return null;
  }
}

/* ---------------------------------------------------
   ARRANQUE / EXPORTS
   --------------------------------------------------- */

// Si se ejecuta directamente por node, inicia el flujo principal con opciones por defecto.
// Para evitar ejecutar operaciones peligrosas por accidente, ejecuto sin descargar/ejecutar scripts.
if (require.main === module) {
  (async () => {
    try {
      await flujoPrincipal({
        ejecutarScriptDescargado: false // Por seguridad, desactivado por defecto
      });
      console.log('Ejecución finalizada.');
    } catch (err) {
      console.error('Error en ejecución principal:', err.message);
    }
  })();
}

// Exportar funciones para uso desde otros módulos/tests
module.exports = {
  flujoPrincipal,
  obtenerDatosGET,
  enviarDatosPOST,
  descargarArchivo,
  ejecutarCodigoDinamico,
  leerJSON,
  guardarJSON,
  validarConRegex,
  transformarTiempo
};
