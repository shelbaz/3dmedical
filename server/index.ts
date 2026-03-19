import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { auth } from "./auth.js";
import { appRouter } from "./trpc/index.js";
import { createContext } from "./trpc/context.js";
import { existsSync, readFileSync } from "node:fs";

const app = new Hono();

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  app.use(
    "*",
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

// Better Auth routes
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// tRPC routes
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: ({ req }) => createContext(req),
  });
});

// Serve static files + SPA fallback in production
if (isProduction && existsSync("./dist")) {
  app.use("/*", serveStatic({ root: "./dist" }));

  // SPA fallback: if serveStatic didn't match, serve index.html
  const indexHtml = readFileSync("./dist/index.html", "utf-8");
  app.get("*", (c) => c.html(indexHtml));
}

const port = parseInt(process.env.PORT ?? "3001", 10);
console.log(`Server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
