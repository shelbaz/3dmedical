import { auth } from "../auth.js";
import { db } from "../db/index.js";

export async function createContext(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    db,
    session,
    user: session?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
