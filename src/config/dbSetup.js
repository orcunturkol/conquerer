const pool = require("./dbConfig");

const createUsersTable = async () => {
  const queryText = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      fullname VARCHAR(255) NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL
    )`;

  try {
    await pool.query(queryText);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table", error);
  }
};

const createActiveTokensTable = async () => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS active_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

  try {
    await pool.query(queryText);
    console.log("Active tokens table created successfully");
  } catch (error) {
    console.error("Error creating active tokens table", error);
  }
};

module.exports = {
  createUsersTable,
  createActiveTokensTable,
};
