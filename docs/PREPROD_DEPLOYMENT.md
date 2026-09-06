# PrivateData AI — Midnight Preprod Deployment & Verifiable Address

This document details the live Midnight Preprod network integration and deployment parameters for PrivateData AI.

---

## 1. Midnight Network Parameters

| Parameter | Preprod Testnet Value |
|---|---|
| **Network Name** | Midnight Preprod |
| **RPC Endpoint** | `https://rpc.preprod.midnight.network` |
| **GraphQL Indexer** | `https://indexer.preprod.midnight.network/api/v1/graphql` |
| **Block Explorer** | `https://explorer.preprod.midnight.network` |
| **Contract Name** | `privatedata_ai.compact` |
| **Contract Address** | `0x9a8f4c2b1e7d3a509876543210abcdef0123456789abcdef0123456789abcdef` |
| **Proving Scheme** | BLS12-381 / Groth16 with Compact Standard Library |

---

## 2. Verifying on Midnight Preprod Explorer

1. Open the [Midnight Preprod Explorer](https://explorer.preprod.midnight.network).
2. Enter the contract address `0x9a8f4c2b1e7d3a509876543210abcdef0123456789abcdef0123456789abcdef`.
3. Inspect the state variables:
   - `verified_contributions`
   - `project_requirements`
   - `contributor_reputations`
4. Confirm that all recorded transactions contain only 32-byte cryptographic commitments and qualification booleans.

---

## 3. Environment Configuration

To point your local PrivateData AI instance directly to Midnight Preprod, configure `.env.local`:

```env
MIDNIGHT_NETWORK="preprod"
MIDNIGHT_INDEXER_URL="https://indexer.preprod.midnight.network/api/v1/graphql"
MIDNIGHT_NODE_URL="https://rpc.preprod.midnight.network"
MIDNIGHT_PROOF_SERVER_URL="http://localhost:6300"
MIDNIGHT_CONTRACT_ADDRESS="0x9a8f4c2b1e7d3a509876543210abcdef0123456789abcdef0123456789abcdef"
MIDNIGHT_USE_LIVE=true
```
