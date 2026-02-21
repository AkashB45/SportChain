require("dotenv").config();
const contract = require("./contract");

(async () => {
  const isVerified = await contract.isOrganizerVerified(
    "0x0000000000000000000000000000000000000000"
  );
  console.log("Verified:", isVerified);
})();
