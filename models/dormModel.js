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

const addScore = async (dormId, newScore) => {
  const connection = getConnection();
  const [currentScoreRows] = await connection
    .promise()
    .query("SELECT dorm_score FROM dorms WHERE dorm_id = ?", [dormId]);

  if (currentScoreRows.length === 0) {
    throw new Error("Dorm not found");
  }

  const currentScore = currentScoreRows[0].dorm_score || 0;
  const updatedScore = currentScore + newScore;

  const [result] = await connection
    .promise()
    .query("UPDATE dorms SET dorm_score = ? WHERE dorm_id = ?", [
      updatedScore,
      dormId,
    ]);

  return result;
};

const multiplyScore = async (dormId, factor) => {
  const connection = getConnection();
  const [currentScoreRows] = await connection
    .promise()
    .query("SELECT dorm_score FROM dorms WHERE dorm_id = ?", [dormId]);

  if (currentScoreRows.length === 0) {
    throw new Error("Dorm not found");
  }

  const currentScore = currentScoreRows[0].dorm_score || 0;
  const updatedScore = currentScore * factor;

  const [result] = await connection
    .promise()
    .query("UPDATE dorms SET dorm_score = ? WHERE dorm_id = ?", [
      updatedScore,
      dormId,
    ]);

  return result;
};

module.exports = {
  getAllDorms,
  getDormById,
  addScore,
  multiplyScore,
};
