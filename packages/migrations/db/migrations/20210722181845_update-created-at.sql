-- migrate:up
ALTER TABLE document_updates_queue ADD created_at timestamp DEFAULT now() NOT NULL;
ALTER TABLE document_updates_queue DROP update_time;

-- migrate:down
ALTER TABLE document_updates_queue DROP created_at;
ALTER TABLE document_updates_queue ADD update_time ADD timestamp DEFAULT now() NOT NULL;
