const express = require("express");

const app = express();
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./src/routes/userRoutes");
const swaggerSpec = require("./src/swaggerConfig");
const {
  createUsersTable,
  createSessionsTable,
  createBlogsPostsTable,
  createCommentsTable,
} = require("./src/config/dbSetup");
const blogRoutes = require("./src/routes/blogRoutes");
const logger = require("./src/utils/winstonLogger");

createUsersTable()
  .then(createSessionsTable)
  .then(createBlogsPostsTable)
  .then(createCommentsTable)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.use(express.json());
    // Swagger UI setup
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use("/api/users", userRoutes);
    app.use("/api/blogs", blogRoutes);
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  });
