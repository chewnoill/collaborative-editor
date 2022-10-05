-- migrate:up
DROP TABLE IF EXISTS
app.document_update_document_history CASCADE;
DROP TABLE IF EXISTS
app.document_history CASCADE;

CREATE OR REPLACE VIEW
app.document_history_updates AS (
  SELECT
    to_timestamp (extract ('epoch' from created_at)::int/60*60) as time_slice,
    document_updates_queue.id as document_updates_queue_id,
    document_id,
    user_id
  from app.document_updates_queue
  order by time_slice ASC
);

CREATE OR REPLACE VIEW
app.document_history (seq, time_slice, user_id, document_id, count) AS (
  SELECT
    row_number() over(
        partition by document_id order by time_slice asc
    ) as sequence,
    time_slice,
    user_id,
    document_id,
    count(document_updates_queue_id)
  from app.document_history_updates updates
  group by time_slice, user_id, document_id
  order by time_slice ASC
);


GRANT SELECT on app.document_history_updates TO postgraphile_user;
GRANT SELECT on app.document_history TO postgraphile_user;


-- migrate:down

DROP VIEW app.document_history CASCADE;
DROP VIEW app.document_history_updates CASCADE;