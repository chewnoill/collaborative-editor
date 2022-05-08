import updateDocumentWorker from "./update-document-job";

export default [updateDocumentWorker].reduce((acc, obj) => {
  acc[obj.key] = obj;
  return acc;
}, {});
