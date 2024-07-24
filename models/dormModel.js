const { getConnection } = require("../config/db");

const getAllDorms = async () => {
  const connection = getConnection();
  const [rows] = await connection.promise().query("SELECT * FROM dorms");
  return rows;
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

const updateScore = async (dormId, dormScore) => {
  const connection = getConnection();
  const [rows] = await connection
    .promise()
    .query("UPDATE dorms SET dorm_score = ? WHERE dorm_id = ?", [
      dormScore,
      dormId,
    ]);
  return rows[0];
};

module.exports = {
  getAllDorms,
  getDormById,
  updateScore,
};
