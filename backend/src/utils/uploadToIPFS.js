const axios = require("axios");

const uploadToIPFS = async (metadata) => {
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  } catch (error) {
    console.error("IPFS Upload Error:", error.response?.data || error.message);
    throw new Error("Failed to upload metadata to IPFS");
  }
};

module.exports = uploadToIPFS;
