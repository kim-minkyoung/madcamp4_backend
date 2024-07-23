const express = require("express");
const app = express();
const port = 8080;

const { connectToDatabase } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
// const dormRoutes = require("./routes/dormRoutes");
// const potionRoutes = require("./routes/potionRoutes");
// const magicRoutes = require("./routes/magicRoutes");

app.use(express.json());

app.use("/api", userRoutes);
// app.use("/api", dormRoutes);
// app.use("/api", potionRoutes);
// app.use("/api", magicRoutes);

connectToDatabase(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
