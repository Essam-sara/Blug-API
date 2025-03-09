const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const auth = require("../middlewares/auth");  // استيراد الميدلوير auth


// POST /users/signup -> make a new user
// POST /users/login -> user login 
router.post("/signup", usersController.signup);
router.post("/login", usersController.login);


const restrictTo = require("../middlewares/restrictTo");

//only amin can gain the list of users 
router.get("/", auth, restrictTo("admin"), usersController.getUsers);


// GET /users/:id -> get a user by id
router.get("/:id", usersController.getUserById);
// PUT /users/:id -> update a user by id
router.put("/:id", usersController.updateUserById);
// DELETE /users/:id -> delete a user by id
router.delete("/:id", usersController.deleteUserById);

module.exports = router;
