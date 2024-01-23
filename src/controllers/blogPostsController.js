const createBlogPost = async (req, res) => {
  const { userId } = req;
  const { title, content } = req.body;

  try {
    await insertBlogPost(userId, title, content);
    sendResponse(res, 200, true, "Blog post created successfully");
  } catch (error) {
    sendErrorResponse(res, 500, "An error occurred while creating blog post");
  }
};

module.exports = {
  createBlogPost,
};
