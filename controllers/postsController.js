const Post = require("../models/Post");
const APIError = require("../util/APIError");

// Get all posts
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ status: "success", data: { posts } });
  } catch (err) {
    next(err);
  }
};

// Create a new post
const createPost = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Log the request body

    const newPost = new Post(req.body);  // Create a new post using the request body
    await newPost.save();  // Save the post to the database

    res.status(201).json({ status: "success", data: { post: newPost } });  // Respond with the post
  } catch (err) {
    console.error("Error creating post:", err);  // Log any error
    next(err);  // Pass the error to the global error handler
  }
};


// Get post by ID
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new APIError(`Post with id: ${req.params.id} not found`, 404);
    }
    res.status(200).json({ status: "success", data: { post } });
  } catch (err) {
    next(err);
  }
};

// Update post by ID
const updatePostById = async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedPost) {
      throw new APIError(`Post with id: ${req.params.id} not found`, 404);
    }
    res.status(200).json({ status: "success", data: { post: updatedPost } });
  } catch (err) {
    next(err);
  }
};

// Delete post by ID
const deletePostById = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      throw new APIError(`Post with id: ${req.params.id} not found`, 404);
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
};
