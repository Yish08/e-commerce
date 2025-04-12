const express = require("express");
const connectDB = require("./src/config/database");
const errorHandler = require("./src/middlewares/errorHandler");
const swaggerMiddleware = require("./src/middlewares/swagger");
const routes = require("./src/routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

// Middleware for documentation
swaggerMiddleware(app);

// Routes
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
