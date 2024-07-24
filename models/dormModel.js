const { getConnection } = require("../config/db");

const getAllDorms = async () => {
  const connection = getConnection();
  const [rows] = await connection.promise().query("SELECT * FROM dorms");
  return rows;
};

const getDormById = async (dormId) => {
  const connection = getConnection();
  const [rows] = await connection
    .promise()
    .query("SELECT * FROM dorms WHERE dorm_id = ?", [dormId]);
  return rows[0];
};

const createDorm = async (dorm_type, user_id, quidditch_score) => {
  const connection = getConnection();
  const [result] = await connection
    .promise()
    .query(
      "INSERT INTO dorms (dorm_type, user_id, quidditch_score) VALUES (?, ?, ?)",
      [dorm_type, user_id, quidditch_score]
    );
  return result.insertId;
};

const updateDorm = async (dormId, dorm_type, user_id, quidditch_score) => {
  const connection = getConnection();
  await connection
    .promise()
    .query(
      "UPDATE dorms SET dorm_type = ?, user_id = ?, quidditch_score = ? WHERE dorm_id = ?",
      [dorm_type, user_id, quidditch_score, dormId]
    );
};

module.exports = {
  getAllDorms,
  getDormById,
  createDorm,
  updateDorm,
};
