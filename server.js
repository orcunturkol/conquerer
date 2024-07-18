const express = require("express");
const pool = require("./src/config/dbConfig");
const app = express();
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./src/routes/userRoutes");
const swaggerSpec = require("./src/swaggerConfig");
const {
  createUsersTable,
  createSessionsTable,
  createBlogsPostsTable,
  createCommentsTable,
  insertDummyUsers,
  insertDummyBlogPosts,
  insertDummyComments,
} = require("./src/config/dbSetup");
const blogRoutes = require("./src/routes/blogRoutes");
const logger = require("./src/utils/winstonLogger");
const elasticSearchRoutes = require("./src/routes/elasticSearchRoutes");

createUsersTable()
  .then(createSessionsTable)
  .then(createBlogsPostsTable)
  .then(createCommentsTable)
  .then(() => pool.query("SELECT COUNT(*) FROM users"))
  .then((result) => {
    if (result.rows[0].count === "0") {
      return insertDummyUsers();
    } else {
      return [];
    }
  })
  .then((userIds) => {
    if (userIds.length > 0) {
      return insertDummyBlogPosts(userIds).then((postIds) => ({
        userIds,
        postIds,
      }));
    } else {
      return { userIds, postIds: [] };
    }
  })
  .then(({ userIds, postIds }) => {
    if (postIds.length > 0) {
      return insertDummyComments(userIds, postIds);
    }
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.use(express.json());
    // Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use("/api/users", userRoutes);
    app.use("/api/blogs", blogRoutes);
    app.use("/api/elastic", elasticSearchRoutes);
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  });
