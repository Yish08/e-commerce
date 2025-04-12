const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errorHandler = require("../middlewares/errorHandler");

const generateToken = (userId, userName, role) => {
  return jwt.sign({ userId, userName, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const checkUserExists = async (email) => {
  return (user = await User.findOne({ email }));
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

exports.register = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const displayName = userName;
  const role = "customer";

  try {
    const userExists = await checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = new User({
      userName,
      email,
      passwordHash,
      displayName,
      role,
    });
    await newUser.save();

    res.status(201).send({ newUser });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await checkUserExists(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.userDisplayName, user.role);

    res.status(200).json({ token });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 * */
