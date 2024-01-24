const pool = require("./dbConfig");
const logger = require("../utils/winstonLogger");
const bcrypt = require("bcrypt");
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
const insertDummyUsers = async () => {
  const usersData = [
    {
      email: "alice@example.com",
      password: "password123!",
      fullname: "Alice Johnson",
      username: "alice2022",
    },
    {
      email: "bob@example.com",
      password: "password123!",
      fullname: "Bob Smith",
      username: "bobbyS",
    },
  ];
  const userIds = [];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const insertUserQuery = `
      INSERT INTO users (email, password, fullname, username)
      VALUES ($1, $2, $3, $4) RETURNING id
    `;
    const result = await pool.query(insertUserQuery, [
      userData.email,
      hashedPassword,
      userData.fullname,
      userData.username,
    ]);
    userIds.push(result.rows[0].id);
  }

  logger.info("Dummy users inserted successfully");
  return userIds;
};

const insertDummyBlogPosts = async (userIds) => {
  const blogPosts = [
    {
      userId: userIds[0],
      category: "Technology",
      title: "Exploring Node.js",
      content: "Node.js is a powerful JavaScript runtime...",
    },
    {
      userId: userIds[1],
      category: "Business",
      title: "Starting a Startup",
      content: "The journey of starting a new business...",
    },
  ];
  const postIds = [];

  for (const post of blogPosts) {
    const insertPostQuery = `
      INSERT INTO blog_posts (user_id, category, title, content)
      VALUES ($1, $2, $3, $4) RETURNING id
    `;
    const result = await pool.query(insertPostQuery, [
      post.userId,
      post.category,
      post.title,
      post.content,
    ]);
    postIds.push(result.rows[0].id);
  }

  logger.info("Dummy blog posts inserted successfully");
  return postIds;
};

const insertDummyComments = async (userIds, postIds) => {
  const comments = [
    {
      userId: userIds[0],
      postId: postIds[0],
      content: "Great article on Node.js!",
    },
    {
      userId: userIds[1],
      postId: postIds[1],
      content: "Very insightful, thanks for sharing.",
    },
  ];

  for (const comment of comments) {
    const insertCommentQuery = `
      INSERT INTO comments (user_id, post_id, content)
      VALUES ($1, $2, $3)
    `;
    await pool.query(insertCommentQuery, [
      comment.userId,
      comment.postId,
      comment.content,
    ]);
  }

  logger.info("Dummy comments inserted successfully");
};

module.exports = {
  createUsersTable,
  createSessionsTable,
  createBlogsPostsTable,
  createCommentsTable,
  insertDummyUsers,
  insertDummyBlogPosts,
  insertDummyComments,
};
