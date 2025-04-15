import { Request, Response } from "express";
import {
  CreateUserInput,
  GetUsersForSidebarInput,
} from "../schemas/user.schema";
import {
  createUser,
  findUser,
  findUsersForSidebar,
  updateUser,
} from "../services/user.service";
import logger from "../utils/logger";
import { omit } from "lodash";
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
  const userRes = await findUser({ _id: user._id });
  if (!userRes) {
    return res.status(404).send("User not found");
  }
  const sanitizedUser = omit(userRes, ["password", "session", "exp", "iat"]);
  return res.send(sanitizedUser);
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

export async function getUsersForSidebar(
  req: Request<object, object, GetUsersForSidebarInput["body"]>,
  res: Response
) {
  const user = res.locals.user;
  if (!user) {
    return res.status(404).send("User not found");
  }
  const users = await findUsersForSidebar({ body: { userId: user._id } });
  return res.status(200).send(users);
}
