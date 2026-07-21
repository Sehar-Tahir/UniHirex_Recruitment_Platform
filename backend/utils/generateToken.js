const crypto = require("crypto");

// Generates a random token to email to the user, plus a hashed version to store in the DB.
// We never store the raw token — only its hash — same principle as password hashing:
// if the database were ever compromised, stored tokens alone couldn't be used.
function generateSecureToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashedToken };
}

module.exports = generateSecureToken;