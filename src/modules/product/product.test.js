import {
   buildQuery,
   buildResponseBody,
   setDiscountPrice,
   verifyPalindrom,
   setDiscountPriceToList,
} from "./product";

describe("Product Module", () => {
   it("should build a db query correctly if a search tern is provided", () => {
      const dbQuery = buildQuery({ search: "test" });

      expect(Array.isArray(dbQuery.$or)).toBeTruthy();
      expect(dbQuery.$or[0].brand).toEqual(/test/);
      expect(dbQuery.$or[1].description).toEqual(/test/);
   });

   it("should build a db query correctly without search terms", () => {
      const dbQuery = buildQuery({});
      expect(dbQuery.$or).toBeUndefined();
   });

   it("should build a response body correctly", () => {
      const responseBody = buildResponseBody(101, 1, [{}, {}], 2);
      expect(responseBody).toEqual({
         totalPages: 51,
         totalResults: 101,
         currentPage: 1,
         products: [{}, {}],
      });
   });

   it("should set a discount price correctly", () => {
      const productWithDiscount = setDiscountPrice({ price: 1000 });
      expect(productWithDiscount).toEqual({
         price: 1000,
         discount: {
            price: 500,
            percentage: 50,
         },
      });
   });

   it("should verify correctly if it's a palindrome value", () => {
      expect(verifyPalindrom("aba")).toBeTruthy();
      expect(verifyPalindrom("abdba")).toBeTruthy();
      expect(verifyPalindrom(121)).toBeTruthy();
      expect(verifyPalindrom(12221)).toBeTruthy();
      expect(verifyPalindrom("cde")).toBeFalsy();
      expect(verifyPalindrom("cddsdsssse")).toBeFalsy();
      expect(verifyPalindrom(123)).toBeFalsy();
      expect(verifyPalindrom()).toBeFalsy();
   });

   it("should build a response body with discount price", () => {
      const responseWithDiscount = setDiscountPriceToList({
         totalResults: 2,
         products: [{ price: 1000 }, { price: 500 }],
      });

      expect(responseWithDiscount).toEqual({
         totalResults: 2,
         products: [
            {
               price: 1000,
               discount: {
                  price: 500,
                  percentage: 50,
               },
            },
            {
               price: 500,
               discount: {
                  price: 250,
                  percentage: 50,
               },
            },
         ],
      });
   });
});
