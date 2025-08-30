// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for WedWisely Backend",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // adjust if you use another base URL
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
    security: [{ bearerAuth: [] }], // applies auth globally
  },
  apis: ["./routes/*.js"], // your route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
