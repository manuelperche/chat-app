import { Router } from "express";
import validateResource from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";
import deserializeUser from "../middleware/deserializeUser";
import { sendMessageHandler } from "../controllers/message.controller";
import { sendMessageSchema } from "../schemas/message.schema";
import { getMessagesHandler } from "../controllers/message.controller";

const router: Router = Router();

router.get("/:id", deserializeUser, requireUser, getMessagesHandler);
router.post("/send/:id", deserializeUser, requireUser, validateResource(sendMessageSchema), sendMessageHandler);

export default router;
