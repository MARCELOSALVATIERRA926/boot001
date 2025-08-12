// Importación de librerías
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { config } = require('./config'); // ⚠️ posible riesgo: contiene token o credenciales

// Token obtenido de configuración externa
const token = '' + config.token;

// Función para verificar el token con el servidor
async function verificarToken() {
    try {
        const urlVerificacion = 'https://ejemplo.com/api/verificar'; // ⚠️ posible riesgo: URL externa real en código ofuscado
        const respuesta = await axios.post(urlVerificacion, { token: token }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (respuesta.data && respuesta.data.estado === 'ok') {
            console.log('✅ Verificación correcta.');
            return true;
        } else {
            console.warn('❌ Verificación fallida.');
            return false;
        }
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        return false;
    }
}

// Función principal de verificación
(async () => {
    const esValido = await verificarToken();
    if (!esValido) {
        console.error('El token no es válido. Abortando ejecución.');
        process.exit(1); // Finaliza el script
    } else {
        console.log('Continuando ejecución...');
        // Aquí iría el resto del flujo normal del programa
    }
})();
