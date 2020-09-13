import Router from "koa-router";
import { healthcheck } from "./modules/health/health";
import * as product from "./modules/product/product";

const router = new Router();

router.get("/", healthcheck);
router.get("/product/:id", product.findOne);
router.get("/product", product.list);

export default router;
