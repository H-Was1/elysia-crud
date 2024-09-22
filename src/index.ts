import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import userRouter from "./routes/userRoutes";

export const app = new Elysia({ prefix: "/api/v1" })
  .use(
    swagger({
      scalarConfig: {
        theme: "purple",
      },
      path: "/docs",
      documentation: {
        tags: [
          { name: "App", description: "General endpoints" },
          { name: "Auth", description: "Authentication endpoints" },
        ],
        info: {
          title: "RosenHeim Booking",
          version: "1.0.0",
          description: "A simple API for managing users",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  )
  .get(
    "/",
    () => {
      return "Hello, Elysia!";
    },
    {
      detail: {
        tags: ["App"],
        summary: "Hello world",
      },
    }
  )

  // Middlewares

  // Routers
  .use(userRouter); // Use the userRouter

// Listener
app.listen(3000, () =>
  console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
  )
);
