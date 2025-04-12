const User = require("../models/user");
const errorHandler = require("../middlewares/errorHandler");

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

exports.createUser = async (req, res, next) => {
  const { userName, email, password, displayName, role } = req.body;

  const passwordHash = await hashPassword(password);

  try {
    const newUser = new User({
      userName,
      email,
      passwordHash,
      displayName,
      role,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userName, email, password, displayName, role } = req.body;

    const passwordHash = await hashPassword(password);

    const updatedUser = {
      userName,
      email,
      passwordHash,
      displayName,
      role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};
