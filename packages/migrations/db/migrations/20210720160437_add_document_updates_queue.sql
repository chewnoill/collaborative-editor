-- migrate:up
CREATE TABLE document_updates_queue (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  document_id uuid NOT NULL,
  document_update bytea NOT NULL,
  update_time timestamp NOT NULL,
  FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE
);
-- migrate:down
DROP TABLE document_updates_queue;
