import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { anatomicalStructure, userAnnotation } from "../db/schema.js";
import type { Context } from "./context.js";

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

export const appRouter = t.router({
  // Health check
  health: publicProcedure.query(() => ({ status: "ok" })),

  // Get all structures, optionally filtered by system
  getStructures: publicProcedure
    .input(
      z
        .object({
          system: z
            .enum([
              "skeletal",
              "muscular",
              "arterial",
              "venous",
              "nervous",
              "lymphatic",
              "organs",
              "fascia",
              "spaces",
            ])
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      if (input?.system) {
        return ctx.db
          .select()
          .from(anatomicalStructure)
          .where(eq(anatomicalStructure.system, input.system));
      }
      return ctx.db.select().from(anatomicalStructure);
    }),

  // Get a single structure by ID
  getStructure: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [structure] = await ctx.db
        .select()
        .from(anatomicalStructure)
        .where(eq(anatomicalStructure.id, input.id));
      if (!structure) throw new TRPCError({ code: "NOT_FOUND" });
      return structure;
    }),

  // Save a user annotation
  saveAnnotation: protectedProcedure
    .input(
      z.object({
        structureId: z.string().uuid().optional(),
        position: z.tuple([z.number(), z.number(), z.number()]).optional(),
        cameraState: z.record(z.string(), z.unknown()).optional(),
        note: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [annotation] = await ctx.db
        .insert(userAnnotation)
        .values({
          userId: ctx.user.id,
          structureId: input.structureId,
          position: input.position,
          cameraState: input.cameraState,
          note: input.note,
        })
        .returning();
      return annotation;
    }),

  // Get user's annotations
  getAnnotations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(userAnnotation)
      .where(eq(userAnnotation.userId, ctx.user.id));
  }),
});

export type AppRouter = typeof appRouter;
