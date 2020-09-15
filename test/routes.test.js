import request from "supertest";
import { startMongo } from "./testDbServer";

let server;
let stopServer;

// TODO Pending to put mongodb in memory

beforeAll(async () => {
   stopServer = await startMongo();
   require("dotenv").config({ path: ".env.test" });

   server = await require("../src").default;
});

afterAll(async () => {
   await server.close();
   await stopServer();
});

describe("GET /", () => {
   it("should render application name and version", async () => {
      await request(server).get("/").expect(200);
   });
});

describe("GET /404", () => {
   it("should return 404 for non-existent URLs", async () => {
      await request(server).get("/404").expect(404);
      await request(server).get("/notfound").expect(404);
   });
});

describe("GET /product", () => {
   it("should return one single product if the id is passed and the product exists", async () => {
      const response = await request(server).get("/product/10");
      expect(response.body).toMatchObject({
         id: 10,
         brand: "adsfsda",
         description: "dñqy ipvukesh",
         image: "www.lider.cl/catalogo/images/smartphoneIcon.svg",
         price: 500000,
      });
      expect(response.body.discount).toBeUndefined();
   });

   it("should return one single product and the discount block (palindrome)", async () => {
      const response = await request(server).get("/product/11");
      expect(response.body).toMatchObject({
         id: 11,
         brand: "adsfsda",
         description: "dñqy ipvukesh",
         image: "www.lider.cl/catalogo/images/smartphoneIcon.svg",
         price: 691504,
         discount: {
            price: 345752,
            percentage: 50,
         },
      });
   });

   it("should return 404 if the  the product does not exist", async () => {
      const response = await request(server).get("/product/100").expect(404);
      expect(response.body.message).toBe("Product not found");
   });

   it("should return a list of products if the search term matches", async () => {
      const response = await request(server)
         .get("/product?search=dde")
         .expect(200);

      expect(response.body).toMatchObject({
         totalResults: 2,
         currentPage: 1,
         totalPages: 1,
      });

      expect(Array.isArray(response.body.products)).toBeTruthy();
      expect(response.body.products.length).toBe(2);

      response.body.products.map((product) => {
         expect(product.discount).toBeUndefined();
         expect(product.brand + product.description).toContain("dde");
      });
   });

   it("should return a list of products with discount (palindrome)", async () => {
      const response = await request(server)
         .get("/product?search=cbc")
         .expect(200);

      expect(response.body).toMatchObject({
         totalResults: 2,
         currentPage: 1,
         totalPages: 1,
      });

      expect(Array.isArray(response.body.products)).toBeTruthy();
      expect(response.body.products.length).toBe(2);

      response.body.products.map((product) => {
         expect(product.discount).toBeDefined();
         expect(product.brand + product.description).toContain("cbc");
      });
   });

   it("should return no products if the search term does not match", async () => {
      const response = await request(server)
         .get("/product?search=abc")
         .expect(200);

      expect(response.body).toMatchObject({
         totalResults: 0,
         currentPage: 0,
         totalPages: 0,
         products: [],
      });
   });

   it("should limit the number of returned records accordingly and get the correct page", async () => {
      const response = await request(server)
         .get("/product?limit=2&page=2")
         .expect(200);

      // TODO Limit to 10
      expect(response.body).toMatchObject({
         totalResults: 11,
         currentPage: 2,
         totalPages: 6,
      });
   });
});
