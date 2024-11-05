import { Request, Response, Router } from "express";

const emailRouter = Router();

emailRouter.post("", async (req: Request, res: Response) => {
  const client = req.client;
  const isReady = await client.isReady();

  if (!isReady) {
    res.status(503).json({
      message:
        "Client is not ready. Please ensure the required credentials are available.",
    });
    return;
  }

  const hasPendingEmail = await client.hasPendingEmail();
  if (hasPendingEmail) {
    res.status(409).json({
      message: "There is already a pending email for this client.",
    });
    return;
  }

  const {
    to,
    subject,
    body,
    cc = null,
    bcc = null,
    attachments = null,
  } = req.body;

  try {
    await req.client.createEmailFileAndSend(
      to,
      subject,
      body,
      cc,
      bcc,
      attachments,
    );

    res.status(201).json({ message: "Email saved for sending." });
  } catch (error) {
    console.error("Erro ao salvar o email para envio:", error);
    res.status(500).json({ message: "Failed to save email for sending." });
  }
});

export default emailRouter;