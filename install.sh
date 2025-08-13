#!/bin/bash
# Revisa si el usuario es root
if [[ "$(whoami)" != "root" ]]; then
    echo
    echo "¡Instala como usuario root!"
    echo
    exit 1
fi

# Ruta de trabajo para descargas temporales
TEMP_DIR="/tmp/megahbot_install"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Sección de actualización (si el bot ya está instalado)
if [[ -e /etc/megahbot/index.js ]]; then
    echo
    echo "Actualizando bot, aguarde..."
    echo

    # Descargar y mover archivos a sus ubicaciones correctas
    wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/index.js -O /etc/megahbot/index.js >/dev/null 2>&1
    wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/veri.js -O /etc/megahbot/veri.js >/dev/null 2>&1
    wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/gerar.js -O /etc/megahbot/gerar.js >/dev/null 2>&1

    # Asegurarse de que el directorio 'src' exista antes de mover los archivos
    mkdir -p /etc/megahbot/src
    mv /etc/megahbot/veri.js /etc/megahbot/src/
    mv /etc/megahbot/gerar.js /etc/megahbot/src/
    
    # Manejo del archivo qrcode
    wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/qrcode -O /bin/qrcode >/dev/null 2>&1
    chmod +x /bin/qrcode
    
    echo
    echo "¡Actualización completa! Escribe \"onbot\" para ejecutar el nuevo programa."
    echo
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Sección de instalación inicial
apt update -y
echo
echo "Instalando bot, aguarde..."
echo
apt install nodejs unzip screen wget -y >/dev/null 2>&1

# Descargar y mover archivos de comandos a /bin
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/onbot -O /bin/onbot >/dev/null 2>&1
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/offbot -O /bin/offbot >/dev/null 2>&1
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/qrcode -O /bin/qrcode >/dev/null 2>&1
chmod +x /bin/onbot /bin/offbot /bin/qrcode

# Descargar y configurar el bot
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/megahbot.zip -O /etc/megahbot.zip >/dev/null 2>>/var/log/megahbot_install.log
unzip -o /etc/megahbot.zip -d /etc/ >/dev/null 2>&1

# Descargar y configurar config.js
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/config.js -O /etc/megahbot/config.js >/dev/null 2>&1

echo
echo "¡Instalación completa! No olvides editar los datos en el archivo /etc/megahbot/config.js"
rm -rf "$TEMP_DIR"
