import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

export function signJwt(object: object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey as string, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey as string);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: unknown) {
    console.error(e);
    return {
      valid: false,
      expired: (e as Error).message === "jwt expired",
      decoded: null,
    };
  }
}
