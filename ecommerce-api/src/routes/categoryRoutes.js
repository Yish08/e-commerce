const express = require("express");
const categoryController = require("../controllers/categoryController");
const { param, body, query } = require("express-validator");
const validate = require("../middlewares/validation");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/category",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
  ],
  authMiddleware,
  validate,
  categoryController.getAllCategories
);

module.exports = router;
