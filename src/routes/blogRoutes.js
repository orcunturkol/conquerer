const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  createBlogPost,
  updateBlogPostDetails,
  createComment,
  getBlogPost,
  deleteBlogPost,
  getAllPosts,
} = require("../controllers/blogPostsController");
const {
  validateBlogPost,
  validateUpdateBlogPost,
  validateComment,
} = require("../middlewares/validateMiddleware");
router.post("/create", authenticateToken, validateBlogPost, createBlogPost);
router.put(
  "/update/:postId",
  authenticateToken,
  validateUpdateBlogPost,
  updateBlogPostDetails
);
router.delete("/:postId", authenticateToken, deleteBlogPost);
router.get("/:postId", authenticateToken, getBlogPost);
router.post(
  "/comment/:postId",
  authenticateToken,
  validateComment,
  createComment
);
router.get("/", authenticateToken, getAllPosts);
module.exports = router;
