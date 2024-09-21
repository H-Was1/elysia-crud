import { table } from 'console';
import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const UserRole = pgEnum('userRole', ['admin', 'basic']);

export const UserTable = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    age: integer('age').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    role: UserRole('userRole').default('basic').notNull(),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex('emailIndex').on(table.email),
    };
  },
);

export const userPreferencesTable = pgTable('userPreferences', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  emailUpdates: boolean('emailUpdates').notNull().default(false),
  userId: uuid('userId')
    .references(() => UserTable.id, { onDelete: 'cascade' })
    .notNull(),
});

export const PostTable = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  averageRating: real('averageRating').notNull().default(0),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  authorId: uuid('authorId')
    .references(() => UserTable.id)
    .notNull(),
});

export const CategoryTable = pgTable('category', {
  id: uuid('category').primaryKey().defaultRandom().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
});



// Relations

export const UserTableRelations = relations(UserTable, ({ one, many }) => {
  return {
    prefrences: one(userPreferencesTable),
    posts: many(PostTable),
  };
});

export const UserPreferencesRelations = relations(userPreferencesTable, ({ one }) => {
  return {
    user: one(UserTable, {
      fields: [userPreferencesTable.userId], // during one-one relation the table that has id need to pass extra fields
      references: [UserTable.id],
    }),
  };
});

export const PostTableRelations = relations(PostTable, ({ many, one }) => {
  return {
    author: one(UserTable, {
      fields: [PostTable.authorId],
      references: [UserTable.id],
    }),
  };
});

