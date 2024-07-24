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

const updateDorm = async (req, res) => {
  try {
    const { dorm_type, user_id, quidditch_score } = req.body;
    const dormId = req.params.dormId;
    if (dormId) {
      await dormModel.updateDorm(dormId, dorm_type, user_id, quidditch_score);
      res.status(200).send();
    } else {
      const newDormId = await dormModel.createDorm(
        dorm_type,
        user_id,
        quidditch_score
      );
      res.status(201).json({ dormId: newDormId });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllDorms,
  getDormById,
  updateDorm,
};
