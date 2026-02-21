const { ethers } = require("ethers");
const mongoose = require("mongoose");
const fs = require("fs");

const SportChainCertificate = require("../blockchain/certificateAbi.json");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Organizer = require("../models/Organizer");
const EventWinner = require("../models/EventWinner");

const uploadToIPFS = require("../utils/uploadToIPFS");
const generatePDF = require("../utils/generateCertificate");
const sendEmail = require("../utils/sendMail");
const axios = require("axios");

// ===============================
// 🎓 GENERATE CERTIFICATES
// ===============================

const generateCertificates = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    // 1️⃣ Get event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // 2️⃣ Get organizer wallet
    const organizer = await Organizer.findOne({
      user: event.organizer,
    });

    if (!organizer?.walletAddress) {
      return res.status(400).json({
        error: "Organizer wallet address not configured",
      });
    }

    const organizerWallet = organizer.walletAddress;

    // 3️⃣ Get registrations
    const registrations = await Registration.find({
      event: eventId,
    });

    if (!registrations.length) {
      return res.json({
        success: true,
        message: "No registrations found",
        minted: 0,
      });
    }

    // 4️⃣ Blockchain setup
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      SportChainCertificate.abi,
      wallet
    );

    let mintedCount = 0;

    // 5️⃣ Loop registrations
    for (const reg of registrations) {

      // 🔥 Get winner record for this registration
      const winnerRecord = await EventWinner.findOne({
        event: eventId,
        registration: reg._id,
      });

      const winnerPosition = winnerRecord?.position || null;

      for (const member of reg.members) {

        if (!member.attended) continue;
        if (member.certificate?.tokenId) continue;

        // console.log("Generating certificate for:", member.name);

        const position = winnerPosition || "PARTICIPANT";

        // 6️⃣ Create NFT metadata
        const metadata = {
          name: `${member.name} - ${event.title}`,
          description: "Blockchain Verified SportChain Certificate",
          attributes: [
            { trait_type: "Participant", value: member.name },
            { trait_type: "Event", value: event.title },
            { trait_type: "Sport", value: event.sport },
            { trait_type: "Category", value: event.category },
            { trait_type: "Venue", value: event.venue },
            { trait_type: "Position", value: position },
          ],
        };

        const metadataURI = await uploadToIPFS(metadata);

        // 7️⃣ Mint NFT
        const tx = await contract.mintCertificate(
          organizerWallet,
          metadataURI
        );

        const receipt = await tx.wait();

        // 8️⃣ Extract tokenId
        let tokenId = null;

        for (const log of receipt.logs) {
          try {
            const parsedLog = contract.interface.parseLog(log);
            if (parsedLog.name === "Transfer") {
              tokenId = parsedLog.args.tokenId.toString();
              break;
            }
          } catch {
            continue;
          }
        }

        if (!tokenId) {
          throw new Error("Token ID not found in logs");
        }

        // 9️⃣ Generate PDF (PASS POSITION)
        const pdfPath = await generatePDF(
          reg,
          event,
          organizer,
          member,
          tokenId,
          position,
          metadataURI
        );

        // 🔟 Send Email
        try {
          await sendEmail(member.email, pdfPath, metadata,metadataURI);
          console.log("Email sent to:", member.email);
        } catch (mailError) {
          console.error("Email failed:", mailError.message);
        }

        // Delete PDF
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }

        // Save certificate info
        member.certificate = {
          tokenId,
          txHash: receipt.hash,
          metadataURI,
        };

        mintedCount++;
      }

      reg.certificateIssued = true;
      await reg.save();
    }

    return res.status(200).json({
      success: true,
      message: `${mintedCount} certificates generated successfully`,
      minted: mintedCount,
    });

  } catch (error) {
    console.error("Certificate Generation Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Certificate generation failed",
    });
  }
};


// ===============================
// 🔍 VERIFY CERTIFICATE
// ===============================


const verifyCertificate = async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || hash.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification hash format",
      });
    }

    const url = `https://ipfs.io/ipfs/${hash}`;

    const response = await axios.get(url, {
      timeout: 8000, // prevent hanging
      headers: {
        "User-Agent": "SportChain-Verification",
      },
    });

    const metadata = response.data;

    if (!metadata || !Array.isArray(metadata.attributes)) {
      return res.status(404).json({
        success: false,
        message: "Invalid certificate metadata structure",
      });
    }

    const attributes = {};
    metadata.attributes.forEach((attr) => {
      attributes[attr.trait_type] = attr.value;
    });

    return res.status(200).json({
      success: true,
      certificateHash: hash,
      name: metadata.name,
      description: metadata.description,
      participant: attributes["Participant"],
      event: attributes["Event"],
      sport: attributes["Sport"],
      category: attributes["Category"],
      venue: attributes["Venue"],
      position:
        attributes["Position"] &&
        attributes["Position"] !== "Participant"
          ? attributes["Position"]
          : "PARTICIPANT",
    });

  } catch (error) {

    // 🔥 Handle Rate Limit Separately
    if (error.response?.status === 429) {
      return res.status(503).json({
        success: false,
        message: "Verification service busy. Please try again in a few seconds.",
      });
    }

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    console.error("Verification Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again later.",
    });
  }
};



module.exports = {
  generateCertificates,
  verifyCertificate,
};
