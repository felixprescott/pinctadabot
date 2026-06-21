/**
 * Check whether the provided OpenVPN user name is valid.
 */
export function isValidOpenVpnUserName(userName: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(userName);
}
