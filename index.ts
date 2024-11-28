import express from "express";
import Database from "./services/Database";
import ExpressApp from "./services/ExpressApp";

const startServer = async () => {
  const app = express();

  await Database();
  await ExpressApp(app);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.clear();
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
