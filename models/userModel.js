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

  try {
    await connection.promise().query("START TRANSACTION");

    const [userResult] = await connection
      .promise()
      .query("INSERT INTO users (user_name, user_dorm) VALUES (?, ?)", [
        user_name,
        user_dorm,
      ]);

    const userId = userResult.insertId;

    // dorms 테이블에 기본 dorm 항목 추가 쿼리
    await connection
      .promise()
      .query(
        "INSERT INTO dorms (dorm_id, dorm_type, user_id) VALUES (?, ?, ?)",
        [
          userId, // dorm_id로 user_id를 사용
          user_dorm, // dorm_type은 사용자 dorm 정보와 동일하게 설정
          userId, // user_id는 새로 생성된 사용자 ID
        ]
      );

    // 트랜잭션 커밋
    await connection.promise().query("COMMIT");

    // 새로 생성된 사용자 정보 조회
    const [userRows] = await connection
      .promise()
      .query("SELECT * FROM users WHERE user_id = ?", [userId]);

    return userRows[0];
  } catch (error) {
    // 오류 발생 시 트랜잭션 롤백
    await connection.promise().query("ROLLBACK");
    console.error("사용자 생성 실패:", error.message);
    throw error; // 호출자에게 오류를 전달
  } finally {
    connection.end(); // 연결 종료
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
