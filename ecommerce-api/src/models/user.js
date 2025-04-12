const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - displayName
 *         - userName
 *         - email
 *         - passwordHash
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         displayName:
 *           type: string
 *         userName:
 *           type: string
 *         email:
 *           type: string
 *         passwordHash:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, customer]
 *         avatar:
 *           type: string
 *         phone:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         isActive:
 *           type: boolean
 *           default: true
 *       example:
 *         id: 1234567890abcdef12345678
 *         displayName: John Doe
 *         userName: johndoe
 *         email: johndoe@example.com
 *         passwordHash: $2b$10$eImiTXuWVx0z8Z4g5J9T1O
 *         role: customer
 *         avatar: https://example.com/avatar.png
 *         phone: 1234567890
 *         dateOfBirth: '1990-01-01'
 *         isActive: true
 */

const userSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    phone: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
