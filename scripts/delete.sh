#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 client_name"
    exit 1
fi

client_name=$1
EASYRSA_DIR="/etc/openvpn/easy-rsa"
PKI="$EASYRSA_DIR/pki"
OUT_DIR="/root/openvpn"
FINGERPRINT_CONF="/etc/openvpn/fingerprints.conf"
INDEX_FILE="$PKI/index.txt"

rm -f "$PKI/reqs/$client_name.req"
rm -f "$PKI/private/$client_name.key"
rm -f "$PKI/issued/$client_name.crt"
rm -f "$OUT_DIR/$client_name.ovpn"

if [ -f "$FINGERPRINT_CONF" ]; then
    sed -i "/^# $client_name$/,/^<\\/peer-fingerprint>$/d" "$FINGERPRINT_CONF"
fi

if [ -f "$INDEX_FILE" ]; then
    sed -i "/\/CN=$client_name$/d" "$INDEX_FILE"
fi

systemctl kill --signal=SIGHUP openvpn@server.service
