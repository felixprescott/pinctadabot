import { execFile } from 'node:child_process';
import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const OPENVPN_USERS_DIR = '/root/openvpn';
const OPENVPN_CREATE_SCRIPT = '/root/openvpn/create.sh';

const execFileAsync = promisify(execFile);

/**
 * Check whether the provided OpenVPN user name is valid.
 */
function isValidOpenVpnUserName(userName: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(userName);
}

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
  if (!isValidOpenVpnUserName(userName)) {
    throw new Error('invalid openvpn user name');
  }

  await execFileAsync(OPENVPN_CREATE_SCRIPT, [userName]);

  const filePath = getOpenVpnUserFilePath(userName);
  await access(filePath);

  return filePath;
}

/**
 * Get an existing OpenVPN config file path for a user.
 */
export async function getOpenVpnUserConfigPath(userName: string): Promise<string> {
  if (!isValidOpenVpnUserName(userName)) {
    throw new Error('invalid openvpn user name');
  }

  const filePath = getOpenVpnUserFilePath(userName);
  await access(filePath);

  return filePath;
}
