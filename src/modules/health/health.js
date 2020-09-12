import { name, version } from "../../../package.json";

export async function healthcheck(ctx) {
   ctx.body = {
      app: name,
      version: version,
   };
}
