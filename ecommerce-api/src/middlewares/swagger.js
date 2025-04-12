const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../config/swaggerOptions");

module.exports = (app) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
