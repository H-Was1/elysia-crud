import Elysia, { error, t } from "elysia";
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
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

userRouter
  .onBeforeHandle(({ set }) => {
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
