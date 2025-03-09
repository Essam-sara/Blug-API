const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  console.log('Authorization header received:', req.headers["authorization"]);

  if (!token) {
    console.log('No token provided');
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Invalid token:', err);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = auth;
