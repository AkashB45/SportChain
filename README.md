# 🏆 SportChain  
### 🚀 Blockchain-Powered Sports Event Ecosystem  

> Secure • Transparent • NFT Certified • Web3 Enabled  

---

## 🌐 Live Application

🔗 https://sportschain.vercel.app/


---

# 📌 Overview

SportsChain is a full-stack Web3 sports event management platform that integrates blockchain technology to ensure secure, transparent, and tamper-proof event certification.

The platform enables:

- 🏟 Organizers to host and manage sports events
- 👤 Participants to register and attend events
- 🏅 NFT-based certificates for participation and winners
- 🔐 Blockchain-verified organizer identity
- 📜 IPFS-stored metadata for tamper-proof validation

SportsChain combines **Next.js, Node.js, MongoDB, Smart Contracts, and IPFS** into one secure sports ecosystem.

---

# 🎯 Key Features

## 👥 Role-Based System

### 👤 Participant
- Register for free or paid events
- Secure payment integration
- QR-based attendance verification
- Receive NFT certificate (Participation / Winner)

### 🏢 Organizer
- Create and manage events
- View registrations & revenue analytics
- Mark attendance
- Declare winners
- Mint NFT certificates
- Blockchain verification required before hosting

### 🛠 Admin
- Approve organizers
- Manage platform access
- Maintain system integrity

---

# 🔐 Security Architecture

SportsChain ensures strong security through:

- Clerk Authentication (JWT-based)
- Role-based API protection
- Organizer approval workflow
- Wallet ownership validation
- Blockchain hash verification
- NFT metadata stored on IPFS
- Smart contract verification
- Certificate tamper-proof validation

---

# 🧾 NFT Certificate System

Each certificate:

- Is minted as an NFT
- Has metadata stored on IPFS
- Contains blockchain transaction proof
- Can be verified using metadata hash
- Generates a downloadable PDF certificate

Verification includes:
- IPFS Metadata Hash
- NFT Token ID
- Blockchain record

---

# 🏗 System Architecture

```
User
 ↓
Vercel (Next.js Frontend)
 ↓
Render (Node.js Backend API)
 ↓
MongoDB Atlas
 ↓
Blockchain Network
 ↓
IPFS (Pinata)
```

---

# 🛠 Tech Stack

## Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Clerk Authentication
- Razorpay Integration
- Recharts (Analytics)

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- PDFKit
- Pinata IPFS

## Blockchain
- Solidity Smart Contract
- NFT Minting
- Wallet Verification
- Organizer On-Chain Validation

---

# 🚀 Local Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/AkashB45/sportchain.git
cd sportchain
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=
JWT_SECRET=
CLERK_SECRET_KEY=
PINATA_API_KEY=
PINATA_SECRET_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Run backend:

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

Run frontend:

```bash
npm run dev
```

---

# 🌍 Deployment Guide

## Frontend → Vercel
1. Connect GitHub repository
2. Add environment variables
3. Deploy

## Backend → Render
1. Add environment variables
2. Configure build & start commands
3. Deploy

## Database → MongoDB Atlas

---

# 🔒 Production Environment Variables

## Frontend

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

## Backend

```
MONGO_URI=
JWT_SECRET=
CLERK_SECRET_KEY=
PINATA_API_KEY=
PINATA_SECRET_KEY=
RAZORPAY_KEY_SECRET=
```

⚠ Never commit `.env` files to GitHub.

---

# 📊 Advanced Platform Features

- Revenue trend analytics
- Registration growth charts
- Low registration warning badges
- Smart organizer verification
- Blockchain identity proof
- NFT certificate issuance system
- Tamper-proof validation engine

---

# 🛡 Fraud Prevention Model

1. Organizer must be admin approved
2. Organizer must be blockchain verified
3. Wallet ownership required
4. Backend role validation enforced
5. NFT metadata hash stored on IPFS
6. Certificate verification checks blockchain record

---

# 📌 Future Enhancements

- DAO-based sports governance
- Multi-chain NFT minting
- Soulbound achievement NFTs
- Decentralized event voting
- Gas optimization
- On-chain athlete ranking system

---

# 👨‍💻 Author

**Akash B**  
Full Stack Developer | Blockchain Enthusiast | Web3 Builder  

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project:

- ⭐ Star the repository  
- 🔁 Share with others  
- 🤝 Contribute improvements  

---

> SportsChain — Redefining Sports with Blockchain.