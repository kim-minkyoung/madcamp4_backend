const express = require("express");
const app = express();
const port = 8080;

const { connectToDatabase, disconnectFromDatabase } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const dormRoutes = require("./routes/dormRoutes");
const potionRoutes = require("./routes/potionRoutes");

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", dormRoutes);
app.use("/api", potionRoutes);

connectToDatabase(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

const gracefulShutdown = async () => {
  await disconnectFromDatabase();
  process.exit(0); // Ensure process exits after cleanup
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
