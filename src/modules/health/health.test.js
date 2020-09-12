import { healthcheck } from "./health";

describe("Health Module", () => {
   it("shoulld set the body with the JSON info", async () => {
      const ctxStub = {};
      await healthcheck(ctxStub);
      expect(ctxStub.body.app).toBeDefined();
      expect(ctxStub.body.version).toBeDefined();
   });
});
