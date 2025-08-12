#!/bin/bash

# =============================
# Instalador seguro de MegaHBot
# =============================

# Comprobar que es root
if [[ "$(whoami)" != "root" ]]; then
    echo
    echo "Este instalador debe ejecutarse como usuario root."
    echo
    exit 1
fi

# Rutas locales a los archivos ya revisados
SRC_DIR="$(pwd)/archivos_locales"

# Verificar que la carpeta con los archivos existe
if [[ ! -d "$SRC_DIR" ]]; then
    echo "❌ No encuentro la carpeta $SRC_DIR con los archivos locales revisados."
    echo "Copia en esa carpeta: index.js, veri.js, gerar.js, qrcode, config.js, megahbot.zip"
    exit 1
fi

# Crear estructura de instalación
mkdir -p /etc/megahbot/src

# Copiar binarios y scripts
cp "$SRC_DIR/index.js" /etc/megahbot/
cp "$SRC_DIR/veri.js" "$SRC_DIR/gerar.js" /etc/megahbot/src/
cp "$SRC_DIR/qrcode" /bin/
cp "$SRC_DIR/onbot" "$SRC_DIR/offbot" /bin/
cp "$SRC_DIR/config.js" /etc/megahbot/

# Permisos
chmod +x /bin/qrcode /bin/onbot /bin/offbot

# Instalar dependencias necesarias
apt update -y
apt install -y nodejs unzip screen wget

# Descomprimir el bot principal
cp "$SRC_DIR/megahbot.zip" /etc/megahbot.zip
unzip -o /etc/megahbot.zip -d /etc/

echo
echo "✅ Instalación completa con archivos locales revisados."
echo "Para iniciar el bot, ejecuta: onbot"
