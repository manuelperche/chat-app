import express, { type Express } from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/user.route";
import sessionRouter from "./routes/session.route";
import cookieParser from "cookie-parser";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(
      cors({
        credentials: true,
        origin: "http://localhost:5173",
      })
    )
    .use(cookieParser());

  app.get("/ping", (_, res) => {
    res.send("pong 🏓");
  });

  app.use("/api/users", userRouter);

  app.use("/api/sessions", sessionRouter);

  return app;
};
