const User = require("../models/User");
const APIError = require("../util/APIError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({ status: "success", data: { users } });
  } catch (err) {
    next(err); 
  }
};

const signup = async (req, res, next) => {
  const { name, email, password, passwordConfirm, age, city } = req.body;

  // التحقق من تطابق كلمة المرور
  console.log('Signup request received with data:', req.body);

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      city
    });

    console.log('New user created:', newUser);

    res.status(201).json({
      status: "success",
      data: { user: newUser }
    });
  } catch (err) {
    console.error("Error during signup:", err);
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  console.log('Login request received with email:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials: User not found');
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials: Password mismatch');
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log('JWT token generated successfully');

    res.status(200).json({
      status: "success",
      token
    });
  } catch (err) {
    console.error("Error during login:", err);
    next(err);
  }
};
// Get a user by ID
const getUserById = async (req, res, next) => {
  try {
    // Find user by ID in MongoDB
    const user = await User.findById(req.params.id); 

    if (!user) {
      // If user is not found, throw an error
      throw new APIError(`User with ID: ${req.params.id} not found`, 404);
    }

    res.status(200).json({ status: "success", data: { user } });
  } catch (err) {
    next(err);
  }
};

// Update a user by ID
const updateUserById = async (req, res, next) => {
  try {
    // Update user by ID using MongoDB's findByIdAndUpdate method
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Options to return the updated user and validate input
    );

    if (!updatedUser) {
      throw new APIError(`User with ID: ${req.params.id} not found`, 404);
    }

    res.status(200).json({ status: "success", data: { user: updatedUser } });
  } catch (err) {
    next(err);
  }
};

// Delete a user by ID
const deleteUserById = async (req, res, next) => {
  try {
    // Delete the user from MongoDB by ID
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      throw new APIError(`User with ID: ${req.params.id} not found`, 404);
    }

    res.status(204).send(); // No content in response as user is deleted
  } catch (err) {
    next(err);
  }
};

module.exports = {
  
  signup,
  login,
  getUsers,

  getUserById,
  updateUserById,
  deleteUserById,
};
