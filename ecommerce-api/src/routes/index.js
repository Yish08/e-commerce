const express = require("express");

const router = express.Router();

const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes");

router.use(authRoutes);
router.use(categoryRoutes);
router.use(userRoutes);

module.exports = router;
