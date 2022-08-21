/// <reference types="./zapatos/schema" />

export * as db from "zapatos/db";
import { postgraphile } from "postgraphile";
import type * as schema from "zapatos/schema";
import url from "whatwg-url";
import Pool from "pg-pool";
import { IS_PROD } from "./config";
import DocumentMutations from "./resolvers/documents";
import RandomQueries from "./resolvers/random-names";
import MdxQueries from "./resolvers/render-mdx";
import { DATABASE_URL } from "./env";
import DataUpload from "./resolvers/data-uploads";
import DocumentHistory from "./resolvers/document-history";
import logger from "./logger";
export { schema };

const params = url.parseURL(DATABASE_URL);

const config = {
  user: params.username,
  password: params.password,
  host: params.host,
  port: params.port,
  database: params.path[0],
};

export const pool = new Pool(config);

const postgraphile_options: any = {
  graphqlRoute: "/api/graphql",
  pgSettings(req) {
    return {
      role: "postgraphile_user",
      "app.user_id": req.user?.id,
    };
  },
  watchPg: false,
  graphiql: true,
  enhanceGraphiql: true,
  subscriptions: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  allowExplain: true,
  legacyRelations: "omit",
  sortExport: true,
  disableQueryLog: true,
  handleErrors: (errors, req, res) => {
    logger({
      level: "error",
      service: "postgraphile",
      message: "handleErrors",
      body: errors
    })
    return "errors reported";
  },
  appendPlugins: [
    DocumentMutations,
    DocumentHistory,
    RandomQueries,
    MdxQueries,
    DataUpload,
  ],
};

export function gqlMiddleware() {
  return postgraphile(DATABASE_URL, ["app"], postgraphile_options);
}
