import updateDocumentWorker from "./update-document-job";
import updateDocumentHistoryWorker from "./update-document-history-job";

export default [updateDocumentWorker, updateDocumentHistoryWorker].reduce(
  (acc, obj) => {
    acc[obj.key] = obj;
    return acc;
  },
  {}
);
