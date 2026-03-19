import { db } from "../db/index.js";

export async function createContext(req: Request) {
  return {
    db,
    session: null,
    user: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
