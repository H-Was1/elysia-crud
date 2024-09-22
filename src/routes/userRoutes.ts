import Elysia, { error, t } from "elysia";
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const userRouter = new Elysia({ prefix: "/user" });

// Define a schema for the user response
const UserResponse = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String({ format: "email", minLength: 1 }),
});

const postBody = t.Object({
  name: t.String({ minLength: 1, maxLength: 255 }),
  age: t.Integer(),
  email: t.String({ format: "email", minLength: 1 }),
});

// Define the route with explicit response types
userRouter.get(
  "/:id?",
  async ({ error, params, query, set }) => {
    try {
      if (params.id) {
        const user = await db.query.UserTable.findFirst({
          where: eq(UserTable.id, params.id),
        });
        if (!user) {
          return error(404, "User not found");
        }
        return user;
      }
      const users = await db.query.UserTable.findMany({});
      if (!users.length) {
        return error(404, "No users found");
      }
      set.status = 201;
      return users;
    } catch (err: any) {
      return error(500, err.message);
    }
  },
  {
    detail: {
      summary: "Get users by ID or all users",

      tags: ["Auth"],
      responses: {
        200: {
          description: "Successful response",
        },
        404: {
          description: "User not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  }
);

userRouter.post(
  "/",
  async ({ error, body, set }) => {
    const { name, age, email } = body;
    try {
      // Check for existing user
      const existingUser = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
      });

      if (existingUser) {
        return error(400, "Email already exists");
      }

      // Insert new user
      const [newUser] = await db
        .insert(UserTable)
        .values({
          name,
          age,
          email,
          role: "basic",
        })
        .returning();

      return newUser;
    } catch (err: any) {
      // Handle unexpected errors
      return error(500, err.message);
    }
  },
  {
    body: postBody,
    detail: {
      headers: {
        "Content-Type": "application/json",
      },
      summary: "Create a new user",
      tags: ["Auth"],
      responses: {
        201: {
          description: "User created successfully",
        },
        400: {
          description: "Invalid request",
        },
        500: {
          description: "Internal server error",
        },
        422:{
          description: "Validation failed",
        }
      },
    },
  }
);

userRouter.put("/:id", () => "PUT", {
  detail: {
    summary: "Update a user",
    tags: ["Auth"],
  },
});

userRouter.delete("/:id", () => "DELETE", {
  detail: {
    summary: "Delete a user",
    tags: ["Auth"],
  },
});

export default userRouter;
