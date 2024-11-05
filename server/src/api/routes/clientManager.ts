import { Router } from "express";

import emailRouter from "./email.js";

const clientManagerRouter = Router();

clientManagerRouter.use("/emails", emailRouter);

export default clientManagerRouter;
