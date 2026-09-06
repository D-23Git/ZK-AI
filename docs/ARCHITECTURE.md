# PrivateData AI — System Architecture & Privacy Design

> **Core Principle**: *"Prove that your data qualifies without revealing your data."*

PrivateData AI establishes a cryptographic boundary between data contributors who possess confidential records and AI developers who need rigorous dataset verification.

---

## 1. High-Level Cryptographic Data Flow

```
+---------------------------------------------------------------------------------------------------+
| CONFIDENTIAL CONTRIBUTOR BOUNDARY (Client-Side Device)                                            |
|                                                                                                   |
|  [ Private Raw Dataset ] (CSV / JSON)                                                             |
|           |                                                                                       |
|           v                                                                                       |
|  [ Local AI Quality Engine ]  ---> Computes: Records, Completeness, Duplicate Rate, Quality Score  |
|           |                                                                                       |
|           +---> Generates Blinding Salt (256-bit random entropy)                                  |
|           |                                                                                       |
|           v                                                                                       |
|  [ Cryptographic Commitment ] ---> H(salt || rawHash || metrics || schema)                        |
|           |                                                                                       |
|           v                                                                                       |
|  [ Midnight ZK Prover ]       ---> Generates BLS12-381 / Groth16 Proof of Predicates:             |
|                                    - records >= minRecords                                        |
|                                    - completeness >= minCompleteness                              |
|                                    - duplicate_rate <= maxDuplicateRate                           |
|                                    - quality_score >= minQualityScore                             |
|                                    - schema_fields strictly match                                 |
+---------------------------------------------------------------------------------------------------+
                                               |
                        Proof Payload & Minimal Aggregates Only (NO RAW ROWS)
                                               |
                                               v
+---------------------------------------------------------------------------------------------------+
| PUBLIC & VERIFIABLE BOUNDARY (Midnight Ledger & REST API)                                         |
|                                                                                                   |
|  [ Midnight Compact Contract ] (privatedata_ai.compact)                                           |
|           |                                                                                       |
|           +---> verify_dataset_qualification() executes on validator nodes                        |
|           +---> Validates Nonce & Timestamp TTL (Replay Protection)                               |
|           +---> Verifies Commitment & Zero-Knowledge Constraints                                  |
|           |                                                                                       |
|           +----------------------------------+----------------------------------+                 |
|           |                                                                     |                 |
|           v                                                                     v                 |
|  [ AI Developer Result ]                                               [ Auditor Ledger ]         |
|  - Status: VERIFIED VALID                                              - Verification ID: ver-xxx |
|  - Requirements: 6 / 6 SATISFIED                                       - Req Version: 1.0 (Hash)  |
|  - Raw Dataset: NOT ACCESSIBLE                                         - Chained Merkle Proof     |
|  - Privacy: PROTECTED                                                  - Zero Raw Data Ingested   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Strict Boundary Definitions

### PRIVATE (Never leaves contributor device):
- Raw patient notes, financial transactions, PII, names, social security numbers.
- Unaggregated raw rows.
- Cryptographic blinding salt.

### VERIFIABLE (Accessible by AI Developer & Auditor):
- Zero-Knowledge proof group elements ($a \in G_1$, $b \in G_2$, $c \in G_1$).
- Binary qualification predicate results (`PASS` / `FAIL`).
- Blinded dataset commitment hash.
- Immutable requirement version reference hash.
- Verification timestamp & unique nonce.

---

## 3. Cryptographic Commitment Scheme

To ensure the contributor cannot submit one dataset to the ZK engine and claim qualification for a completely different dataset, we bind the claims using a **Pedersen/SHA-256 blinding commitment**:

$$\text{Commitment} = H(\text{salt} \parallel \text{rawHash} \parallel \text{recordCount} \parallel \text{completeness} \parallel \text{quality} \parallel \text{schemaHash})$$

1. **Hiding Property**: The verifier cannot deduce the raw records or exact statistics without the 256-bit blinding salt.
2. **Binding Property**: The contributor cannot change the underlying records without invalidating the commitment verified on the Midnight ledger.

---

## 4. Replay Attack & Nonce Protection (Spec 16)

Every proof includes a cryptographic nonce combined with the contributor's public identifier:
$$\text{nonceKey} = \text{contributorId} \parallel \text{nonce}$$
The smart contract / verification engine verifies that $\text{nonceKey}$ has never been executed previously, and that the generation timestamp is within the permitted 7-day TTL.
