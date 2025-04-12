const jwt = require("jsonwebtoken");

const generateToken = (userId, userName, role) => {
  return jwt.sign({ userId, userName, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};
