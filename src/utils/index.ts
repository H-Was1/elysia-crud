import { t } from "elysia";

// Define a schema for the user response
export const UserResponse = t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String({ format: "email", minLength: 1 }),
  });
  
 export const postBody = t.Object({
    name: t.String({ minLength: 1, maxLength: 255 }),
    age: t.Integer(),
    email: t.String({ format: "email", minLength: 1 }),
  });