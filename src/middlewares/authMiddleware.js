const { verifyToken } = require("../utils/jwtHelper");
const pool = require("../config/dbConfig");
const sendErrorResponse = require("../utils/errorResponseUtil");
const logger = require("../utils/winstonLogger");
const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendErrorResponse(res, 401, "No token provided");
  }

  try {
    const decoded = verifyToken(token);
    // Check the token identifier against the sessions table
    const sessionResult = await pool.query(
      "SELECT token_identifier FROM sessions WHERE user_id = $1",
      [decoded.userId]
    );
    if (
      sessionResult.rows.length === 0 ||
      sessionResult.rows[0].token_identifier !== decoded.tokenIdentifier
    ) {
      return sendErrorResponse(res, 403, "Invalid or expired token");
    }

    // Continue with the request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(res, 403, "Invalid or expired token");
  }
};

module.exports = {
  authenticateToken,
};
