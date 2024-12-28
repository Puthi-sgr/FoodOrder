import express from "express";
import Database from "./services/Database";
import ExpressApp from "./services/ExpressApp";
import { PORT } from "./config";

const startServer = async () => {
  const app = express();
  console.clear();
  console.log("Setting up database...");
  await Database();
  console.log("Setting up express app...");
  await ExpressApp(app);

  const port = PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
