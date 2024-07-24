const express = require("express");
const router = express.Router();
const potionController = require("../controllers/potionController");

router.get("/potions/:dormId", potionController.getPotionsByDormId);
router.post("/potions/:dormId", potionController.addPotion);
router.delete("/potions/:dormId", potionController.deletePotion);

module.exports = router;
