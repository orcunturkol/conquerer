const {
  insertBlogPost,
  updateBlogPost,
  getBlogPostById,
  getCommentsByPostId,
  deleteBlogPostAndComments,
  getAllBlogPosts,
  getCommentsByUserId,
} = require("../models/blogModels");
const { insertComment } = require("../models/commentModels");
const sendResponse = require("../utils/responseUtil");
const sendErrorResponse = require("../utils/errorResponseUtil");
const FilterEnum = require("../enums/filter.enum");
const createBlogPost = async (req, res) => {
  const { userId } = req;
  const { title, content, category } = req.body;

  try {
    const newPost = await insertBlogPost(userId, title, content, category);
    return sendResponse(res, 201, true, "Blog post created successfully");
  } catch (error) {
    console.error(error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while creating blog post"
    );
  }
};

const updateBlogPostDetails = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;
  const { title, content, category } = req.body;

  try {
    await updateBlogPost(postId, userId, title, content, category);
    sendResponse(res, 200, true, "Blog post updated successfully");
  } catch (error) {
    console.error(error);
    sendErrorResponse(
      res,
      500,
      "An error occurred while updating the blog post"
    );
  }
};

const createComment = async (req, res) => {
  const { userId } = req;
  const { postId } = req.params;
  const { content } = req.body;
  // Check if the post exists
  const post = await getBlogPostById(postId);
  if (!post) {
    return sendErrorResponse(res, 404, "Post not found");
  }

  try {
    await insertComment(userId, postId, content);
    return sendResponse(res, 201, true, "Comment created successfully");
  } catch (error) {
    console.error(error);
    return sendErrorResponse(
      res,
      500,
      "An error occurred while creating comment"
    );
  }
};

const getBlogPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const blogPost = await getBlogPostById(postId);
    if (!blogPost) {
      return sendErrorResponse(res, 404, "Blog post not found");
    }

    const comments = await getCommentsByPostId(postId);
    blogPost.comments = comments;

    sendResponse(res, 200, true, "Blog post retrieved successfully", blogPost);
  } catch (error) {
    console.error(error); // For debugging
    sendErrorResponse(
      res,
      500,
      "An error occurred while retrieving the blog post"
    );
  }
};

const deleteBlogPost = async (req, res) => {
  const { postId } = req.params;

  try {
    await deleteBlogPostAndComments(postId);
    sendResponse(
      res,
      200,
      true,
      "Blog post and associated comments deleted successfully"
    );
  } catch (error) {
    console.error(error); // For debugging
    sendErrorResponse(
      res,
      500,
      "An error occurred while deleting the blog post"
    );
  }
};

const getAllPosts = async (req, res) => {
  const { filter, category } = req.query;
  const userId = req.userId;

  try {
    let filterOption = null;

    // Match the filter query to the corresponding enum value
    switch (filter) {
      case FilterEnum.MY_POSTS:
        filterOption = "my_posts";
        break;
      case FilterEnum.MY_COMMENTS:
        filterOption = "my_comments";
        const comments = await getCommentsByUserId(userId);
        console.log(comments);
        return sendResponse(
          res,
          200,
          true,
          "Comments retrieved successfully",
          comments
        );
      case FilterEnum.LAST_POSTS:
        filterOption = "last_posts";
        break;
      default:
        // If filter is not in enum, it's either undefined or an invalid value
        if (filter) {
          return sendErrorResponse(res, 400, "Invalid filter option");
        }
    }

    const posts = await getAllBlogPosts(filterOption, category, userId);
    sendResponse(res, 200, true, "Blog posts retrieved successfully", posts);
  } catch (error) {
    console.error(error); // For debugging purposes
    sendErrorResponse(
      res,
      500,
      "An error occurred while retrieving blog posts"
    );
  }
};

module.exports = {
  createBlogPost,
  updateBlogPostDetails,
  createComment,
  getBlogPost,
  deleteBlogPost,
  getAllPosts,
};
