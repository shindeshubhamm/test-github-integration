import { handler } from "./src/server";

// export the handler for Netlify Functions
export { handler };

// for local development
if (process.env.NODE_ENV !== "production") {
  const app = require("./src/server").default;
  const port: string | number = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`> server started on port ${port}`);
  });
}
