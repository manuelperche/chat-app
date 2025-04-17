import { Router } from "express";
import {
  createUserHandler,
  getCurrentUser,
  getUsersForSidebar,
  updateProfile,
} from "../controllers/user.controller";
import deserializeUser from "../middleware/deserializeUser";
import requireUser from "../middleware/requireUser";
import { createUserSchema, updateProfileSchema } from "../schemas/user.schema";
import validateResource from "../middleware/validateResource";

const router: Router = Router();

router.get("/me", deserializeUser, requireUser, getCurrentUser);
router.get("/sidebar", deserializeUser, requireUser, getUsersForSidebar);
router.post("/", validateResource(createUserSchema), createUserHandler);
router.put("/", deserializeUser, requireUser, validateResource(updateProfileSchema), updateProfile);

export default router;
