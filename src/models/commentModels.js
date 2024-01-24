const pool = require("../config/dbConfig");

const insertComment = async (userId, postId, content) => {
  const query = `
    INSERT INTO comments (user_id, post_id, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, postId, content];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertComment,
};
