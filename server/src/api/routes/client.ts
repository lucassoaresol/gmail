import { Request, Response, Router } from "express";

const clientRouter = Router();

clientRouter.post("", async (req: Request, res: Response) => {
  await req.clientManager.addClient(req.body.id);
  res.status(201).json("sucess");
});

clientRouter.get("", (req: Request, res: Response) => {
  const clients = req.clientManager.listClients();
  res.json(clients);
});

export default clientRouter;
