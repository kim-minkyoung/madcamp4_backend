const dormModel = require("../models/dormModel");

const getAllDorms = async (req, res) => {
  try {
    const dorms = await dormModel.getAllDorms();
    res.json(dorms);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getDormById = async (dormId) => {
  const connection = getConnection();
  const [dormRows] = await connection
    .promise()
    .query("SELECT * FROM dorms WHERE dorm_id = ?", [dormId]);

  if (dormRows.length === 0) {
    return null;
  }

  const [userRows] = await connection
    .promise()
    .query("SELECT user_name FROM users WHERE dorm_id = ?", [dormId]);

  return {
    ...dormRows[0],
    students: userRows.map((row) => row.user_name),
  };
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
