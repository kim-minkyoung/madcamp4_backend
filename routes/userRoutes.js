const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getAllUsers);
router.post("/users", userController.createUser);
router.delete("/users/:user_id", userController.deleteUser);

module.exports = router;
