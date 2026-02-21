const { ethers } = require("ethers");
const provider = require("./provider");

const adminWallet = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY,
  provider
);

module.exports = adminWallet;
