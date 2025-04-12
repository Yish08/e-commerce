const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

exports.register = async (req, res) => {
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
    next(error);
  }
};

exports.login = async (req, res) => {
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
    next(error);
  }
};
