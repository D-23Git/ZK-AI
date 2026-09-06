# PrivateData AI — Hackathon Demo Walkthrough

A complete guide to evaluating and testing the 10-step zero-knowledge contribution workflow in PrivateData AI.

---

## 1. Quick Launch

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test

# 3. Start development server
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 2. Walkthrough: The 10-Step Workflow

### Step 1: Landing Page & Differentiator
- Visit `http://localhost:3000`.
- Notice the **Product Differentiator**: *"Give me your data"* vs *"Prove your data qualifies"*.
- Inspect the **Interactive Architecture Diagram** and toggle between `PRIVATE ONLY` and `VERIFIABLE ONLY`.

### Step 2: Data Contributor Studio (Role A)
- Navigate to `/contributor`.
- Select target project: **Healthcare AI Research** (Requires: 10,000+ records, 95%+ completeness, 90+ quality score).
- Test **Dataset A (Valid)**:
  - Local AI engine evaluates: 50,000 records, 98% completeness, 1% duplicate rate, 95 quality score.
  - Requirement Matrix shows: **6 / 6 SATISFIED (PASS)**.
  - Click **"Generate Privacy Proof"** &rarr; Multi-step generation generates BLS12-381 proof & blinded dataset commitment.
  - Click **"Submit Proof to Midnight"** &rarr; Proof verified on ledger, confetti animation triggers!
- Test **Dataset B (Low Quality)**:
  - Requirement Matrix flags failures: Completeness (81%), Duplicates (8%), Quality (72).
  - Proof rejects submission due to constraint violations.
- Test **Dataset C (Insufficient Records)**:
  - Quality is 96, but volume is 4,500 (< 10,000 required). Flagged as NOT QUALIFIED.
- Inspect **Privacy Center**:
  - Raw Dataset: `PRIVATE`
  - Developer Raw Access: `NO`
  - Proof Shared: `YES`
  - Additional Disclosure: Contributor explicitly controls consent toggle.

### Step 3: AI Developer Portal (Role B)
- Navigate to `/developer`.
- View dashboard statistics: Total Contributions, Verified, Pending, Rejected, Average Quality.
- Click **"Requirement Builder"**:
  - Define custom parameters: Min Records, Min Completeness, Schema Fields.
  - Inspect the live **Structured Policy JSON** generated in real time.
- Click **"Publish Next Version (Immutable)"**:
  - Requirement version increments from `v1.0` to `v1.1`, creating an immutable policy hash.
- Test the **AI Developer Assistant**:
  - Click *"What kind of data do I need for this project?"* &rarr; AI analyzes project scope and recommends statistical thresholds.
  - Click *"Summarize Contributions"* &rarr; Synthesizes batch contribution health without exposing any private rows.
- In the **Incoming Contributions Table**:
  - Review Contribution `#DC-1024` with ZK Proof: `VALID`.
  - Accept or reject contributions.
  - Request additional disclosure (prompts contributor consent check).

### Step 4: Independent Auditor Registry (Role C)
- Navigate to `/auditor`.
- Inspect the **Audit Chain Integrity** badge (100% valid, tamper-evident hash chaining).
- In the **Verification Records Table**, see proof reference IDs, policy hashes, timestamps, and verifiers.
- Use the **Auditor Query Console**:
  - Enter Contribution ID `DC-1024` and click **"Audit Query"**.
  - System answers: *"Was this dataset proven to satisfy the requirements that existed at that time?"* &rarr; **YES — MATHEMATICALLY CERTIFIED**, with zero raw data exposed.

### Step 5: Privacy-Preserving Matching & Reputation
- Navigate to `/matching`: Search requirements and see matching private datasets.
- Navigate to `/reputation`: View zero-knowledge contributor reputation metrics.
- Navigate to `/midnight`: Inspect the authentic `privatedata_ai.compact` DSL smart contract and disclosure notes.
