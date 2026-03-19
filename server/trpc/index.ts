import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, or } from "drizzle-orm";
import {
  anatomicalStructure,
  structureRelation,
  spaceBorder,
  userAnnotation,
} from "../db/schema.js";
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

  // Get full structure details by name (with borders and relations)
  getStructureDetails: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const [structure] = await ctx.db
        .select()
        .from(anatomicalStructure)
        .where(eq(anatomicalStructure.name, input.name));

      if (!structure) return null;

      // Get borders if it's a space
      let borders: Array<{
        direction: string;
        description: string;
        borderStructureName?: string;
      }> = [];

      if (structure.system === "spaces") {
        const rawBorders = await ctx.db
          .select()
          .from(spaceBorder)
          .where(eq(spaceBorder.spaceId, structure.id));

        borders = await Promise.all(
          rawBorders.map(async (b) => {
            let borderStructureName: string | undefined;
            if (b.borderStructureId) {
              const [bs] = await ctx.db
                .select()
                .from(anatomicalStructure)
                .where(eq(anatomicalStructure.id, b.borderStructureId));
              borderStructureName = bs?.name;
            }
            return {
              direction: b.direction,
              description: b.description,
              borderStructureName,
            };
          })
        );
      }

      // Get relationships (where this structure is the source)
      const rawRelations = await ctx.db
        .select()
        .from(structureRelation)
        .where(
          or(
            eq(structureRelation.sourceId, structure.id),
            eq(structureRelation.targetId, structure.id)
          )
        );

      // Resolve relation names
      const relations = await Promise.all(
        rawRelations.map(async (r) => {
          const isSource = r.sourceId === structure.id;
          const otherId = isSource ? r.targetId : r.sourceId;
          const [other] = await ctx.db
            .select()
            .from(anatomicalStructure)
            .where(eq(anatomicalStructure.id, otherId));
          return {
            relationType: r.relationType,
            structureName: other?.name ?? "Unknown",
            direction: isSource ? "outgoing" : "incoming",
          };
        })
      );

      // Group relations by type
      const arterialSupply = relations
        .filter((r) => r.relationType === "arterial_supply")
        .map((r) => r.structureName);
      const venousDrainage = relations
        .filter((r) => r.relationType === "venous_drainage")
        .map((r) => r.structureName);
      const innervation = relations
        .filter((r) => r.relationType === "innervation")
        .map((r) => r.structureName);
      const lymphaticDrainage = relations
        .filter((r) => r.relationType === "lymphatic_drainage")
        .map((r) => r.structureName);

      return {
        ...structure,
        borders,
        arterialSupply,
        venousDrainage,
        innervation,
        lymphaticDrainage,
      };
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
