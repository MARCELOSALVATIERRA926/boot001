/**
 * veri.js (origen reconstr.) – Lógica principal de verificación de pedidos
 * Importado desde GitHub y desofuscado/desglosado manualmente.
 *
 * Funcionalidades:
 * - Lee un archivo JSON con “pedidos”
 * - Verifica cada pedido contra un servidor externo
 * - Elimina o marca pedidos según respuesta
 * - Se ejecuta en bucle con pausas
 * - Exporta funciones para uso desde otros módulos
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { verificar, gerar, cancelar } = require('./modulos/servicios'); // funciones del servicio inicial
const { delay } = require('timers/promises'); // para espera asíncrona
const moment = require('moment'); // gestión de tiempos si es necesario

const RUTA_PEDIDOS = path.join(__dirname, 'pedidos.json'); // ruta del archivo local de pedidos

let token = '';
try {
  const { config } = require('./config'); // config con token/credenciales
  token = config && config.token ? String(config.token) : '';
} catch (err) {
  console.warn('No se pudo cargar ./config — continuando sin token.');
}

/**
 * Lee y parsea los pedidos desde disco.
 */
function leerPedidos() {
  try {
    if (!fs.existsSync(RUTA_PEDIDOS)) {
      console.warn('leerPedidos: archivo no encontrado:', RUTA_PEDIDOS);
      return [];
    }
    const contenido = fs.readFileSync(RUTA_PEDIDOS, 'utf8');
    return JSON.parse(contenido);
  } catch (err) {
    console.error('leerPedidos: error leyendo/parsing pedidos.json:', err.message);
    return null;
  }
}

/**
 * Escribe la lista de pedidos actualizada en disco.
 */
function guardarPedidos(pedidos) {
  try {
    fs.writeFileSync(RUTA_PEDIDOS, JSON.stringify(pedidos, null, 2), 'utf8');
    console.log('guardarPedidos: pedidos.json actualizado.');
  } catch (err) {
    console.error('guardarPedidos: error guardando pedidos.json:', err.message);
  }
}

/**
 * Verifica un pedido por ID, usando función interna o petición HTTP.
 * ⚠️ posible riesgo: contacto con servidor externo y uso de token.
 */
async function verificarPedidoRemoto(idPedido) {
  try {
    if (typeof verificar === 'function') {
      return await verificar(idPedido, token);
    }
    const url = `https://ejemplo.com/api/verificar/${encodeURIComponent(idPedido)}`; // (inferencia)
    const resp = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return resp.data;
  } catch (err) {
    console.error(`Error verificando pedido ${idPedido}:`, err.message);
    return null;
  }
}

/**
 * Bucle principal: lee, verifica, actualiza y espera.
 * Repite periódicamente hasta que se detenga.
 */
async function bucleComprobacion({ intervaloMs = 30_000 } = {}) {
  console.log('Iniciando bucle de comprobación cada', intervaloMs, 'ms');
  
  while (true) {
    try {
      const pedidos = leerPedidos();
      if (!Array.isArray(pedidos)) {
        console.warn('bucleComprobacion: pedidos inválidos — reintentando...');
        await delay(intervaloMs);
        continue;
      }

      for (let i = 0; i < pedidos.length; i++) {
        const pedido = pedidos[i];
        if (!pedido?.id) continue;

        const ahora = Date.now();
        const necesitaVerificar = pedido.nextCheck
          ? ahora > pedido.nextCheck
          : true;

        if (necesitaVerificar || ['pending', 'verif'].includes(String(pedido.status))) {
          console.log(`Verificando pedido ${pedido.id}...`);
          const resultado = await verificarPedidoRemoto(pedido.id);

          if (resultado?.status === 'ok') {
            console.log(`Pedido ${pedido.id} verificado correctamente.`);
            pedidos.splice(i, 1);
            i--;
            guardarPedidos(pedidos);
          } else if (resultado?.status === 'fail') {
            console.warn(`Fallo en verificación de ${pedido.id}:`, resultado.reason || 'sin motivo');
            pedido.status = 'failed';
            pedido.lastChecked = ahora;
            guardarPedidos(pedidos);
          } else {
            console.warn(`Respuesta inválida o nula para pedido ${pedido.id}; reintentando luego.`);
            pedido.lastChecked = ahora;
            guardarPedidos(pedidos);
          }
        }
      }

      await delay(intervaloMs);
    } catch (err) {
      console.error('Error en bucleComprobación:', err.message);
      await delay(60_000);
    }
  }
}

/**
 * Auxiliar: comprueba si timestamp ms ya pasó.
 */
function nowExceeded(timestampMs) {
  try {
    return Date.now() > Number(timestampMs);
  } catch {
    return true;
  }
}

// Si se ejecuta directamente, inicia el bucle
if (require.main === module) {
  (async () => {
    console.log('Iniciando verificador (modo independiente).');
    const pedidos = leerPedidos();
    console.log(`Pedidos encontrados: ${Array.isArray(pedidos) ? pedidos.length : 0}`);
    bucleComprobacion({ intervaloMs: 20_000 }).catch(err => {
      console.error('Error en ejecución principal:', err);
      process.exit(1);
    });
  })();
}

module.exports = {
  leerPedidos,
  guardarPedidos,
  verificarPedidoRemoto,
  bucleComprobacion
};
