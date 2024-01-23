const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const scrypt = promisify(crypto.scrypt);
const pool = require("../config/dbConfig");

const generateToken = (userId, tokenIdentifier) => {
  return jwt.sign(
    {
      userId,
      tokenIdentifier,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const encryptToken = async (token) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const encrypted = await scrypt(token, salt, 64);
  return `${salt}:${encrypted.toString("hex")}`;
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const updateSessionTimestamp = async (userId) => {
  const query = `
    INSERT INTO sessions (user_id) VALUES ($1)
    ON CONFLICT (user_id) DO UPDATE SET last_active = CURRENT_TIMESTAMP;
  `;
  await pool.query(query, [userId]);
};

module.exports = {
  generateToken,
  verifyToken,
  encryptToken,
  hashToken,
  updateSessionTimestamp,
};
