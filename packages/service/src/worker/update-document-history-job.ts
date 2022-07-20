import logger from "../logger";
import { replaceDocumentHistory } from "../utils/document-history";

const config = {
  key: "update-document-history",
  run: async function updateDocumentHistory(params: {
    data: { document_id: string };
  }) {
    if (!params?.data?.document_id) {
      logger({
        level: "warn",
        service: "update-document-history",
        message: "invalid params",
        body: params,
      });
      return;
    }
    await replaceDocumentHistory({ id: params.data.document_id });
  },
};

export default config;
