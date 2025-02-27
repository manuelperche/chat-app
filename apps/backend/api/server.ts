import express, { type Express } from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/message/:name", (req, res) => {
      res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      res.json({ ok: true });
    });

  app.get("/ping", (_, res) => {
    res.send("pong 🏓");
  });

  return app;
};
