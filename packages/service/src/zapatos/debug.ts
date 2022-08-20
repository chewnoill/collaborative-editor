import { db } from "../db";
import logger from "../logger";
/**
 * How to use this file
 *
 * Simply import this into some source file before you query is run
 *
 * ie:
 * ```ts
 * import "../zapatos/debug"
 * ```
 *
 * and then observe sql queries in your output logs
 */

db.setConfig({
  queryListener: (query) => logger({
      level: "info",
      service: "query-listener",
      query: query.text
  })
});
