const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const { userName, userPassword, userDorm } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const user = await userModel.createUser(userName, hashedPassword, userDorm);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
