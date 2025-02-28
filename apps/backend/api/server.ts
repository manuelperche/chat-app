import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { db } from "./utils/db";

export const createServer = (): Express => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors());

  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: () => {
        return {
          db,
        };
      },
    }),
  );

  app.get("/ping", (req, res) => {
    return res.send("pong 🏓");
  });

  return app;
};

export type AppRouter = typeof appRouter;
