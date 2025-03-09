const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

// GET /posts -> get all posts
router.get("/", postsController.getPosts);
// POST /posts -> create a new post
router.post("/", postsController.createPost);
// GET /posts/:id -> get a post by id
router.get("/:id", postsController.getPostById);
// PUT /posts/:id -> update a post by id
router.put("/:id", postsController.updatePostById);
// DELETE /posts/:id -> delete a post by id
router.delete("/:id", postsController.deletePostById);

module.exports = router;
