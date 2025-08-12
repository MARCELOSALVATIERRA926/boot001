bash <(echo 'IyEvYmluL2Jhc2gKCltbICIkKHdob2FtaSkiICE9ICJyb290IiBdXSAmJiB7CiAgICBlY2hvOyBl
Y2hvICJJbnN0YWxlIGNvbSB1c3VhcmlvIHJvb3QhIjsgZWNobzsgZXhpdCAwCn0KW1sgLWUgL2V0
Yy9tZWdhaGJvdC9pbmRleC5qcyBdXSAmJiB7CmVjaG87IGVjaG8gIkF0dWFsaXphbmRvIGJvdCwg
YWd1YXJkZS4uLiI7IGVjaG87IHdnZXQgaHR0cHM6Ly9naXRodWIuY29tL2VuZGJsYWNrL1dhQm90
LVZlbmRhc1NTSC9yYXcvbWFpbi9tdWx0L2luZGV4LmpzID4gL2Rldi9udWxsIDI+JjE7IHdnZXQg
aHR0cHM6Ly9naXRodWIuY29tL2VuZGJsYWNrL1dhQm90LVZlbmRhc1NTSC9yYXcvbWFpbi9tdWx0
L3ZlcmkuanMgPiAvZGV2L251bGwgMj4mMTsgd2dldCBodHRwczovL2dpdGh1Yi5jb20vZW5kYmxh
Y2svV2FCb3QtVmVuZGFzU1NIL3Jhdy9tYWluL211bHQvZ2VyYXIuanMgPiAvZGV2L251bGwgMj4m
MTsgd2dldCBodHRwczovL2dpdGh1Yi5jb20vZW5kYmxhY2svV2FCb3QtVmVuZGFzU1NIL3Jhdy9t
YWluL211bHQvcXJjb2RlID4gL2Rldi9udWxsIDI+JjE7IGNobW9kICt4IHFyY29kZTsgbXYgcXJj
b2RlIC9iaW47IG12IGluZGV4LmpzIC9ldGMvbWVnYWhib3Q7IG12IHZlcmkuanMgZ2VyYXIuanMg
L2V0Yy9tZWdhaGJvdC9zcmM7IGVjaG87IGVjaG8gIkF0dWFsaXphw6fDo28gdGVybWluYWRhISBk
aWdpdGUgb25ib3QgcGFyYSByb2RhciBvIG5vdm8gcHJvZ3JhbWEiOyBlY2hvOyBleGl0IDAKfQph
cHQgdXBkYXRlIC15OyBlY2hvOyBlY2hvICJJbnN0YWxhbmRvIGJvdCwgYWd1YXJkZS4uLiI7IGVj
aG87IGFwdCBpbnN0YWxsIG5vZGVqcyAteSA+IC9kZXYvbnVsbCAyPiYxOyBhcHQgaW5zdGFsbCB1
bnppcCAteSA+IC9kZXYvbnVsbCAyPiYxOyBhcHQgaW5zdGFsbCBzY3JlZW4gLXkgPiAvZGV2L251
bGwgMj4mMTsgYXB0IGluc3RhbGwgd2dldCAteSA+IC9kZXYvbnVsbCAyPiYxOyB3Z2V0IGh0dHBz
Oi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9lbmRibGFjay9XYUJvdC1WZW5kYXNTU0gvbWFp
bi9tdWx0L29uYm90ID4gL2Rldi9udWxsIDI+JjE7IHdnZXQgaHR0cHM6Ly9naXRodWIuY29tL2Vu
ZGJsYWNrL1dhQm90LVZlbmRhc1NTSC9yYXcvbWFpbi9tdWx0L29mZmJvdCA+IC9kZXYvbnVsbCAy
PiYxOyB3Z2V0IGh0dHBzOi8vZ2l0aHViLmNvbS9lbmRibGFjay9XYUJvdC1WZW5kYXNTU0gvcmF3
L21haW4vbXVsdC9xcmNvZGUgPiAvZGV2L251bGwgMj4mMTsgd2dldCBodHRwczovL2dpdGh1Yi5j
b20vZW5kYmxhY2svV2FCb3QtVmVuZGFzU1NIL3Jhdy9tYWluL211bHQvY29uZmlnLmpzID4gL2Rl
di9udWxsIDI+JjE7IGNobW9kICt4IG9uYm90IG9mZmJvdCBxcmNvZGU7IG12IG9uYm90IG9mZmJv
dCBxcmNvZGUgL2Jpbjsgd2dldCBodHRwczovL2dpdGh1Yi5jb20vZW5kYmxhY2svV2FCb3QtVmVu
ZGFzU1NIL3Jhdy9tYWluL211bHQvbWVnYWhib3QuemlwIC1PIC9ldGMvbWVnYWhib3QuemlwID4g
L2Rldi9udWxsIDI+JjE7IHVuemlwIC9ldGMvbWVnYWhib3QuemlwOyBtdiBtZWdhaGJvdCAvZXRj
OyBlY2hvOyBlY2hvICJJbnN0YWxhw6fDo28gdGVybWluYWRhISBOw6NvIGVzcXVlw6dhIGRlIGVk
aXRhciBzZXVzIGRhZG9zIG5vIGFycXVpdm8gY29uZmlnLmpzIjsgZWNobw==' | base64 -d )


#!/bin/bash
[[ "$(whoami)" != "root" ]] && {
    echo; echo "Instale com usuario root!"; echo; exit 0
}
[[ -e /etc/megahbot/index.js ]] && {
echho; echo "@tualizando bot, aguarde..."; echo; wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/index.js > /dev/null 2>&1; wget https://github.com/endblack/WaBot-VendasSSH/raw/main/mult/veri.js > /dev/null 2>&1; wget https://github.com/endblack/WaBot-VendasSSH/raw/main/mult/gerar.js > /dev/null 2>&1; wget https://github.com/endblack/WaBot-VendasSSH/raw/main/mult/qrcode > /dev/null 2>&1; chmod +x qrcode; mv qrcode /bin; mv index.js /etc/megahbot; mv veri.js gerar.js /etc/megahbot/src; echo; echo "Atualizaçço terminada! digite onbot para rodar o novo programa"; echo; exit 0 }

apt update -y; echo; echo "Instalando bot, aguarde..."; echo; apt install nodejs -y > /dev/null 2>&1; apt install unzip -y > /dev/null 2>&1; apt install screen -y > /dev/null 2>&1; apt install wget -y > /dev/null 2>&1; wget https://raw.githubusercontent.com/MARCELOSALVATIERRA926/boot001/refs/heads/main/mult/onbot > /dev/null 2>&1; wget https://github.com/endblack/WaBot-VendasSSH/raw/main/mult/offbot > /dev/null 2>&1; wget https://github.com/endblack/WaBot-VendasSSH/raw/main/mult/qrcode > /dev/null 2>&1; wget https://github.com/endblack/WaBot-VendasSSH/raw/main/mult/config.js > /dev/null 2>&1; chmod +x onbot offbot qrcode; mv onbot offbot qrcode /bin; wget https://github.com/endblack/WaBot-VendasSSH/raw/main/mult/megahbot.zip -O /etc/megahbot.zip > /dev/null 2>&1; unzip /etc/megahbot.zip;
mv megahbot /etc; echo; echo "Instalaão terminada! Não esqueça de editar seus dados no
arquivo config.js"; echo[root@vps-5218676-x ~] #


