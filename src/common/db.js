import { MongoClient } from "mongodb";

export default async function getDbClient(mongoUri = process.env.MONGO_URI) {
   // Connection URI TODO environment variable
   const uri = mongoUri;

   // Create a new MongoClient
   const client = await MongoClient(uri, {
      useUnifiedTopology: true,
   }).connect();

   console.log("Connected successfully to mongo server");

   return {
      client: client,
      db: client.db("promotions"),
   };
}
