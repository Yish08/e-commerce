const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validation");

const router = express.Router();

router.post(
  "/register",
  [
    body("userName").notEmpty().withMessage("User name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validate,
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  authController.login
);

module.exports = router;
