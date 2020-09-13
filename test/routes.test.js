import request from "supertest";

let server;

// TODO Pending to put mongodb in memory

beforeAll(async () => {
   require("dotenv").config({ path: ".env.test" });
   server = await require("../src").default;
});

afterAll((done) => {
   server.close(done);
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
      const response = await request(server).get("/product/123");
      expect(response.body.brand).toBeDefined();
      expect(response.body.description).toBeDefined();
      expect(response.body._id).toBeDefined();
   });

   it("should return 404 if the  the product does not exist", async () => {
      const response = await request(server).get("/product/foo").expect(404);
      expect(response.body.message).toBe("Product not found");
   });

   it("should return a list of products if the search term matches", async () => {
      const response = await request(server)
         .get("/product?search=rlñlw")
         .expect(200);

      expect(response.body.totalResults).toBeGreaterThan(0);
      expect(response.body.products.length).toBeGreaterThan(0);
      expect(response.body.currentPage).toBeDefined();
      expect(response.body.totalPages).toBeDefined();
   });

   it("should return no products if the search term does not match", async () => {
      const response = await request(server)
         .get("/product?search=abc")
         .expect(200);

      expect(response.body.totalResults).toBe(0);
      expect(response.body.products.length).toBe(0);
      expect(response.body.currentPage).toBeDefined();
      expect(response.body.totalPages).toBeDefined();
   });

   it("should limit the number of returned records accordingly and get the correct page", async () => {
      const response = await request(server)
         .get("/product?limit=2&page=2")
         .expect(200);

      // TODO Limit to 10
      expect(response.body.totalResults).toBeGreaterThan(0);
      expect(response.body.products.length).toBe(2);
      expect(response.body.currentPage).toBe(2);
      expect(response.body.totalPages).toBeDefined();
   });
});
