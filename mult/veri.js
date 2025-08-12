/**
 * veri.desofuscado.js
 * Versión reconstruida y traducida de la lógica principal de veri.js
 *
 * NOTA: Esta versión reconstruida prioriza la lógica funcional (lectura de pedidos,
 * verificación remota, actualización del archivo, bucle de comprobación).
 * He marcado con "⚠️ posible riesgo" las operaciones inseguras.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { verificar, gerar, cancelar } = require('./modulos/servicios'); // (inferencia) módulo con funciones
const { delay } = require('timers/promises'); // o una función delay propia
const moment = require('moment'); // si se usa en el original

// Ruta al archivo local que contiene los "pedidos" / items a verificar
const RUTA_PEDIDOS = path.join(__dirname, 'pedidos.json'); // adapta si tu ruta es otra

// Token o credenciales, importadas desde config (igual que en gerar.js)
// ⚠️ posible riesgo: el token/credenciales provienen de un archivo externo
let token = '';
try {
  const { config } = require('./config');
  token = config && config.token ? String(config.token) : '';
} catch (err) {
  console.warn('No se pudo leer ./config (posible que no exista). Continuando sin token.');
}

/**
 * Lee y parsea el JSON de pedidos desde disco.
 * Devuelve un array (o null en error).
 */
function leerPedidos() {
  try {
    if (!fs.existsSync(RUTA_PEDIDOS)) {
      console.warn('leerPedidos: no existe el archivo de pedidos:', RUTA_PEDIDOS);
      return [];
    }
    const raw = fs.readFileSync(RUTA_PEDIDOS, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('leerPedidos: error al leer/parsear pedidos.json:', err.message);
    return null;
  }
}

/**
 * Guarda el array de pedidos en disco (sobrescribe).
 */
function guardarPedidos(pedidos) {
  try {
    fs.writeFileSync(RUTA_PEDIDOS, JSON.stringify(pedidos, null, 2), 'utf8');
    console.log('guardarPedidos: pedidos actualizados en disco.');
  } catch (err) {
    console.error('guardarPedidos: error escribiendo pedidos.json:', err.message);
  }
}

/**
 * Realiza la verificación remota de un pedido por su id.
 * Usa la función "verificar" importada o hace una petición HTTP directa.
 * ⚠️ posible riesgo: llamada a servidor externo con credenciales.
 */
async function verificarPedidoRemoto(idPedido) {
  try {
    // Si existe una función "verificar" importada (del original), la usamos.
    if (typeof verificar === 'function') {
      return await verificar(idPedido, token);
    }

    // Sino, ejemplo de petición HTTP (inferencia)
    const url = `https://ejemplo.com/api/verificar/${encodeURIComponent(idPedido)}`; // (inferencia)
    const resp = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return resp.data;
  } catch (err) {
    console.error(`verificarPedidoRemoto: error verificando id=${idPedido}:`, err.message);
    return null;
  }
}

/**
 * Comprueba el estado de todos los pedidos en un bucle:
 *  - lee pedidos desde disco
 *  - para cada pedido pide verificación remota (si procede)
 *  - actualiza o elimina pedidos según la respuesta
 * Repite periódicamente.
 */
async function bucleComprobacion(options = {}) {
  const intervaloMs = options.intervaloMs ?? 30_000; // 30s por defecto (ajusta si deseas)
  console.log('bucleComprobacion: arrancando (intervalo ms):', intervaloMs);

  while (true) {
    try {
      const pedidos = leerPedidos();
      if (!Array.isArray(pedidos)) {
        console.warn('bucleComprobacion: no hay pedidos válidos, esperando antes de reintentar...');
        await delay(intervaloMs);
        continue;
      }

      // Recorremos los pedidos uno por uno
      for (let i = 0; i < pedidos.length; i++) {
        const pedido = pedidos[i];
        if (!pedido || !pedido.id) continue;

        // Condición para comprobar: si ha expirado o pasó suficiente tiempo desde la última verificación
        const ahora = Date.now();
        const tiempoLimite = pedido.timelimit ?? 0; // si tu formato es timestamp ms
        // (inferencia) si pedido.nextCheck o pedido.expires existen, puedes adaptar esto
        const necesitaVerificar = (pedido.nextCheck ? nowExceeded(pedido.nextCheck) : true)
                                || (pedido.expires && ahora > pedido.expires);

        // Si necesita verificación remota o estado pendiente
        if (necesitaVerificar || String(pedido.status) === 'pending' || String(pedido.status) === 'verif') {
          console.log(`bucleComprobacion: verificando pedido id=${pedido.id}`);
          const resultado = await verificarPedidoRemoto(pedido.id); // ⚠️ petición remota

          // Interpretamos la respuesta (inferencia, adapta según tu API)
          if (resultado && resultado.status === 'ok') {
            console.log(`Pedido ${pedido.id} verificado correctamente.`);
            // Acción: eliminar pedido de la lista y guardar (si eso es lo que hace el original)
            pedidos.splice(i, 1);
            i--; // ajustar índice por splice
            guardarPedidos(pedidos);
          } else if (resultado && resultado.status === 'fail') {
            console.warn(`Pedido ${pedido.id} FALLÓ verificación:`, resultado.reason || '(sin motivo)');
            // Dependiendo de la lógica: cancelar, marcar error, reintentar más tarde...
            // Aquí marcamos como 'failed' y seguimos:
            pedido.status = 'failed';
            pedido.lastChecked = ahora;
            // actualizar el archivo
            guardarPedidos(pedidos);
          } else {
            console.warn(`Pedido ${pedido.id}: respuesta inválida o nula de verificación, se reintentará más tarde.`);
            pedido.lastChecked = ahora;
            guardarPedidos(pedidos);
          }
        } // fin necesitaVerificar
      } // fin for pedidos

      // Pausa antes de la siguiente ronda
      await delay(intervaloMs);
    } catch (err) {
      console.error('bucleComprobacion: error inesperado:', err);
      // En caso de error, esperamos un poco antes de reanudar para evitar bucles rápidos de error
      await delay(60_000);
    }
  } // fin while
}

/* -------------------------
   FUNCIONES AUXILIARES
   ------------------------- */

/**
 * Devuelve true si el timestamp (en ms) está ya pasado respecto a ahora.
 */
function nowExceeded(timestampMs) {
  try {
    return Date.now() > Number(timestampMs);
  } catch {
    return true;
  }
}

/* -------------------------
   ARRANQUE (si se ejecuta como script)
   ------------------------- */
if (require.main === module) {
  (async () => {
    console.log('Iniciando verificador (reconstruido).');
    // Por seguridad, lee primero el archivo y muestra un resumen
    const pedidos = leerPedidos();
    console.log(`Se encontraron ${Array.isArray(pedidos) ? pedidos.length : 0} pedidos.`);
    // Iniciamos el bucle de comprobación con intervalo configurable
    bucleComprobacion({ intervaloMs: 20_000 }).catch(err => {
      console.error('Error en el bucle principal:', err);
      process.exit(1);
    });
  })();
}

/* -------------------------
   EXPORTS (si se usa como módulo)
   ------------------------- */
module.exports = {
  leerPedidos,
  guardarPedidos,
  verificarPedidoRemoto,
  bucleComprobacion
};
