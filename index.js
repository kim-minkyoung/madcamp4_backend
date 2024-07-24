const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const port = 8080;

const { connectToDatabase, disconnectFromDatabase } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const dormRoutes = require("./routes/dormRoutes");
const potionRoutes = require("./routes/potionRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", dormRoutes);
app.use("/api", potionRoutes);

const server = http.createServer(app);
require("./socket")(server);

connectToDatabase(() => {
  server.listen(port, () => {
    // 변경된 부분
    console.log(`Server running on port ${port}`);
  });
});

const gracefulShutdown = async () => {
  await disconnectFromDatabase();
  process.exit(0); // Ensure process exits after cleanup
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
