require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const { Client } = require("ssh2");
const fs = require("fs");
const app = express();
const port = 8080;

const sshClient = new Client();
const dbServer = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
const tunnelConfig = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT || 22,
  username: process.env.SSH_USER,
  privateKey: fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH),
};
const forwardConfig = {
  srcHost: "127.0.0.1",
  srcPort: 3306,
  dstHost: dbServer.host,
  dstPort: 3306,
};

let connection;

// SSH 연결을 설정하고 MySQL 연결을 설정합니다.
sshClient
  .on("ready", () => {
    console.log("SSH Client :: ready");
    sshClient.forwardOut(
      forwardConfig.srcHost,
      forwardConfig.srcPort,
      forwardConfig.dstHost,
      forwardConfig.dstPort,
      (err, stream) => {
        if (err) {
          console.error("포워딩 에러: ", err);
          return;
        }

        // MySQL 연결 설정
        const connectionConfig = {
          ...dbServer,
          stream: stream,
        };

        connection = mysql.createConnection(connectionConfig);

        connection.connect((err) => {
          if (err) {
            console.error("MySQL 연결 실패: " + err.stack);
            return;
          }
          console.log(
            "MySQL에 연결되었습니다. 연결 ID: " + connection.threadId
          );
        });
      }
    );
  })
  .connect(tunnelConfig);

// 기본 루트 경로
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// /data 경로에서 데이터베이스 쿼리 실행
app.get("/data", (req, res) => {
  const query = "SELECT * FROM your_table_name"; // 여기에 실제 쿼리를 입력하세요

  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("쿼리 실행 실패: " + err.stack);
      res.status(500).send("데이터베이스 쿼리 실행에 실패했습니다.");
      return;
    }
    res.json(results); // 쿼리 결과를 JSON 형식으로 클라이언트에 반환
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// 서버 종료 시 MySQL 연결 종료
process.on("SIGTERM", () => {
  if (connection) {
    connection.end((err) => {
      if (err) {
        console.error("연결 종료 실패: " + err.stack);
        return;
      }
      console.log("MySQL 연결이 종료되었습니다.");
    });
  }
  sshClient.end();
});
