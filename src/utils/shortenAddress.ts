/**
 * Shortens a base58 address to the form "AbCd…wxyz" (first 4 + last 4 chars).
 *
 * @param address - The full base58-encoded public key string.
 * @returns A shortened string with the first 4 and last 4 characters joined by an ellipsis.
 */
export function shortenAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
