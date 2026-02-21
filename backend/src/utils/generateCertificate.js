const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = async (
  reg,
  event,
  organizer,
  member,
  tokenId,
  position,
  metadataURI
) => {
  const dirPath = path.join(__dirname, "../certificates");
  const ipfsHash = metadataURI.split("/").pop();

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const filePath = path.join(dirPath, `${member._id}.pdf`);
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  doc.pipe(fs.createWriteStream(filePath));

  // ================= BORDER =================
  doc
    .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .lineWidth(4)
    .stroke("#1e3a8a");

  doc.moveDown(1);

  // ================= TITLE =================
  doc
    .fontSize(36)
    .fillColor("#1e3a8a")
    .text("CERTIFICATE OF ACHIEVEMENT", {
      align: "center",
    });

  doc.moveDown(1);

  doc
    .fontSize(18)
    .fillColor("black")
    .text("This certificate is proudly presented to", {
      align: "center",
    });

  doc.moveDown(1);

  // ================= PARTICIPANT NAME =================
  doc
    .fontSize(30)
    .fillColor("#b91c1c")
    .text(member.name.toUpperCase(), {
      align: "center",
      underline: true,
    });

  doc.moveDown(1);

  // ================= POSITION / PARTICIPATION =================
  const awardText = position
    ? `for securing ${position} Position`
    : "for successful participation";

  doc
    .fontSize(18)
    .fillColor("black")
    .text(`${awardText} in the event`, {
      align: "center",
    });

  doc.moveDown(1);

  // ================= EVENT DETAILS =================
  doc
    .fontSize(22)
    .fillColor("#111827")
    .text(event.title, {
      align: "center",
    });

  doc.moveDown(1);

  doc
    .fontSize(16)
    .fillColor("black")
    .text(`Category: ${event.category.toUpperCase()}`, {
      align: "center",
    });

  doc.moveDown(1);

  doc.text(
    `Held on ${new Date(event.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })} at ${event.venue}`,
    { align: "center" }
  );

  doc.moveDown(1);

  doc
    .fontSize(16)
    .fillColor("#374151")
    .text(`Conducted by ${organizer.organizationName}`, {
      align: "center",
    });

  // ================= FOOTER =================

   doc.moveDown(1);



  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text(
      "This certificate is blockchain-verified and tamper-proof.",
      { align: "center" }
    );

  doc
    .fontSize(9)
    .fillColor("#6b7280")
    .text(
      `Verify certificate using ${ipfsHash} on the SportChain platform.`,
      {
        align: "center",
      }
    );

  doc.end();

  return filePath;
};

module.exports = generatePDF;