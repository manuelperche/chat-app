import { createCallerFactory, t } from "../trpc";
import { commentsRouter } from "./comments";
import { productsRouter } from "./products";

export const appRouter = t.router({
  testing: t.procedure.query(() => "Testing"),
  products: productsRouter,
  comments: commentsRouter,
});

export const createCaller = createCallerFactory(appRouter);
