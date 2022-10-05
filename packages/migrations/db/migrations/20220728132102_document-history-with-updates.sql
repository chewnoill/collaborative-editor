-- migrate:up
DELETE from document_history;
ALTER TABLE document_history DROP user_id;
ALTER TABLE document_history DROP timeslice;

CREATE TABLE document_update_document_history (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  document_update_id uuid NOT NULL,
  document_id uuid NOT NULL,
  sequence integer NOT NULL,
  FOREIGN KEY (document_update_id) REFERENCES document_updates_queue(id) ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE,
  FOREIGN KEY (document_id, sequence) REFERENCES document_history(document_id, sequence) ON DELETE CASCADE
);

-- migrate:down
DELETE from document_history;
ALTER TABLE document_history ADD user_id uuid;
ALTER TABLE document_history ADD timeslice timestamp without time zone NOT NULL;
DROP TABLE document_update_document_history;
