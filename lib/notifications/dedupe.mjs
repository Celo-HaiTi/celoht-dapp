export function transactionDeduplicationKey(chainId, hash, state) {
  return `tx:${chainId}:${hash.toLowerCase()}:${state}`;
}

export function securityDeduplicationKey(walletAddress, reason) {
  return `security:${walletAddress.toLowerCase()}:${reason}`;
}

export function entityDeduplicationKey(type, entityId, walletAddress) {
  return `${type}:${entityId}:${walletAddress.toLowerCase()}`;
}