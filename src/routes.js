import Router from "koa-router";
import { healthcheck } from "./modules/health/health";

const router = new Router();

/**
 * GET /
 */
router.get("/", healthcheck);

export default router;
