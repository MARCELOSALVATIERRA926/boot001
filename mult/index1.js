// ==============================
// index.js - Versión limpia
// ==============================

// Importamos librerías necesarias
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require('@adiwajshing/baileys');

const { Boom } = require('@hapi/boom');
const P = require('pino');

// ==============================
// Función principal
// ==============================
async function iniciarWhatsApp() {
    // Cargar o crear credenciales en carpeta ./auth_info
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    // Crear conexión al socket de WhatsApp
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Muestra el QR en consola
        logger: P({ level: 'silent' })
    });

    // ==============================
    // Eventos de conexión
    // ==============================
    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const motivo = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const debeReconectar = motivo !== DisconnectReason.loggedOut;
            console.log('⚠️ Conexión cerrada. Motivo:', motivo);

            if (debeReconectar) {
                console.log('🔄 Reintentando conexión...');
                iniciarWhatsApp();
            } else {
                console.log('❌ Sesión cerrada. Escanea nuevamente el código QR.');
            }
        } else if (connection === 'open') {
            console.log('✅ Conectado a WhatsApp');
        }
    });

    // ==============================
    // Evento: Mensajes recibidos
    // ==============================
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        const texto = msg.message?.conversation || '';

        console.log('📩 Mensaje recibido de', msg.key.remoteJid, ':', texto);

        // Ejemplo de respuesta automática
        if (texto.toLowerCase() === 'hola') {
            await sock.sendMessage(msg.key.remoteJid, { text: '¡Hola! 👋 ¿Cómo estás?' });
        }
    });

    // Guardar credenciales cuando se actualicen
    sock.ev.on('creds.update', saveCreds);
}

// Ejecutar función principal
iniciarWhatsApp();
