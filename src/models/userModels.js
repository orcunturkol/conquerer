const pool = require("../config/dbConfig");

const createUser = async (email, password, fullname) => {
  let username = fullname.toLowerCase().replace(/\s+/g, "");
  let isUserNameUnique = false;

  while (!isUserNameUnique) {
    const exists = await findUserByUserName(username);
    if (exists) {
      // Append a random number if username exists
      username = `${username}${Math.floor(Math.random() * 1000)}`;
    } else {
      isUserNameUnique = true; // Exit the loop if username is unique
    }
  }

  // Insert the new user with the unique username
  const result = await pool.query(
    "INSERT INTO users (email, password, fullname, username) VALUES ($1, $2, $3, $4) RETURNING *",
    [email, password, fullname, username]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const findUserByUserName = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

const updateUser = async (userId, fullname, username, birthday) => {
  // SQL query to update user details
  const query = `
    UPDATE users 
    SET fullname = $1, username = $2, birthday = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [fullname, username, birthday, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const resetPassword = async (userId, password) => {
  // SQL query to update user password
  const query = `
    UPDATE users 
    SET password = $1
    WHERE id = $2
    RETURNING *;
  `;
  const values = [password, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserById = async (userId) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUserName,
  updateUser,
  resetPassword,
  findUserById,
};
