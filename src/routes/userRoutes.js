const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserDetails,
  updatePassword,
} = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
  validateResetPassword,
  validateUpdate,
} = require("../middlewares/validateMiddleware");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.put("/update", authenticateToken, validateUpdate, updateUserDetails);
router.put(
  "/reset-password",
  authenticateToken,
  validateResetPassword,
  updatePassword
);
module.exports = router;
