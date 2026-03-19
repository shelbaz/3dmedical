import { db } from "../db/index.js";

export async function createContext(req: Request) {
  return {
    db,
    session: null as { id: string } | null,
    user: null as { id: string; name: string; email: string } | null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
