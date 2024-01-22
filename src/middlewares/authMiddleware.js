const { verifyToken, encryptToken } = require("../utils/jwtHelper");

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).send("No token provided");
  }

  try {
    const decoded = verifyToken(token);
    const encryptedToken = await encryptToken(token);

    // Check if the token matches the encrypted token in the database
    const result = await pool.query(
      "SELECT * FROM active_tokens WHERE user_id = $1 AND token = $2",
      [decoded.userId, encryptedToken]
    );
    if (result.rows.length === 0) {
      throw new Error("Token is not active");
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).send("Invalid or expired token");
  }
};

module.exports = {
  authenticateToken,
};
