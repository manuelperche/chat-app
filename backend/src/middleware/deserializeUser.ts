import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../services/session.service";

const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie("accessToken", token, {
    maxAge: 900000, // 15 mins
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });
};

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "cookies.accessToken");
  const refreshToken = get(req, "cookies.refreshToken");

  if (!refreshToken) return next();

  if (!accessToken || verifyJwt(accessToken).expired) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      setAccessTokenCookie(res, newAccessToken);
      res.locals.user = verifyJwt(newAccessToken).decoded;
    }
    return next();
  }

  const { decoded } = verifyJwt(accessToken);
  if (decoded) res.locals.user = decoded;

  return next();
};

export default deserializeUser;
