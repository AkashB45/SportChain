const crypto = require("crypto");

module.exports = (event) => {
  const data = `${event.title}|${event.date}|${event.organizerWallet}`;
  return crypto.createHash("sha256").update(data).digest("hex");
};
