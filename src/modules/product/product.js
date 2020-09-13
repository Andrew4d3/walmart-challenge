/* eslint-disable require-atomic-updates */
import app from "../../app";

const MAX_LIMIT = 50;
const DISCOUNT_FACTOR = 0.5;

export function getProductById(
   id,
   collection = app.locals.db.collection("products")
) {
   return collection.findOne({ id });
}

export function listProductsByQuery(
   query,
   limit,
   page,
   collection = app.locals.db.collection("products")
) {
   return collection
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .toArray();
}

export function countProductsByQuery(
   query,
   collection = app.locals.db.collection("products")
) {
   return collection.countDocuments(query);
}

// Pending to unit test
export function buildQuery(queryString) {
   let query = {};
   const { search } = queryString;

   if (search && search.length > 0) {
      query.$or = [
         { brand: new RegExp(search) },
         { description: new RegExp(search) },
      ];
   }

   return query;
}

// Pending to unit test
export const buildResponseBody = (
   totalResults,
   currentPage,
   products,
   limit
) => ({
   totalPages: Math.ceil(totalResults / limit),
   totalResults,
   currentPage,
   products,
});

// Pending to unit test
export const setDiscountPrice = (product) => ({
   ...product,
   discount: {
      price: product.price * DISCOUNT_FACTOR,
      percentage: 100 * DISCOUNT_FACTOR,
   },
});

// Pending to unit test
export const isPalindrom = (value) =>
   value.length && `${value}`.split("").reverse().join("") == value;

// Pending to unit test
export function setDiscountPriceToList(body) {
   const productsWithDiscount = body.products.map(setDiscountPrice);

   return {
      ...body,
      products: productsWithDiscount,
   };
}

export async function findOne(ctx) {
   const { id } = ctx.params;
   let product = await getProductById(Number(id));

   if (!product) {
      return ctx.throw(404, "Product not found");
   }

   if (isPalindrom(id)) {
      product = setDiscountPrice(product);
   }

   ctx.body = product;
}

export async function list(ctx) {
   const { query } = ctx.request;
   const dbQuery = buildQuery(query);

   const totalResults = await countProductsByQuery(dbQuery);

   if (!totalResults) {
      return (ctx.body = buildResponseBody(totalResults, 0, [], MAX_LIMIT));
   }

   const currentPage = Number(ctx.request.query.page) || 1;

   let limit = Number(query.limit);
   limit = limit && limit < MAX_LIMIT ? limit : MAX_LIMIT;

   const products = await listProductsByQuery(dbQuery, limit, currentPage);

   let responseBody = buildResponseBody(
      totalResults,
      currentPage,
      products,
      limit
   );

   if (isPalindrom(query.search)) {
      responseBody = setDiscountPriceToList(responseBody);
   }

   ctx.body = responseBody;
}
