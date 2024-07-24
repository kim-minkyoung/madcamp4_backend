// socket.js
const socketIo = require("socket.io");

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const players = {};

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // 새로운 플레이어 추가
    players[socket.id] = {
      position: { top: "50%", left: "50%" },
      score: 0,
    };

    // 현재 플레이어 목록을 새로 연결된 클라이언트에 전송
    socket.emit("currentPlayers", players);

    // 새 플레이어 추가를 모든 클라이언트에 브로드캐스트
    socket.broadcast.emit("newPlayer", {
      playerId: socket.id,
      player: players[socket.id],
    });

    // 플레이어 위치 업데이트
    socket.on("playerMovement", (movementData) => {
      if (players[socket.id]) {
        players[socket.id].position = movementData.position;
        io.emit("playerMoved", {
          playerId: socket.id,
          position: movementData.position,
        });
      }
    });

    // 연결 종료 처리
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      delete players[socket.id];
      io.emit("playerDisconnected", socket.id);
    });
  });
};
