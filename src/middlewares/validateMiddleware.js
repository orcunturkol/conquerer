const sendErrorResponse = require("../utils/errorResponseUtil");

const validateRegistration = (req, res, next) => {
  const { email, password, fullname } = req.body;

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendErrorResponse(res, 400, "Invalid email address");
  }

  // Password length validation
  if (!password || password.length < 8) {
    return sendErrorResponse(
      res,
      400,
      "Password must be at least 8 characters"
    );
  }
  // Password special character validation
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    return sendErrorResponse(
      res,
      400,
      "Password must contain at least one special character"
    );
  }

  // Validate fullname
  if (!fullname) {
    sendErrorResponse(res, 400, "Fullname is required");
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    sendErrorResponse(res, 400, "Email and password are required");
  }

  next();
};

const validateResetPassword = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  // Old Password Check (optional based on your requirements)
  if (!oldPassword) {
    return sendErrorResponse(res, 400, "Old password is required");
  }

  // New Password length validation
  if (!newPassword || newPassword.length < 8) {
    return sendErrorResponse(
      res,
      400,
      "New password must be at least 8 characters"
    );
  }

  // New Password special character validation
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(newPassword)) {
    return sendErrorResponse(
      res,
      400,
      "New password must contain at least one special character"
    );
  }

  // New password and old password should not be the same
  if (oldPassword === newPassword) {
    return sendErrorResponse(
      res,
      400,
      "New password should not be the same as old password"
    );
  }

  // Both of the password must be a type of string
  if (typeof oldPassword !== "string" || typeof newPassword !== "string") {
    return sendErrorResponse(res, 400, "Invalid password");
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const { fullname, username, birthday } = req.body;

  // Validate if there is full name and username they must be string values
  if (fullname && typeof fullname !== "string") {
    return sendErrorResponse(res, 400, "Invalid fullname");
  }

  if (username && typeof username !== "string") {
    return sendErrorResponse(res, 400, "Invalid username");
  }

  // Fullname must at least contain 2 words
  if (fullname && fullname.split(" ").length < 2) {
    return sendErrorResponse(
      res,
      400,
      "Fullname must contain at least 2 words"
    );
  }
  // Fullname must be at least 4 characters
  if (fullname && fullname.length < 4) {
    return sendErrorResponse(
      res,
      400,
      "Fullname must be at least 4 characters"
    );
  }
  // Username must be at least 4 characters
  if (username && username.length < 4) {
    return sendErrorResponse(
      res,
      400,
      "Username must be at least 4 characters"
    );
  }

  // Optional: Validate birthday format (e.g., YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (birthday && !dateRegex.test(birthday)) {
    return sendErrorResponse(
      res,
      400,
      "Invalid birthday format. Use YYYY-MM-DD."
    );
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateResetPassword,
  validateUpdate,
};
