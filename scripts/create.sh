#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 client_name"
    exit 1
fi

client_name=$1
EASYRSA_DIR="/etc/openvpn/easy-rsa"
PKI="$EASYRSA_DIR/pki"
OUT_DIR="/root/openvpn"
CCD_DIR="/etc/openvpn/ccd"
FINGERPRINT_CONF="/etc/openvpn/fingerprints.conf"
START_IP=10

cd "$EASYRSA_DIR" || exit 1

rm -f "$PKI/reqs/$client_name.req"
rm -f "$PKI/private/$client_name.key"
rm -f "$PKI/issued/$client_name.crt"

export EASYRSA_CERT_EXPIRE=1460
export EASYRSA_BATCH=1
export EASYRSA_PASSIN="pass:Gtrree12$"
./easyrsa build-client-full "$client_name" nopass || exit 1

mkdir -p "$OUT_DIR"
mkdir -p "$CCD_DIR"

CCD_COUNT=$(find "$CCD_DIR" -maxdepth 1 -type f | wc -l)
LAST_OCTET=$((START_IP + CCD_COUNT))
CLIENT_IP="10.20.30.$LAST_OCTET"

cat << EOF > "$OUT_DIR/$client_name.ovpn"
remote vpn.dzhumba.ru
client
nobind
proto tcp
tun-mtu 1500
dev tun
tls-client
float
cipher AES-256-GCM
auth sha256
verb 0
key-direction 1
redirect-gateway def1

<ca>
$(cat "$PKI/ca.crt")
</ca>
<cert>
$(sed -n '/BEGIN CERTIFICATE/,/END CERTIFICATE/p' "$PKI/issued/$client_name.crt")
</cert>
<key>
$(cat "$PKI/private/$client_name.key")
</key>
<tls-auth>
$(cat "$PKI/ta.key")
</tls-auth>
EOF

printf 'ifconfig-push %s 255.255.255.0\n' "$CLIENT_IP" > "$CCD_DIR/$client_name"

FINGERPRINT=$(openssl x509 -in "$PKI/issued/$client_name.crt" -fingerprint -sha256 -noout | sed 's/sha256 Fingerprint=//')
cat << EOF >> "$FINGERPRINT_CONF"

# $client_name
<peer-fingerprint>
$FINGERPRINT
</peer-fingerprint>
EOF

systemctl kill --signal=SIGHUP openvpn@server.service
