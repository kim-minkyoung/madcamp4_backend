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

const createUser = async (userName, hashedPassword, userDorm) => {
  const connection = getConnection();
  const [rows] = await connection
    .promise()
    .query(
      "INSERT INTO users (user_name, user_password, dorm_id) VALUES (?, ?, ?)",
      [userName, hashedPassword, userDorm]
    );
  return rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
