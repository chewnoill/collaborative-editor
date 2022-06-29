-- migrate:up
CREATE TABLE data_upload (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    confirmed bool DEFAULT false NOT NULL,
    file_name text NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
    size integer NOT NULL,
    mime_type text NOT NULL,

    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

comment on table data_upload is '
@name data_upload
@omit create,update,delete';

-- migrate:down
DROP TABLE data_upload;

