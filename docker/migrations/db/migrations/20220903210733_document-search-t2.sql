-- migrate:up
drop function app.search_documents;
create function app.search_documents(search text)
  returns setof app.document as $$
  with doc_tags as (
    select doc.id, string_agg(tag.tag, ' ') as tags
    from app.document doc
    join app.document_tags tag on tag.document_id = doc.id
    group by doc.id
  )
  select doc.*
  from app.document doc
  left join doc_tags using(id)
  where (
      to_tsvector(value) @@ websearch_to_tsquery(search)
  OR  to_tsvector(doc_tags.tags) @@ websearch_to_tsquery(search)
  ) $$ language sql stable;

-- migrate:down

