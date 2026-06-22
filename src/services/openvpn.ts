import { execFile } from 'node:child_process';
import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const OPENVPN_USERS_DIR = '/root/openvpn';
const OPENVPN_CREATE_SCRIPT = '/root/openvpn/create.sh';
const OPENVPN_DELETE_SCRIPT = '/root/openvpn/delete.sh';

const execFileAsync = promisify(execFile);

/**
 * Build the expected .ovpn file path for a user.
 */
function getOpenVpnUserFilePath(userName: string): string {
  return path.join(OPENVPN_USERS_DIR, `${userName}.ovpn`);
}

/**
 * Read all OpenVPN users from generated .ovpn files.
 */
export async function listOpenVpnUsers(): Promise<string[]> {
  const entries = await readdir(OPENVPN_USERS_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.ovpn'))
    .map((entry) => path.basename(entry.name, '.ovpn'))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Create a new OpenVPN user by calling the shell script.
 */
export async function createOpenVpnUser(userName: string): Promise<string> {
  await execFileAsync(OPENVPN_CREATE_SCRIPT, [userName]);

  const filePath = getOpenVpnUserFilePath(userName);
  await access(filePath);

  return filePath;
}

/**
 * Get an existing OpenVPN config file path for a user.
 */
export async function getOpenVpnUserConfigPath(userName: string): Promise<string> {
  const filePath = getOpenVpnUserFilePath(userName);
  await access(filePath);

  return filePath;
}

/**
 * Delete an existing OpenVPN user by calling the shell script.
 */
export async function deleteOpenVpnUser(userName: string): Promise<void> {
  await execFileAsync(OPENVPN_DELETE_SCRIPT, [userName]);
}
