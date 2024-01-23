const { generateToken } = require("../utils/jwtHelper");
const pool = require("../config/dbConfig");
const uuid = require("uuid");

const updateSessionIdentifier = async (user) => {
  const tokenIdentifier = uuid.v4(); // Generate a new UUID

  // Generate JWT token
  const token = generateToken(user.id, tokenIdentifier);
  const query = `
      INSERT INTO sessions (user_id, token_identifier) VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET token_identifier = EXCLUDED.token_identifier;
    `;
  await pool.query(query, [user.id, tokenIdentifier]);

  return token;
};

module.exports = {
  updateSessionIdentifier,
};
