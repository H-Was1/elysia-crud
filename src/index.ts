import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import userRouter from "./routes/userRoutes";

const app = new Elysia()
  .use(
    swagger({
      provider: "swagger-ui",
      swaggerOptions: {
        displayRequestDuration: true,
      },
      exclude: ["/docs", "/docs/json"],
      path: "/docs",
      documentation: {
        tags: [
          { name: "App", description: "General endpoints" },
          { name: "Auth", description: "Authentication endpoints" },
        ],
        info: {
          title: "Elysia Documentation",
          version: "1.0.0",
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
  );

// Middlewares

// Routers
app.group("/api", (app) => app.use(userRouter)); // Use the userRouter

// Listener
app.listen(3000, () =>
  console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
  )
);
