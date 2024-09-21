import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => {
  return "Hello, Elysia!";
});

// middlewares
app.use(swagger({ excludeMethods: ["/swagger", "/swagger/json"] }));

// routers

// listener
app.listen(3000, () =>
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  )
);
