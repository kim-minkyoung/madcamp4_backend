const potionModel = require("../models/potionModel");

const getPotionsByDormId = async (req, res) => {
  try {
    const potions = await potionModel.getPotionsByDormId(req.params.dormId);
    res.json(potions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addPotion = async (req, res) => {
  try {
    const { potionName } = req.body;
    const dormId = req.params.dormId;
    const newPotionId = await potionModel.addPotion(dormId, potionName);
    res.status(201).json({ potionId: newPotionId });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deletePotion = async (req, res) => {
  try {
    const { potionName } = req.body;
    const dormId = req.params.dormId;
    await potionModel.deletePotion(dormId, potionName);
    res.status(200).send("Potion deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getPotionsByDormId,
  addPotion,
  deletePotion,
};
