const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModels");
const { generateToken, encryptToken } = require("../utils/jwtHelper");
const pool = require("../config/dbConfig");

const registerUser = async (req, res) => {
  const { email, password, fullname } = req.body;
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const newUser = await createUser(email, hashedPassword, fullname);

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Encrypt the token
    const encryptedToken = await encryptToken(token);
    // Save the active token in the database
    await pool.query(
      "INSERT INTO active_tokens (user_id, token) VALUES ($1, $2)",
      [newUser.id, encryptedToken]
    );

    res.status(201).send({ userId: newUser.id, token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in registration");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate user's credentials
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("Invalid credentials");
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Encrypt the token
    const encryptedToken = await encryptToken(token);

    // Save or update the active token in the database
    await pool.query(
      "INSERT INTO active_tokens (user_id, token) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token",
      [user.id, encryptedToken]
    );

    res.status(200).send({ userId: user.id, token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in login");
  }
};

module.exports = {
  registerUser,
  loginUser,
};
