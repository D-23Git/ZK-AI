# Midnight Zero-Knowledge Integration Guide

PrivateData AI utilizes the **Midnight Network** and the **Compact DSL** smart contract language to achieve on-chain cryptographic qualification proofs without revealing private raw data records.

---

## 1. Compact Smart Contract Specification

The smart contract is written in Compact DSL and located at:
`midnight/contract/privatedata_ai.compact`

### Core Ledger State:
- `verified_contributions`: Key-value map linking `contribution_id` to public proof records.
- `project_requirements`: Immutable map storing versioned requirement hashes.
- `contributor_reputations`: Zero-knowledge aggregate score counters.

### Core Circuit: `verify_dataset_qualification`
```rust
export circuit verify_dataset_qualification(
    contribution_id: Bytes<32>,
    project_id: Bytes<32>,
    requirement_version: Uint<32>,
    dataset_commitment: Bytes<32>,
    contributor_id: Bytes<32>,
    timestamp: Uint<64>
): Boolean
```
- Fetches requirement predicates.
- Queries private witness in contributor's prover enclave.
- Enforces range conditions ($records \ge minRecords \land completeness \ge minCompleteness$).
- Confirms commitment integrity.
- Emits ledger verification event.

---

## 2. Cryptographic vs Simulated Components (Spec 24 Disclosure)

In compliance with **Spec 24 (Important Midnight Requirement)**:

| Component | Status | Implementation Detail |
|---|---|---|
| **Dataset Commitments** | **Cryptographic** | SHA-256 / Poseidon hashing with 256-bit blinding salt |
| **Range Predicates** | **Cryptographic** | Mathematical constraint checks + BLS12-381 group serialization |
| **Replay Protection** | **Cryptographic** | Nonce tracking and TTL timestamp validation |
| **Audit Chaining** | **Cryptographic** | SHA-256 Merkle-like hash chaining between audit events |
| **Local Proof Engine** | **Devnet Simulator** | In-process TypeScript proof engine for zero-dependency execution |
| **Midnight Preprod** | **Production Ready** | Compact contract compiles with `compact compile` and deploys via Midnight CLI |

---

## 3. How to Deploy to Midnight Preprod

1. **Install Compact Compiler**:
   ```bash
   npm install -g @midnight-ntwrk/compact-compiler
   ```

2. **Compile the Compact Contract**:
   ```bash
   compact compile midnight/contract/privatedata_ai.compact --output ./midnight/build
   ```

3. **Start Local Midnight Proof Server** (Optional for local acceleration):
   ```bash
   docker run -d -p 6300:6300 --name midnight_proof_server midnightnetwork/proof-server:latest
   ```

4. **Deploy Contract to Midnight Preprod**:
   ```bash
   # Configure your Preprod wallet seed phrase in .env.local:
   MIDNIGHT_WALLET_SEED="your twelve word seed phrase..."
   MIDNIGHT_NETWORK="preprod"
   MIDNIGHT_USE_LIVE="true"
   ```

5. **Verify on Midnight Explorer**:
   Navigate to `https://explorer.preprod.midnight.network/address/<CONTRACT_ADDRESS>`.
