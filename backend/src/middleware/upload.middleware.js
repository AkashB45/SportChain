const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === "application/pdf";

    return {
      folder: "sportchain/organizers",
      resource_type: "image",   // 🔥 ALWAYS image
      format: isPDF ? "pdf" : undefined,
    };
  },
});

module.exports = multer({ storage });
