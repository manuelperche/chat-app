import { Request, Response } from "express";
import { CreateUserInput } from "../schemas/user.schema";
import { createUser, updateUser } from "../services/user.service";
import logger from "../utils/logger";

export async function createUserHandler(
  req: Request<object, object, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.status(201).send(user);
  } catch (e: unknown) {
    logger.error(e);
    return res
      .status(409)
      .send(e instanceof Error ? e.message : "Unknown error");
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  const user = res.locals.user;
  
  if (!user) {
    return res.status(404).send("User not found");
  }
  const sanitizedUser = { ...user };
  delete sanitizedUser.password;
  delete sanitizedUser.session;
  delete sanitizedUser.exp;
  delete sanitizedUser.iat;
  
  res.locals.user = sanitizedUser;
  return res.send(res.locals.user);
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const user = await updateUser(req.body);
    return res.status(200).send(user);
  } catch (error) {
    console.log("error in update profile:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
}
