const User = require("../models/User");
const APIError = require("../util/APIError");

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({ status: "success", data: { users } });
  } catch (err) {
    next(err); 
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Log incoming request body

    const { email, name, password, role, age, city } = req.body;

    // Check if the required fields are present
    if (!email || !name || !password || !age || !city) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required fields: email, name, password, age, and city are required.",
      });
    }

    // Check if email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "failure",
        message: "Email already exists",
      });
    }

    // Create a new user instance
    const newUser = new User({ email, name, password, role: role || "user", age, city });
    await newUser.save();

    res.status(201).json({ status: "success", data: { user: newUser } });
  } catch (err) {
    console.error("Error creating user:", err); // Log the error
    next(err); // Pass the error to the global error handler
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
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
