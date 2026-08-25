# Blockchain Indexer Boundary

No indexer is currently deployed in this repository. The frontend therefore links to the explorer for complete history and does not fabricate an in-app transaction list.

## Required behavior

A worker must read Celo logs for the deployed CeloHT contracts and USDm transfers, validate chain ID and contract address, and persist each event using `(chain_id, transaction_hash, log_index)` as an idempotency key.

The worker must store its last processed block, support replay from a configured block, retry RPC/database failures, and reconcile reorgs. A transaction should move through `pending`, `confirmed`, or `failed` only from observed blockchain state.

## Activation checklist

- Configure an RPC endpoint and deployed contract addresses per environment.
- Implement event ABI decoding and receipt validation.
- Add a durable cursor and re-sync command.
- Add health metrics for RPC latency, cursor lag, retries, and database failures.
- Expose indexed data through an authenticated server-side API, not directly through service credentials in the browser.
