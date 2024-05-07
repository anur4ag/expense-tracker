import app from "./app.ts";

Bun.serve({
  hostname: "0.0.0.0",
  fetch: app.fetch,
});
