import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { Storage } from "@google-cloud/storage";
import { GCS_BUCKET_NAME, GCS_CREDS_FILE } from "../env";
import { db, pool } from "../db";

const storage = new Storage({
  keyFilename: GCS_CREDS_FILE,
});

const SIZE_LIMIT = 10000000; // 10mb

export async function redirectForDownload(id: string, resp) {
  const data = await db
    .select("app.data_upload", {
      id,
    })
    .run(pool);
  if (!data) {
    resp.send(404);
    return;
  }
  const [url] = await storage
    .bucket(GCS_BUCKET_NAME)
    .file(id)
    .getSignedUrl({
      version: "v4" as const,
      action: "read" as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
  resp.redirect(url);
  return;
}

const DataUpload = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Mutation {
        uploadData(args: UploadDataInput): UploadDataResponse
      }
      input UploadDataInput {
        file_name: String!
        size: Int!
        mime_type: String!
      }
      type UploadDataResponse {
        upload_url: String!
        id: ID!
      }
    `,
    resolvers: {
      Mutation: {
        async uploadData(
          _,
          {
            args,
          }: {
            args: {
              file_name: string;
              size: number;
              mime_type: string;
            };
          },
          { pgClient }
        ) {
          if (args.size > 10000000) {
            throw Error(`size limit ${SIZE_LIMIT} bytes exceeded`);
          }

          const data = await db
            .insert("app.data_upload", {
              file_name: args.file_name,
              mime_type: args.mime_type,
              size: args.size,
              owner_id: db.sql`current_user_id()`,
            })
            .run(pgClient);

          const options = {
            version: "v4" as const,
            action: "write" as const,
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType: args.mime_type,
            conditions: [
              ["content-length-range", args.size, args.size],
              ["content-type", args.mime_type],
            ],
          };

          const [url] = await storage
            .bucket(GCS_BUCKET_NAME)
            .file(data.id)
            .getSignedUrl(options);

          return {
            id: data.id,
            upload_url: url,
          };
        },
      },
    },
  };
});

export default DataUpload;
