# PrivateData AI 🛡️ - Midnight ZK Hackathon

PrivateData AI is a privacy-first AI dataset contribution platform built on the **Midnight Network**. It leverages Midnight's Zero-Knowledge Compact smart contracts to verify the quality and completeness of dataset contributions without ever exposing the raw dataset.

## ✨ MVP Features (Level 4 Waxing Gibbous Submission)
- **1AM Wallet Connection**: Connects to Midnight Preprod network via the 1AM Wallet DApp Connector.
- **Client-Side ZK Validation**: Simulates privacy-preserving generation of dataset metric proofs locally.
- **Midnight Compact Smart Contract**: The logic is implemented in `contracts/PrivateDataProof.compact`.
- **DUST Bounty System**: Rewards contributors upon verified proofs.
- **CI/CD Pipeline**: GitHub actions configured for automated testing and builds.

## 🔗 Submission Links
- **X (Twitter) Product Profile**: [https://x.com/YourProfileHere](https://x.com/YourProfileHere) *(TODO: Update with your link)*
- **Demo Video**: [Link to Loom/YouTube](https://youtu.be/) *(TODO: Update with your video)*
- **Live Demo (Preprod)**: [https://zk-ai-iota.vercel.app/](https://zk-ai-iota.vercel.app/)
- **Midnight Preprod Contract Address**: `0x_compact_contract_preprod_f7238c15de3` *(Note: Simulated address pending live node deployment)*

## 🚀 Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/your-username/privatedata-ai.git
cd privatedata-ai
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run the Development Server**
```bash
npm run dev -p 3006
```

## 🛠️ Tech Stack
- Next.js 14
- React
- Midnight Compact Language
- @midnight-ntwrk/midnight-js
- Tailwind CSS

## 📜 Smart Contract Architecture
The core logic resides in `contracts/PrivateDataProof.compact`. The contract verifies that the boolean flags `is_duplicate_rate_valid` and `is_completeness_valid` are true before accepting the data contribution and incrementing the global state.

```compact
export circuit verify_contribution(
    dataset_hash: Bytes<32>, 
    is_duplicate_rate_valid: Boolean, 
    is_completeness_valid: Boolean
): Void {
    assert is_duplicate_rate_valid;
    assert is_completeness_valid;
    // ...
}
```
