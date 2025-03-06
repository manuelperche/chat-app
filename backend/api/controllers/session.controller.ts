import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJwt } from "../utils/jwt.utils";
import { SignOptions } from "jsonwebtoken";

const accessTokenTtl = process.env.ACCESS_TOKEN_TTL;
const refreshTokenTtl = process.env.REFRESH_TOKEN_TTL;

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const session = await createSession(
    user._id.toString(),
    req.get("user-agent") || ""
  );

  // create an access token

  const accessToken = signJwt({ ...user, session: session._id }, {
    expiresIn: accessTokenTtl,
  } as SignOptions);

  // create a refresh token
  const refreshToken = signJwt({ ...user, session: session._id }, {
    expiresIn: refreshTokenTtl,
  } as SignOptions);

  // return access & refresh tokens

  // res.cookie("accessToken", accessToken, {
  //   maxAge: 900000, // 15 mins
  //   httpOnly: true,
  //   domain: "localhost",
  //   path: "/",
  //   sameSite: "strict",
  //   secure: false,
  // });

  // res.cookie("refreshToken", refreshToken, {
  //   maxAge: 3.154e10, // 1 year
  //   httpOnly: true,
  //   domain: "localhost",
  //   path: "/",
  //   sameSite: "strict",
  //   secure: false,
  // });

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
