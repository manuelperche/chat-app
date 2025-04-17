import { Request, Response } from "express";
import { getMessages, sendMessage } from "../services/messages.service";

export async function getMessagesHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const { id: userToChatId } = req.params;
  
  const messages = await getMessages(userId, userToChatId);
  res.status(200).json(messages);
}

export async function sendMessageHandler(req: Request, res: Response) {
  try {
    const { content, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = res.locals.user._id;

    const payload = {
      senderId,
      receiverId,
      content,
      image,
    };

    const message = await sendMessage(payload);

    res.status(200).json(message);
  } catch (error: unknown) {
    console.log("Error in sendMessage controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
