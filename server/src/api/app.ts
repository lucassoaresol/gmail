import cors from "cors";
import express from "express";

import { ClientManagerPromise } from "../models/clientManager.js";

import verifyClient from "./middlewares/verifyClient.js";
import clientRouter from "./routes/client.js";
import clientManagerRouter from "./routes/clientManager.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  const clientManager = await ClientManagerPromise;
  req.clientManager = clientManager;
  next();
});

app.use("/clients", clientRouter);
app.use("/:id", verifyClient, clientManagerRouter);

export default app;
