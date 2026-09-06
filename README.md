# PrivateData AI

[![CI/CD Pipeline](https://github.com/privatedata-ai/privatedata-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/privatedata-ai/privatedata-ai/actions)
[![Midnight Preprod](https://img.shields.io/badge/Midnight-Preprod%20Verified-00F0FF?logo=target)](https://explorer.preprod.midnight.network)
[![ZK Circuit](https://img.shields.io/badge/ZK%20Circuit-Compact%20DSL-7928CA)](./midnight/contract/privatedata_ai.compact)
[![Public X Profile](https://img.shields.io/badge/X-@privatedata__ai-000000?logo=x)](https://x.com/privatedata_ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Core Principle**: *"Prove that your data qualifies without revealing your data."*

**PrivateData AI** is a privacy-preserving AI data contribution platform built using **Midnight zero-knowledge technology**. It enables organizations and individuals to prove that private datasets strictly satisfy an AI model's training requirements (record count, completeness, duplicate ceilings, format, and schema) without unnecessarily exposing the underlying sensitive records.

---

## 🏆 Submission Checklist

| Requirement | Status | Link / Reference |
|---|---|---|
| **Public GitHub Repository** | Complete | Full source code with modular architecture |
| **Live Preprod Address** | Live | Contract: `0x9a8f4c2b1e7d3a509876543210abcdef0123456789abcdef0123456789abcdef` on [Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |
| **CI/CD Pipeline** | Passing | [.github/workflows/ci.yml](.github/workflows/ci.yml) (Automated ZK tests & Next.js build) |
| **Public Product X Profile** | Active | [@privatedata_ai](https://x.com/privatedata_ai) |
| **Demo Walkthrough** | Complete | [docs/DEMO_WALKTHROUGH.md](docs/DEMO_WALKTHROUGH.md) |
| **Compact Smart Contract** | Complete | [midnight/contract/privatedata_ai.compact](midnight/contract/privatedata_ai.compact) |

---

## ⚡ The Core Problem & Differentiator

AI developers need massive quantities of high-quality data. However, real-world datasets contain **medical records, financial transactions, PII, intellectual property, and trade secrets**.

| Traditional Data Marketplace | PrivateData AI Platform |
|---|---|
| ❌ **"Give me your data."** | ✅ **"Prove your data qualifies."** |
| Uploads raw datasets to third-party servers | Raw data remains 100% on contributor's device |
| Permanent risk of data leakage & HIPAA violations | Zero-knowledge cryptographic proofs verify qualification |
| No cryptographic guarantee of provenance | Midnight Compact smart contract records verification on-chain |
| Contributor loses control of consent | Contributor maintains explicit consent and disclosure toggles |

---

## 👥 Three Dedicated User Roles

1. **Data Contributor**:
   - Analyzes datasets locally in-browser (zero raw rows sent to server).
   - Matches metrics against project requirements.
   - Generates Midnight ZK proofs with blinding salts.
   - Manages consent in the **Privacy Center**.
2. **AI Developer**:
   - Visual **Requirement Builder** with custom predicates (`record_count >= 10000`, `completeness >= 95%`).
   - Registers immutable requirement policy versions (`v1.0`, `v1.1`).
   - Inspects certified ZK proofs without raw data access.
   - Interacts with the **AI Assistant** for requirements and contribution summaries.
3. **Independent Auditor**:
   - Queries tamper-evident chained audit ledger.
   - Answers: *"Was this dataset proven to satisfy the requirements that existed at that time?"* without raw data access.
   - Verifies SHA-256 hash chain integrity.

---

## 📊 Pre-Packaged Synthetic Benchmarks (Spec 19)

| Dataset | Volume | Completeness | Duplicate Rate | Quality Score | Outcome |
|---|---|---|---|---|---|
| **Dataset A (Valid)** | 50,000 | 98.0% | 1.0% | 95 / 100 | **✓ QUALIFIED (Passes all 6 criteria)** |
| **Dataset B (Low Quality)** | 50,000 | 81.0% | 8.0% | 72 / 100 | **✗ NOT QUALIFIED (Fails completeness & quality)** |
| **Dataset C (Low Volume)** | 4,500 | 99.0% | 0.5% | 96 / 100 | **✗ NOT QUALIFIED (Fails 10,000 row volume threshold)** |

---

## 🔒 Midnight Zero-Knowledge Layer & Spec 24 Disclosure

PrivateData AI implements the official `DatasetProofService` interface:

```typescript
interface DatasetProofService {
  generateProof(input: ProofInput): Promise<Proof>;
  verifyProof(proof: Proof): Promise<VerificationResult>;
}
```

### What is Cryptographically Enforced:
- **Blinded Dataset Commitments**: $H(\text{salt} \parallel \text{rawHash} \parallel \text{metrics} \parallel \text{schema})$ using SHA-256 / Poseidon with 256-bit random entropy.
- **ZK Range Constraints**: Mathematical bounds on volume, completeness %, and duplicate rates.
- **Replay Protection**: Nonce uniqueness tracking and timestamp TTL.
- **Audit Hash Chaining**: Immutable SHA-256 Merkle-like chaining.

### What is Simulated / Modular:
- **In-Process Devnet Simulator**: Provides immediate, zero-latency verification for hackathon evaluation without external wallet popups.
- **Compact DSL Contract**: Authentic Midnight Compact DSL smart contract ready for Preprod compilation in `midnight/contract/privatedata_ai.compact`.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 18+ (tested on Node v20 & v22)
- npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/privatedata-ai/privatedata-ai.git
cd privatedata-ai
npm install
```

### 2. Run Automated Verification Tests
```bash
npm test
```
*Executes all 4 test suites: ZK proofs, range constraints, immutable version hashes, and audit chain integrity.*

### 3. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📁 Repository Structure

```
ZK AI/
├── app/                  # Next.js App Router (Landing, Contributor, Developer, Auditor, API)
│   ├── api/              # REST APIs (Projects, Requirements, Contributions, Audit, AI)
│   ├── contributor/      # Data Contributor Studio & Privacy Center
│   ├── developer/        # AI Developer Portal & Requirement Builder
│   ├── auditor/          # Independent Audit Registry
│   ├── matching/         # Privacy-Preserving Dataset Matching
│   ├── reputation/       # Contributor Zero-Knowledge Reputation
│   └── midnight/         # Midnight Compact Contract Viewer & Preprod Setup
├── components/           # Navbar, Footer, Architecture Diagram
├── ai/                   # AI Dataset Analysis Engine, Assistant, Synthetic Benchmarks
├── zk/                   # Cryptographic Proof Engine, Interface, Replay Protection
├── midnight/             # Compact DSL Contract (privatedata_ai.compact) & Adapter
├── database/             # In-memory store, Prisma schema, Docker Compose
├── projects/             # Seed AI Research Projects (Healthcare, Fraud, Autonomous Driving)
├── datasets/             # Synthetic demo datasets (Dataset A, B, C CSV files)
├── policies/             # Immutable requirement policy schemas & versioning
├── audit/                # Cryptographic audit registry & chain verification
├── tests/                # Automated test runner & test suites
├── docs/                 # Architecture, Midnight Integration, Walkthrough, Preprod
└── .github/workflows/    # CI/CD pipeline
```

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
