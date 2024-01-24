const pool = require("../config/dbConfig");
const sendErrorResponse = require("../utils/errorResponseUtil");
const FilterEnum = require("../enums/filter.enum");

const insertBlogPost = async (userId, title, content, category) => {
  const query = `
    INSERT INTO blog_posts (user_id, title, content, category)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [userId, title, content, category];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      "An error occurred while creating blog post"
    );
  }
};

const updateBlogPost = async (postId, userId, title, content, category) => {
  const query = `
    UPDATE blog_posts
    SET title = $1, content = $2, category = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 AND user_id = $5
    RETURNING *;
  `;
  const values = [title, content, category, postId, userId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const getBlogPostById = async (postId) => {
  const query = `
    SELECT * FROM blog_posts WHERE id = $1 AND deleted_at IS NULL;
  `;
  const values = [postId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const getCommentsByPostId = async (postId) => {
  const query = `
    SELECT * FROM comments WHERE post_id = $1 AND deleted_at IS NULL;
  `;
  const values = [postId];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const deleteBlogPostAndComments = async (postId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const currentTime = new Date().toISOString();

    // Mark comments as deleted
    const softDeleteCommentsQuery =
      "UPDATE comments SET deleted_at = $1 WHERE post_id = $2";
    await client.query(softDeleteCommentsQuery, [currentTime, postId]);

    // Mark the blog post as deleted
    const softDeletePostQuery =
      "UPDATE blog_posts SET deleted_at = $1 WHERE id = $2";
    await client.query(softDeletePostQuery, [currentTime, postId]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getCommentsByUserId = async (userId) => {
  const query = `
    SELECT * FROM comments WHERE user_id = $1 AND deleted_at IS NULL;
  `;
  const values = [userId];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getAllBlogPosts = async (filter, category, userId) => {
  let query = `
    SELECT p.id, p.title, p.category, u.username AS author,
           (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.deleted_at IS NULL) AS comment_count
    FROM blog_posts p
    INNER JOIN users u ON p.user_id = u.id AND p.deleted_at IS NULL
  `;

  let queryParams = [];

  switch (filter) {
    case FilterEnum.MY_POSTS:
      query += ` WHERE p.user_id = $1 AND p.deleted_at IS NULL`;
      queryParams.push(userId);
      break;
  }

  if (category) {
    const categoryCondition = `p.category = $${queryParams.length + 1}`;
    query +=
      queryParams.length > 0
        ? ` AND ${categoryCondition}`
        : ` WHERE ${categoryCondition}`;
    queryParams.push(category);
  }

  query += ` ORDER BY p.created_at DESC`;

  const result = await pool.query(query, queryParams);
  return result.rows;
};

module.exports = {
  getAllBlogPosts,
};

module.exports = {
  insertBlogPost,
  updateBlogPost,
  getBlogPostById,
  getCommentsByPostId,
  deleteBlogPostAndComments,
  getAllBlogPosts,
  getCommentsByUserId,
};
