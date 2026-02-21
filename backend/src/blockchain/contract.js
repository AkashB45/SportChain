const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// 🔥 NEVER use Wallet.resolveName — use raw private key only
const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY.startsWith("0x")
    ? process.env.PRIVATE_KEY
    : "0x" + process.env.PRIVATE_KEY,
  provider
);

const abi = [
  "function verifyOrganizer(address organizer, bytes32 organizerHash)",
  "function isOrganizerVerified(address organizer) view returns (bool)",
  "function getOrganizerHash(address organizer) view returns (bytes32)",
  "function anchorEventHash(bytes32 eventHash)"
];

const contract = new ethers.Contract(
  process.env.SPORTCHAIN_CONTRACT_ADDRESS,
  abi,
  wallet
);

module.exports = contract;
