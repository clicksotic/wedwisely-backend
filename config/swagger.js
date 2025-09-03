// config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0", // ✅ must be at the top level
    info: {
      title: "WedWisely API",
      version: "1.0.0",
      description: "API documentation for WedWisely Backend",
    },
    servers: [
      {
        url: "http://192.168.100.13:3000/api", // adjust this to your server
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, "../src/user/routes/*.js"),
    path.join(__dirname, "../src/profile/routes/*.js"),
    path.join(__dirname, "../src/event/routes/*.js"),
  ], // ✅ make sure this path matches your routes folder
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
