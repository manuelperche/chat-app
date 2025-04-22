import MessageModel from "../models/message.model";
import cloudinary from "../utils/cloudinary";
import { getReceiverSocketId } from "../utils/socket";
import { io } from "../utils/socket";

interface MessageInput {
  senderId: string;
  receiverId: string;
  content: string;
  image?: string;
}

export async function getMessages(userId: string, userToChatId: string) {
  const messages = await MessageModel.find({
    $or: [
      { senderId: userId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: userId },
    ],
  });

  return messages;
}

export async function sendMessage(payload: MessageInput) {
  const { senderId, receiverId, content, image } = payload;

  let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      content,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

  return newMessage;
}

