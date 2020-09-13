import app from "./app";
import getDbClient from "./common/db";

const { PORT = 8080 } = process.env;

const server = (async function () {
   try {
      const { client, db } = await getDbClient();
      app.locals = {
         dbclient: client,
         db,
      };

      const server = app.listen(PORT, () =>
         console.log(`Listening on port ${PORT}`)
      );

      server.on("close", () => {
         app.locals.dbclient.close();
      });

      return server;
   } catch (error) {
      console.dir("Server failed to start:", error);
   }
})();

export default server;
