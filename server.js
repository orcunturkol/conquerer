const express = require("express");

const app = express();
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./src/routes/userRoutes");
const swaggerSpec = require("./src/swaggerConfig");
const {
  createUsersTable,
  createActiveTokensTable,
} = require("./src/config/dbSetup");

createUsersTable()
  .then(createActiveTokensTable)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.use(express.json());
    // Swagger UI setup
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use("/api/users", userRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
