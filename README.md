# 🗳️ Aadhaar-Verified Decentralized Voting DApp

A secure, blockchain-based voting system that uses hashed Aadhaar numbers to ensure unique identity-based voting without exposing sensitive data.

## 🛡️ Security Features
- **Identity Hashing**: Aadhaar numbers are hashed client-side using `keccak256` before being sent to the blockchain. The raw Aadhaar number is NEVER stored on-chain.
- **One-Identity-One-Vote**: The smart contract enforces that each unique Aadhaar hash can only cast a single vote, regardless of the wallet used.
- **Owner-Controlled**: Only the contract owner can register identity hashes and manage the election status.

## 🧪 Demo Mode & Test Data
This project includes a set of 5 fictional test voters for demonstration purposes:
1. Arjun Sharma (2345 6789 0123)
2. Priya Nair (3456 7890 1234)
3. Mohammed Faiz (4567 8901 2345)
4. Sneha Patel (5678 9012 3456)
5. Ravi Kumar (6789 0123 4567)

**⚠️ DISCLAIMER**: All voter data is fictional and created for educational/internship demonstration only.

## 🚀 Deployment Instructions

### 1. Smart Contract (Remix IDE)
1. Open [Remix IDE](https://remix.ethereum.org).
2. Create `Voting.sol` and paste the contract code.
3. Compile with Solidity `0.8.20`.
4. Deploy to **Sepolia Testnet** using MetaMask.
5. Copy the deployed contract address.

### 2. Frontend Configuration
1. Open `src/hooks/useVoting.ts`.
2. Replace `CONTRACT_ADDRESS` with your deployed address.

### 3. Setup & Run
1. Install dependencies: `npm install`
2. Run the app: `npm run dev`
3. Connect your MetaMask (ensure you are on Sepolia).
4. **Admin Setup**: 
   - Log in with any Aadhaar (or use the test user dropdown).
   - If you are the owner, go to the **Admin** tab.
   - Click **"Register All Test Voters"** to bulk-register the dummy identities.
   - Click **"Start Voting"**.
5. **Voting**:
   - Log in as one of the test users.
   - Cast your vote in the **Ballot** tab.

## 🚰 Sepolia ETH Faucets
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
