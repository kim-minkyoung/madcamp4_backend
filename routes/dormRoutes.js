const express = require("express");
const router = express.Router();
const dormController = require("../controllers/dormController");

router.get("/dorms", dormController.getAllDorms);
router.get("/dorms/:dormId", dormController.getDormById);
router.put("/dorms/:dormId", dormController.updateScore);

module.exports = router;
