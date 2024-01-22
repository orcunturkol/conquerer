const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with JWT Authentication",
      version: "1.0.0",
      description: "This is a simple API using Express and JWT authentication",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./docs/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
