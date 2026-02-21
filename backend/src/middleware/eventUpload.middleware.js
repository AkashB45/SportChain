const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sportchain/events",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

module.exports = multer({ storage });
