const { getConnection } = require("../config/db");

const getAllUsers = async () => {
  const connection = getConnection();
  const [rows] = await connection.promise().query("SELECT * FROM users");
  return rows;
};

const getUserById = async (userId) => {
  const connection = getConnection();
  const [rows] = await connection
    .promise()
    .query("SELECT * FROM users WHERE user_id = ?", [userId]);
  return rows[0];
};

const createUser = async (user_name, user_dorm) => {
  const connection = getConnection();
  const [result] = await connection
    .promise()
    .query("INSERT INTO users (user_name, user_dorm) VALUES (?, ?)", [
      user_name,
      user_dorm,
    ]);
  return result.insertId;
};

const deleteUser = async (userId) => {
  const connection = getConnection();
  await connection
    .promise()
    .query("DELETE FROM dorms WHERE user_id = ?", [userId]);
  await connection
    .promise()
    .query("DELETE FROM users WHERE user_id = ?", [userId]);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
};
