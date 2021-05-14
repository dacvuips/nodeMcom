import app from "./app";
import grapqhQLServer from "./graphql";

const server = app.listen(app.get("port"), "0.0.0.0", () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

grapqhQLServer(app, server);

export default server;
