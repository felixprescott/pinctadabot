import { readdir } from 'node:fs/promises';
import path from 'node:path';

const OPENVPN_USERS_DIR = '/root/openvpn';

export async function listOpenVpnUsers(): Promise<string[]> {
  const entries = await readdir(OPENVPN_USERS_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.ovpn'))
    .map((entry) => path.basename(entry.name, '.ovpn'))
    .sort((a, b) => a.localeCompare(b));
}
