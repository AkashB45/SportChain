const nodemailer = require("nodemailer");

const sendEmail = async (email, pdfBuffer, metadata, metadataURI) => {
  try {
    // Extract IPFS hash only
    const ipfsHash = metadataURI.split("/").pop();

    // Convert attributes array to object for easy access
    const attributes = {};
    metadata.attributes.forEach((attr) => {
      attributes[attr.trait_type] = attr.value;
    });

    const participantName = attributes["Participant"];
    const eventName = attributes["Event"];
    const sport = attributes["Sport"];
    const category = attributes["Category"];
    const venue = attributes["Venue"];
    const position = attributes["Position"];

    // Determine certificate type
    const isWinner =
      position &&
      position !== "Participant" &&
      position !== "-" &&
      position !== "";

    const certificateType = isWinner
      ? `${position} Position Winner`
      : "Participation";

    // Dynamic Subject
    const subject = isWinner
      ? `🏆 Congratulations ${participantName}! ${position} - ${eventName} Certificate`
      : `🎉 ${participantName}, Your Participation Certificate for ${eventName}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          
          <h2 style="color:#2c3e50;">Blockchain Verified Certificate Issued</h2>
          
          <p>Dear <strong>${participantName}</strong>,</p>
          
          <p>Your <strong>${certificateType} Certificate</strong> has been successfully issued for the event:</p>

          <table style="border-collapse: collapse; margin-top:15px;">
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><strong>Event</strong></td>
              <td style="padding:8px; border:1px solid #ddd;">${eventName}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><strong>Sport</strong></td>
              <td style="padding:8px; border:1px solid #ddd;">${sport}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><strong>Category</strong></td>
              <td style="padding:8px; border:1px solid #ddd;">${category}</td>
            </tr>
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><strong>Venue</strong></td>
              <td style="padding:8px; border:1px solid #ddd;">${venue}</td>
            </tr>
            ${
              isWinner
                ? `
            <tr>
              <td style="padding:8px; border:1px solid #ddd;"><strong>Position</strong></td>
              <td style="padding:8px; border:1px solid #ddd; color:green;"><strong>${position}</strong></td>
            </tr>`
                : ""
            }
          </table>

          <h3 style="margin-top:25px;">🔗 Blockchain Verification</h3>
          
          <p>Your certificate is permanently stored on the blockchain.</p>

          <p><strong>Verification Hash:</strong></p>
          <div style="background:#f4f4f4; padding:10px; border-radius:5px; word-break:break-all;">
            ${ipfsHash}
          </div>

          <p style="margin-top:10px;">
            👉 Copy the above hash and paste it in the <strong>Verification Page</strong> 
            of SportChain to verify your certificate on blockchain.
          </p>

          <p style="margin-top:25px;">
            Your official certificate PDF is attached to this email.
          </p>

          <hr style="margin-top:30px;" />

          <p style="font-size:12px; color:gray;">
            This is a blockchain verified NFT certificate issued by SportChain.
            Do not reply to this automated email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: "certificate.pdf",
          content: pdfBuffer,
        },
      ],
    });

    console.log("Certificate email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending certificate email:", error);
    throw error;
  }
};

module.exports = sendEmail;
