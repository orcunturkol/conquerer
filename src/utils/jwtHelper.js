const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const scrypt = promisify(crypto.scrypt);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const encryptToken = async (token) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const encrypted = await scrypt(token, salt, 64);
  return `${salt}:${encrypted.toString("hex")}`;
};
module.exports = {
  generateToken,
  verifyToken,
  encryptToken,
};
