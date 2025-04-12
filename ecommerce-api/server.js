const express = require("express");
const connectDB = require("./src/config/database");
const errorHandler = require("./src/middlewares/errorHandler");
const swaggerMiddleware = require("./src/middlewares/swagger");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");

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

// Middleware for logging errors
app.use(errorHandler);

app.use("/api", userRoutes);
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
