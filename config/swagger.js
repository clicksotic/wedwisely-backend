// config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const { getServerConfig, currentEnvironment } = require("./index"); // 👈 import config

const serverConfig = getServerConfig();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WedWisely API",
      version: "1.0.0",
      description: "API documentation for WedWisely Backend",
    },
    servers: [
      {
        url: `http://${serverConfig.host}:${serverConfig.port}/api`, // �� dynamic from config
        description: `${currentEnvironment} server`,
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
    path.join(__dirname, "../src/auth/routes/*.js"),
    path.join(__dirname, "../src/profile/routes/*.js"),
    path.join(__dirname, "../src/event/routes/*.js"),
    path.join(__dirname, "../src/services/routes/*.js"),
    path.join(__dirname, "../src/services-media/routes/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
