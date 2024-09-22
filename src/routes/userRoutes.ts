import Elysia, { error, t } from "elysia";
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { and, eq, or } from "drizzle-orm";
import bearer from "@elysiajs/bearer";
import { postBody } from "../utils";
const userRouter = new Elysia({ prefix: "/user" }).use(bearer());

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
  async ({ error, body, set, bearer }) => {
    const { name, age, email } = body;
    try {
      console.log(bearer);

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
          email,
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
        422: {
          description: "Validation failed",
        },
      },
    },
    type: "application/json",
    security: [{ BearerAuth: [] }],
  }
);

userRouter.put("/:id", () => "PUT", {
  detail: {
    summary: "Update a user",
    tags: ["Auth"],
  },
});

userRouter
  .onRequest(async ({ set, error }) => {
    // add data into body
    set.headers["name"] = "User";
  })
  .get(
    "/:id",
    ({ headers }) => {
      return { goal: "yoho" };
    },
    {
      detail: {
        summary: "Delete a user",
        tags: ["Auth"],
      },
    }
  ).onBeforeHandle(({ set }) => {
    console.log("1");
  })
  .get(
    "/",
    () => {
      console.log("3");

      return "Gotcha";
    },
    {
      beforeHandle() {
        console.log("2");
      },
    }
  );

export default userRouter;
