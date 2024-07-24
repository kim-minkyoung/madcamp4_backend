// /config/db.js
const mysql = require("mysql2");
const { Client } = require("ssh2");
const fs = require("fs");
require("dotenv").config();

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
let sshClient = new Client();

const connectToDatabase = (callback) => {
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
            callback();
          });
        }
      );
    })
    .connect(tunnelConfig);
};

const disconnectFromDatabase = async () => {
  if (connection) {
    await new Promise((resolve, reject) => {
      connection.end((err) => {
        if (err) {
          console.error("MySQL 연결 종료 실패: " + err.stack);
          reject(err);
        } else {
          console.log("MySQL 연결 종료됨");
          resolve();
        }
      });
    });
  }

  if (sshClient) {
    return new Promise((resolve) => {
      sshClient.end();
      console.log("SSH 연결 종료됨");
      resolve();
    });
  }
};

const getConnection = () => connection;

module.exports = { connectToDatabase, getConnection, disconnectFromDatabase };
