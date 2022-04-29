---
slug: 03-database-schema
title: 3 - Data
---

# Database Schema

## Status
Accepted

## Context

Database schema defines the important db entities and their relationships between each other.

## Decision & Consequences

<style>{`
.language-md-diagram {
  font-size: 10px;
  line-height: 12px;
}
`}</style>

```md-diagram
┌───────────────────────────────┐
│░░░░░░░░░░░░░User░░░░░░░░░░░░░░│
├───────────────────────────────┤
│ attribute list                │
│ --------------                │
│                               │
│ id                            │
│ name                          │
│ password                      │
│                               │
│ relationships                 │
│ -------------                 │
│                               │
│ has_many user_documents       │
│ has_many documents through    │
│                               │
└───────────────────────────────┘
                ▲
                │
                │
┌───────────────────────────────┐
│░░░░░░░░░user_document░░░░░░░░░│
├───────────────────────────────┤
│ attribute list                │
│ --------------                │
│                               │
│ id                            │
│ document_id                   │
│ user_id                       │
│                               │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│░░░░░░░░░░░document░░░░░░░░░░░░│
├───────────────────────────────┤
│ attribute list                │
│ --------------                │
│                               │
│ id                            │
│ value                         │
│ web_rtc_key                   │
│ origin                        │
│ latest_update_time            │
│ creator_id                    │
│ is_public                     │
└───────────────────────────────┘
                ▲
                │
                │
┌───────────────────────────────┐
│░░░░document_updates_queue░░░░░│
├───────────────────────────────┤
│ attribute list                │
│ --------------                │
│                               │
│ id                            │
│ document_id                   │
│ document_update               │
│ created_at                    │
└───────────────────────────────┘
```

### Users

```sql
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    password text DEFAULT ''::text NOT NULL
);

ALTER TABLE ONLY users
    ADD CONSTRAINT unique_user_name UNIQUE (name);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
```

### User Document

join table between document and user tables.

```sql
CREATE TABLE user_document (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    document_id uuid,
    user_id uuid
);

ALTER TABLE ONLY user_document
    ADD CONSTRAINT user_document_pkey PRIMARY KEY (id);

ALTER TABLE ONLY user_document
    ADD CONSTRAINT user_document_document_id_user_id_key UNIQUE (document_id, user_id);

ALTER TABLE ONLY user_document
    ADD CONSTRAINT user_document_document_id_fkey FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE;

ALTER TABLE ONLY user_document
    ADD CONSTRAINT user_document_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

### Document

Base editable thing.

```sql

CREATE TABLE document (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    value text NOT NULL,
    web_rtc_key text NOT NULL,
    origin bytea NOT NULL,
    latest_update_time timestamp without time zone NOT NULL,
    creator_id uuid NOT NULL,
    is_public boolean DEFAULT true NOT NULL
);

ALTER TABLE ONLY document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);

ALTER TABLE ONLY document
    ADD CONSTRAINT document_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES users(id);
```
### Document Update Queue

Stores updates to documents. Should be processed in batches and used to update the referenced documents `origin` field. When this happens the document's last processed date should be updated.

```sql
CREATE TABLE document_updates_queue (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    document_id uuid NOT NULL,
    document_update bytea NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY document_updates_queue
    ADD CONSTRAINT document_updates_queue_pkey PRIMARY KEY (id);

ALTER TABLE ONLY document_updates_queue
    ADD CONSTRAINT document_updates_queue_document_id_fkey FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE;
```
