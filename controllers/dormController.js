const dormModel = require("../models/dormModel");

const getAllDorms = async (req, res) => {
  try {
    const dorms = await dormModel.getAllDorms();
    res.json(dorms);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getDormById = async (req, res) => {
  try {
    const dorm = await dormModel.getDormById(req.params.dormId);
    if (dorm) {
      res.json(dorm);
    } else {
      res.status(404).send("Dorm not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateScore = async (req, res) => {
  try {
    const { dormScore } = req.body;
    const dormId = req.params.dormId;

    await dormModel.updateScore(dormId, dormScore);
    res.status(200).send("Dorm updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllDorms,
  getDormById,
  updateScore,
};
