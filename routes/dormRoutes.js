const express = require("express");
const router = express.Router();
const dormController = require("../controllers/dormController");

router.get("/", dormController.getAllDorms);
router.get("/:dormId", dormController.getDormById);
router.post("/:dormId", dormController.updateDorm);
router.put("/:dormId", dormController.updateDorm);

module.exports = router;
