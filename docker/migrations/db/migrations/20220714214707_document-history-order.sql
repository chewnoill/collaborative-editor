-- migrate:up
DELETE FROM document_history;
ALTER TABLE document_history DROP id;
ALTER TABLE document_history ADD sequence SERIAL;
ALTER TABLE document_history ADD timeslice timestamp NOT NULL;

ALTER TABLE document_history ADD
    PRIMARY KEY(document_id, sequence);

-- migrate:down
DELETE FROM document_history;
ALTER TABLE document_history DROP sequence;
ALTER TABLE document_history DROP timeslice;
ALTER TABLE document_history
    ADD id uuid DEFAULT uuid_generate_v4() PRIMARY KEY;

