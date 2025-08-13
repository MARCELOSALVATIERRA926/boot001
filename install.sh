#!/bin/bash
[[ "$(whoami)" != "root" ]] && {
    echo
    echo "Instale com usuario root!"
    echo
    exit 0
}
[[ -e /etc/megahbot/index.js ]] && {
    echho
    echo "@tualizando bot, aguarde..."
    echo
    wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/index.js > /dev/null 2>&1
    wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/veri.js > /dev/null 2>&1
    wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/gerar.js > /dev/null 2>&1
    wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/qrcode > /dev/null 2>&1
    chmod +x qrcode
    mv qrcode /bin
    mv index.js /etc/megahbot
    mv veri.js gerar.js /etc/megahbot/src
    echo
    echo "¡Actualización completa! Escribe \"onbot\" para ejecutar el nuevo programa."
    echo
    exit 0
}
apt update -y
echo
echo "Instalando bot, aguarde..."
echo
apt install nodejs -y > /dev/null 2>&1
apt install unzip -y > /dev/null 2>&1
apt install screen -y > /dev/null 2>&1
apt install wget -y > /dev/null 2>&1
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/onbot > /dev/null 2>&1
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/offbot > /dev/null 2>&1
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/qrcode > /dev/null 2>&1
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/config.js > /dev/null 2>&1
chmod +x onbot offbot qrcode
mv onbot offbot qrcode /bin
wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/megahbot.zip -O /etc/megahbot.zip > /dev/null 2>>/var/log/megahbot_install.log
unzip /etc/megahbot.zip
mv megahbot /etc
echo
echo "¡Instalación completa! No olvides editar los datos en el archivo config.js"
