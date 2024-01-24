const pool = require("./dbConfig");
const logger = require("../utils/winstonLogger");
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
    logger.info("Users table created successfully");
  } catch (error) {
    logger.error("Error creating users table", error);
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
    logger.info("Sessions table created successfully");
  } catch (error) {
    logger.error("Error creating sessions table", error);
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
    deleted_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );`;

  try {
    await pool.query(queryText);
    logger.info("Blog posts table created successfully");
  } catch (error) {
    logger.error("Error creating blog posts table", error);
  }
};

const createCommentsTable = async () => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    post_id SERIAL NOT NULL,
    content TEXT NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id)
);

    `;

  try {
    await pool.query(queryText);
    logger.info("Comments table created successfully");
  } catch (error) {
    logger.error("Error creating comments table", error);
  }
};

module.exports = {
  createUsersTable,
  createSessionsTable,
  createBlogsPostsTable,
  createCommentsTable,
};
