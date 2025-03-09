import app from "./src/server";

const port: string | number = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`> server started on port ${port}`);
});
