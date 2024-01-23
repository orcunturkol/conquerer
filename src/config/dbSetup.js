const pool = require("./dbConfig");

const createUsersTable = async () => {
  const queryText = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      fullname VARCHAR(255) NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      birthday DATE
    )`;

  try {
    await pool.query(queryText);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table", error);
  }
};

const createSessionsTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id UUID UNIQUE NOT NULL,
      last_active TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      token_identifier UUID,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`;

  try {
    await pool.query(queryText);
    console.log("Sessions table created successfully");
  } catch (error) {
    console.error("Error creating sessions table", error);
  }
};

const createBlogsPostsTable = async () => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    category VARCHAR(255) NOT NULL CHECK (category IN ('Artificial Intelligence', 'Business', 'Money', 'Technology')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );`;

  try {
    await pool.query(queryText);
    console.log("Blog posts table created successfully");
  } catch (error) {
    console.error("Error creating blog posts table", error);
  }
};

module.exports = {
  createUsersTable,
  createSessionsTable,
  createBlogsPostsTable,
};
