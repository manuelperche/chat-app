import { Router } from "express";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  login,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controllers/session.controller";
import { createSessionSchema } from "../schemas/session.schema";
import deserializeUser from "../middleware/deserializeUser";
const router: Router = Router();

router.post(
  "/",
  validateResource(createSessionSchema),
  login
);

router.get("/", requireUser, getUserSessionsHandler);

router.delete("/", deserializeUser, requireUser, deleteSessionHandler);

export default router;
