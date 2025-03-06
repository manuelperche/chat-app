import { Request, Response } from "express";
import { CreateUserInput } from "../schemas/user.schema";
import { createUser } from "../services/user.service";
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
  return res.send(res.locals.user);
}
