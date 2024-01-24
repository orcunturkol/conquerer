const bcrypt = require("bcrypt");
const {
  createUser,
  findUserByEmail,
  updateUser,
  resetPassword,
  findUserById,
} = require("../models/userModels");
const { updateSessionTimestamp } = require("../utils/jwtHelper");
const sendResponse = require("../utils/responseUtil");
const sendErrorResponse = require("../utils/errorResponseUtil");
const { updateSessionIdentifier } = require("../utils/authHelper");
const logger = require("../utils/winstonLogger");
const registerUser = async (req, res) => {
  const { email, password, fullname } = req.body;
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      sendErrorResponse(res, 400, "User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const newUser = await createUser(email, hashedPassword, fullname);

    // Generate JWT token
    const token = await updateSessionIdentifier(newUser);

    await updateSessionTimestamp(newUser.id);
    sendResponse(res, 201, true, "User created successfully", {
      token,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "An error occurred while registering user");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate user's credentials
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendErrorResponse(res, 400, "Invalid credentials");
    }

    const token = await updateSessionIdentifier(user);

    return sendResponse(res, 200, true, "User logged in successfully", {
      token,
    });
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while logging in user"
    );
  }
};

const updateUserDetails = async (req, res) => {
  const { userId } = req;
  const { fullname, username, birthday } = req.body;

  try {
    await updateUser(userId, fullname, username, birthday);
    sendResponse(res, 200, true, "User details updated successfully");
  } catch (error) {
    sendErrorResponse(
      res,
      500,
      "An error occurred while updating user details"
    );
  }
};

const updatePassword = async (req, res) => {
  const { userId } = req;
  const { oldPassword, newPassword } = req.body;

  try {
    // Validate user's credentials
    const user = await findUserById(userId);
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return sendErrorResponse(res, 400, "Invalid credentials");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await resetPassword(userId, hashedPassword);
    sendResponse(res, 200, true, "Password updated successfully");
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while updating password"
    );
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserDetails,
  updatePassword,
};
