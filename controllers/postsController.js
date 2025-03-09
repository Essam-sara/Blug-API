const Post = require("../models/Post");
const APIError = require("../util/APIError");

const getPosts = async (req, res, next) => {
  console.log('Fetching all posts...');
  try {
    const posts = await Post.find();
    console.log(`Found ${posts.length} posts`);
    res.status(200).json({ status: "success", data: { posts } });
  } catch (err) {
    console.error('Error fetching posts:', err);
    next(err);
  }
};

const createPost = async (req, res, next) => {
  console.log('Creating post with data:', req.body);
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    console.log('Post created successfully:', newPost);
    res.status(201).json({ status: "success", data: { post: newPost } });
  } catch (err) {
    console.error('Error creating post:', err);
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  console.log(`Fetching post with ID: ${req.params.id}`);
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

const updatePostById = async (req, res, next) => {
  console.log(`Updating post with ID: ${req.params.id}`);
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

const deletePostById = async (req, res, next) => {
  console.log(`Deleting post with ID: ${req.params.id}`);
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
