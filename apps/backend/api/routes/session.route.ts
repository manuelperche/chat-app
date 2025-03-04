import { Router } from "express";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controllers/session.controller";
import { createSessionSchema } from "../schemas/session.schema";

const router: Router = Router();

router.post(
  "/",
  validateResource(createSessionSchema),
  createUserSessionHandler
);

router.get("/", requireUser, getUserSessionsHandler);

router.delete("/", requireUser, deleteSessionHandler);

export default router;
