import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import testProducts from "./testProducts.json";

export async function startMongo() {
   const mongoServer = new MongoMemoryServer({
      instance: {
         port: 27018,
         dbName: "promotions",
      },
   });

   await mongoServer.start();

   const uri = mongoServer.getInstanceInfo().uri;

   const client = await MongoClient(uri, {
      useUnifiedTopology: true,
   }).connect();

   const products = client.db("promotions").collection("products");

   await products.insertMany(testProducts);

   await client.close();

   return () => mongoServer.stop();
}
