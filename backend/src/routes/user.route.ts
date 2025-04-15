import { Router } from "express";
import {
  createUserHandler,
  getCurrentUser,
  getUsersForSidebar,
  updateProfile,
} from "../controllers/user.controller";
import deserializeUser from "../middleware/deserializeUser";
import requireUser from "../middleware/requireUser";
import { createUserSchema } from "../schemas/user.schema";
import validateResource from "../middleware/validateResource";

const router: Router = Router();

router.post("/", validateResource(createUserSchema), createUserHandler);
router.get("/me", deserializeUser, requireUser, getCurrentUser);
router.put("/", deserializeUser, requireUser, updateProfile);
router.get("/sidebar", deserializeUser, requireUser, getUsersForSidebar);

export default router;
