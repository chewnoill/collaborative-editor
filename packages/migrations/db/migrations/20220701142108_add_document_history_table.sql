-- migrate:up
CREATE TABLE document_history (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  document_id uuid NOT NULL,
  user_id uuid,
  diff text NOT NULL,
  FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- migrate:down
DROP TABLE document_history;

