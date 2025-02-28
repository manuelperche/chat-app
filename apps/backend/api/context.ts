import { db } from "./utils/db";

export const createContext = () => {
  return {
    db,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
