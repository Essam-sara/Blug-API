const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const auth = require("../middlewares/auth");

// مسار للحصول على كل المنشورات
router.get("/", auth, postsController.getPosts);

// مسار لإنشاء منشور جديد
router.post("/", auth, postsController.createPost);

// مسار للحصول على منشور حسب ID
router.get("/:id", auth, postsController.getPostById);

// مسار لتحديث منشور
router.put("/:id", auth, postsController.updatePostById);

// مسار لحذف منشور
router.delete("/:id", auth, postsController.deletePostById);

module.exports = router;
