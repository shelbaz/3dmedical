import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Better Auth Tables ──────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Anatomy Tables ──────────────────────────────────────────

export const anatomicalSystemEnum = pgEnum("anatomical_system", [
  "skeletal",
  "muscular",
  "arterial",
  "venous",
  "nervous",
  "lymphatic",
  "organs",
  "fascia",
  "spaces",
]);

export const anatomicalStructure = pgTable("anatomical_structure", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  latinName: text("latin_name"),
  system: anatomicalSystemEnum("system").notNull(),
  region: text("region"),
  parentId: uuid("parent_id"),
  meshName: text("mesh_name"),
  description: text("description"),
  clinicalSignificance: text("clinical_significance"),
  labelPosition: jsonb("label_position").$type<[number, number, number]>(),
});

export const structureRelation = pgTable("structure_relation", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => anatomicalStructure.id, { onDelete: "cascade" }),
  targetId: uuid("target_id")
    .notNull()
    .references(() => anatomicalStructure.id, { onDelete: "cascade" }),
  relationType: text("relation_type").notNull(), // arterial_supply, venous_drainage, innervation, lymphatic_drainage, border_of
});

export const spaceBorder = pgTable("space_border", {
  id: uuid("id").defaultRandom().primaryKey(),
  spaceId: uuid("space_id")
    .notNull()
    .references(() => anatomicalStructure.id, { onDelete: "cascade" }),
  direction: text("direction").notNull(), // anterior, posterior, lateral, superior, inferior
  borderStructureId: uuid("border_structure_id").references(
    () => anatomicalStructure.id
  ),
  description: text("description").notNull(),
});

// ─── User Data Tables ────────────────────────────────────────

export const userAnnotation = pgTable("user_annotation", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  structureId: uuid("structure_id").references(() => anatomicalStructure.id),
  position: jsonb("position").$type<[number, number, number]>(),
  cameraState: jsonb("camera_state"),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  structureId: uuid("structure_id")
    .notNull()
    .references(() => anatomicalStructure.id),
  familiarityScore: text("familiarity_score").default("0"),
  lastReviewed: timestamp("last_reviewed"),
  nextReview: timestamp("next_review"),
});
