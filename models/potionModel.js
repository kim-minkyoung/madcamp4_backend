const { getConnection } = require("../config/db");

const getPotionsByDormId = async (dormId) => {
  const connection = getConnection();
  const [rows] = await connection
    .promise()
    .query("SELECT * FROM potions WHERE dorm_id = ?", [dormId]);
  return rows;
};

const addPotion = async (dormId, potionName) => {
  const connection = getConnection();
  const [rows] = await connection
    .promise()
    .query("INSERT INTO potions (dorm_id, potion_name) VALUES (?, ?)", [
      dormId,
      potionName,
    ]);
  return rows[0];
};

const deletePotion = async (dormId, potionName) => {
  const connection = getConnection();
  const [rows] = await connection
    .promise()
    .query(
      "DELETE FROM potions WHERE potion_name = ? AND dorm_id = ? LIMIT 1",
      [potionName, dormId]
    );
  if (rows.affectedRows === 0) {
    throw new Error(
      "Potion not found or does not belong to the specified dorm"
    );
  }
};

module.exports = {
  getPotionsByDormId,
  addPotion,
  deletePotion,
};
