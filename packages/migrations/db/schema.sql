SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    password text
);


--
-- Name: TABLE "user"; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON TABLE app."user" IS '
@name user
@omit create,update,delete

User Table

The base entity for the application.';


--
-- Name: COLUMN "user".password; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON COLUMN app."user".password IS '
@name password
@omit

Password

hashed, still sensitive, do not expose to GQL
';


--
-- Name: create_user(text, text); Type: FUNCTION; Schema: app; Owner: -
--

CREATE FUNCTION app.create_user(name text, password text) RETURNS app."user"
    LANGUAGE sql STRICT
    AS $$
  INSERT INTO app.user
    (name, password)
    VALUES (name, crypt(password, gen_salt('bf')))
    RETURNING *;
$$;


--
-- Name: FUNCTION create_user(name text, password text); Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON FUNCTION app.create_user(name text, password text) IS 'Create User

Creates a user with a given password. A random salt is
generated, and applied for each password when it is first
created.
';


--
-- Name: user_document; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.user_document (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_id uuid,
    user_id uuid
);


--
-- Name: TABLE user_document; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON TABLE app.user_document IS '
@name user_document
@omit create,update,delete

# User Documents

Manages access control relationship to documents for users

';


--
-- Name: invite_user_to_document(text, uuid); Type: FUNCTION; Schema: app; Owner: -
--

CREATE FUNCTION app.invite_user_to_document(name text, document_id uuid) RETURNS app.user_document
    LANGUAGE sql STRICT
    AS $$
  INSERT INTO app.user_document
    (user_id, document_id)
    VALUES ((SELECT id FROM app.user where name=name), document_id)
    RETURNING *;
$$;


--
-- Name: me(); Type: FUNCTION; Schema: app; Owner: -
--

CREATE FUNCTION app.me() RETURNS app."user"
    LANGUAGE sql STABLE
    AS $$
  SELECT * FROM app.user WHERE id = current_user_id()
$$;


--
-- Name: document; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.document (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    creator_id uuid NOT NULL,
    is_public boolean DEFAULT false,
    name text DEFAULT ''::text NOT NULL,
    origin bytea NOT NULL,
    value text NOT NULL,
    web_rtc_key text NOT NULL,
    latest_update_time timestamp without time zone NOT NULL
);


--
-- Name: TABLE document; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON TABLE app.document IS '
@name document
@omit create,update,delete

# Documents

The source of truth for all documents in the system.

';


--
-- Name: COLUMN document.latest_update_time; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON COLUMN app.document.latest_update_time IS '
@name latest_update_time
@omit create,update

# Last Update Time

Updates are processed through the document_updates_queue table first.
This records time of the last update processed.

TODO: this should be a foreign key that points directly to a row in
the document_updates_queue table.

';


--
-- Name: search_documents(text); Type: FUNCTION; Schema: app; Owner: -
--

CREATE FUNCTION app.search_documents(search text) RETURNS SETOF app.document
    LANGUAGE sql STABLE
    AS $$
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
  ) $$;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    password text DEFAULT ''::text NOT NULL
);


--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.users IS '
@name users
@omit create,update,delete';


--
-- Name: COLUMN users.password; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.password IS '
@name password
@omit';


--
-- Name: create_user(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_user(name text, password text) RETURNS public.users
    LANGUAGE sql STRICT
    AS $$
  INSERT INTO users
    (name, password)
    VALUES (name, crypt(password, gen_salt('bf')))
    RETURNING *;
$$;


--
-- Name: current_user_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.current_user_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT nullif(current_setting('app.user_id', true), '')::uuid;
$$;


--
-- Name: FUNCTION current_user_id(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.current_user_id() IS 'current_user_id

Gets the current user_id from the session settings. Calling client
must set this setting to enable row level security.

@omit
';


--
-- Name: user_document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_document (
    document_id uuid,
    user_id uuid,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


--
-- Name: TABLE user_document; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_document IS '
@name user_document
@omit create,update,delete';


--
-- Name: invite_user_to_document(text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.invite_user_to_document(name text, document_id uuid) RETURNS public.user_document
    LANGUAGE sql STRICT
    AS $$
  INSERT INTO user_document
    (user_id, document_id)
    VALUES ((SELECT users.id FROM users where name=name), document_id)
    RETURNING *;
$$;


--
-- Name: me(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.me() RETURNS public.users
    LANGUAGE sql STABLE
    AS $$
  SELECT * FROM users WHERE id = current_user_id()
$$;


--
-- Name: access_token; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.access_token (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: data_upload; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.data_upload (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    file_name text NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    size integer NOT NULL,
    mime_type text NOT NULL
);


--
-- Name: TABLE data_upload; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON TABLE app.data_upload IS '
@name data_upload
@omit create,update,delete

Data Uploads

This is a table with external keys to links on
an external system (GCS storage bucket)

';


--
-- Name: document_updates_queue; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.document_updates_queue (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    document_id uuid NOT NULL,
    document_update bytea NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    structs jsonb
);


--
-- Name: TABLE document_updates_queue; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON TABLE app.document_updates_queue IS '
@name document_updates_queue
@omit

# Document Update Queue

Updates to the main document CRDT are persisted here first,
and are eventually processed into the main Document table.

Is not exposed through GQL endpoints.

';


--
-- Name: document_history_updates; Type: VIEW; Schema: app; Owner: -
--

CREATE VIEW app.document_history_updates AS
 SELECT to_timestamp(((((date_part('epoch'::text, document_updates_queue.created_at))::integer / 60) * 60))::double precision) AS time_slice,
    document_updates_queue.id AS document_updates_queue_id,
    document_updates_queue.document_id,
    document_updates_queue.user_id
   FROM app.document_updates_queue
  ORDER BY (to_timestamp(((((date_part('epoch'::text, document_updates_queue.created_at))::integer / 60) * 60))::double precision));


--
-- Name: document_history; Type: VIEW; Schema: app; Owner: -
--

CREATE VIEW app.document_history AS
 SELECT row_number() OVER (PARTITION BY updates.document_id ORDER BY updates.time_slice) AS seq,
    updates.time_slice,
    updates.user_id,
    updates.document_id,
    count(updates.document_updates_queue_id) AS count
   FROM app.document_history_updates updates
  GROUP BY updates.time_slice, updates.user_id, updates.document_id
  ORDER BY updates.time_slice;


--
-- Name: document_tags; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.document_tags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_id uuid NOT NULL,
    tag text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE document_tags; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON TABLE app.document_tags IS '
@name document_tags
@omit create,update,delete

# Document Tags

Tags associated with each document.

';


--
-- Name: document_templates; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.document_templates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    content text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE document_templates; Type: COMMENT; Schema: app; Owner: -
--

COMMENT ON TABLE app.document_templates IS '
@name document_templates
';


--
-- Name: access_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access_token (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE access_token; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.access_token IS '

Access Tokens

Used to authenticate user on API endpoints. If compromised, these can be revoked.
';


--
-- Name: data_upload; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_upload (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
    file_name text NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    size integer NOT NULL,
    mime_type text NOT NULL
);


--
-- Name: TABLE data_upload; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.data_upload IS '
@name data_upload
@omit create,update,delete';


--
-- Name: document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    value text NOT NULL,
    web_rtc_key text NOT NULL,
    origin bytea NOT NULL,
    latest_update_time timestamp without time zone NOT NULL,
    creator_id uuid NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    name text DEFAULT ''::text NOT NULL
);


--
-- Name: TABLE document; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.document IS '
@name document
@omit create,update,delete';


--
-- Name: COLUMN document.latest_update_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.document.latest_update_time IS '
@name latest_update_time
@omit create,update';


--
-- Name: document_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_history (
    document_id uuid NOT NULL,
    diff text NOT NULL,
    sequence integer NOT NULL
);


--
-- Name: TABLE document_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.document_history IS '
@name document history
@omit create,update,delete';


--
-- Name: document_history_sequence_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.document_history_sequence_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: document_history_sequence_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.document_history_sequence_seq OWNED BY public.document_history.sequence;


--
-- Name: document_update_document_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_update_document_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_update_id uuid NOT NULL,
    document_id uuid NOT NULL,
    sequence integer NOT NULL
);


--
-- Name: document_updates_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_updates_queue (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_id uuid NOT NULL,
    document_update bytea NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id uuid
);


--
-- Name: TABLE document_updates_queue; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.document_updates_queue IS '
@name document_updates_queue
@omit';


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.schema_migrations IS '
@name schema_migrations
@omit';


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: document_history sequence; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_history ALTER COLUMN sequence SET DEFAULT nextval('public.document_history_sequence_seq'::regclass);


--
-- Name: access_token access_token_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.access_token
    ADD CONSTRAINT access_token_pkey PRIMARY KEY (id);


--
-- Name: data_upload data_upload_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.data_upload
    ADD CONSTRAINT data_upload_pkey PRIMARY KEY (id);


--
-- Name: document document_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


--
-- Name: document_tags document_tags_document_id_tag_key; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document_tags
    ADD CONSTRAINT document_tags_document_id_tag_key UNIQUE (document_id, tag);


--
-- Name: document_tags document_tags_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document_tags
    ADD CONSTRAINT document_tags_pkey PRIMARY KEY (id);


--
-- Name: document_templates document_templates_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document_templates
    ADD CONSTRAINT document_templates_pkey PRIMARY KEY (id);


--
-- Name: document_updates_queue document_updates_queue_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document_updates_queue
    ADD CONSTRAINT document_updates_queue_pkey PRIMARY KEY (id);


--
-- Name: user_document user_document_document_id_user_id_key; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.user_document
    ADD CONSTRAINT user_document_document_id_user_id_key UNIQUE (document_id, user_id);


--
-- Name: user_document user_document_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.user_document
    ADD CONSTRAINT user_document_pkey PRIMARY KEY (id);


--
-- Name: user user_name_key; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app."user"
    ADD CONSTRAINT user_name_key UNIQUE (name);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: access_token access_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_token
    ADD CONSTRAINT access_token_pkey PRIMARY KEY (id);


--
-- Name: data_upload data_upload_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_upload
    ADD CONSTRAINT data_upload_pkey PRIMARY KEY (id);


--
-- Name: document_history document_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_history
    ADD CONSTRAINT document_history_pkey PRIMARY KEY (document_id, sequence);


--
-- Name: document document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


--
-- Name: document_update_document_history document_update_document_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_update_document_history
    ADD CONSTRAINT document_update_document_history_pkey PRIMARY KEY (id);


--
-- Name: document_updates_queue document_updates_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_updates_queue
    ADD CONSTRAINT document_updates_queue_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users unique_user_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_user_name UNIQUE (name);


--
-- Name: user_document user_document_document_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_document
    ADD CONSTRAINT user_document_document_id_user_id_key UNIQUE (document_id, user_id);


--
-- Name: user_document user_document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_document
    ADD CONSTRAINT user_document_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: access_token access_token_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.access_token
    ADD CONSTRAINT access_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES app."user"(id) ON DELETE CASCADE;


--
-- Name: data_upload data_upload_owner_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.data_upload
    ADD CONSTRAINT data_upload_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES app."user"(id) ON DELETE CASCADE;


--
-- Name: document document_creator_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document
    ADD CONSTRAINT document_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES app."user"(id) ON DELETE CASCADE;


--
-- Name: document_tags document_tags_document_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document_tags
    ADD CONSTRAINT document_tags_document_id_fkey FOREIGN KEY (document_id) REFERENCES app.document(id) ON DELETE CASCADE;


--
-- Name: document_templates document_templates_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document_templates
    ADD CONSTRAINT document_templates_user_id_fkey FOREIGN KEY (user_id) REFERENCES app."user"(id) ON DELETE CASCADE;


--
-- Name: document_updates_queue document_updates_queue_document_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document_updates_queue
    ADD CONSTRAINT document_updates_queue_document_id_fkey FOREIGN KEY (document_id) REFERENCES app.document(id) ON DELETE CASCADE;


--
-- Name: document_updates_queue document_updates_queue_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.document_updates_queue
    ADD CONSTRAINT document_updates_queue_user_id_fkey FOREIGN KEY (user_id) REFERENCES app."user"(id) ON DELETE CASCADE;


--
-- Name: user_document user_document_document_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.user_document
    ADD CONSTRAINT user_document_document_id_fkey FOREIGN KEY (document_id) REFERENCES app.document(id) ON DELETE CASCADE;


--
-- Name: user_document user_document_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.user_document
    ADD CONSTRAINT user_document_user_id_fkey FOREIGN KEY (user_id) REFERENCES app."user"(id) ON DELETE CASCADE;


--
-- Name: access_token access_token_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_token
    ADD CONSTRAINT access_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: data_upload data_upload_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_upload
    ADD CONSTRAINT data_upload_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: document document_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: document_history document_history_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_history
    ADD CONSTRAINT document_history_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.document(id) ON DELETE CASCADE;


--
-- Name: document_update_document_history document_update_document_history_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_update_document_history
    ADD CONSTRAINT document_update_document_history_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.document(id) ON DELETE CASCADE;


--
-- Name: document_update_document_history document_update_document_history_document_id_sequence_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_update_document_history
    ADD CONSTRAINT document_update_document_history_document_id_sequence_fkey FOREIGN KEY (document_id, sequence) REFERENCES public.document_history(document_id, sequence) ON DELETE CASCADE;


--
-- Name: document_update_document_history document_update_document_history_document_update_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_update_document_history
    ADD CONSTRAINT document_update_document_history_document_update_id_fkey FOREIGN KEY (document_update_id) REFERENCES public.document_updates_queue(id) ON DELETE CASCADE;


--
-- Name: document_updates_queue document_updates_queue_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_updates_queue
    ADD CONSTRAINT document_updates_queue_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.document(id) ON DELETE CASCADE;


--
-- Name: document_updates_queue document_updates_queue_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_updates_queue
    ADD CONSTRAINT document_updates_queue_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_document user_document_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_document
    ADD CONSTRAINT user_document_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.document(id) ON DELETE CASCADE;


--
-- Name: user_document user_document_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_document
    ADD CONSTRAINT user_document_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: data_upload access_data_uploads; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY access_data_uploads ON app.data_upload TO postgraphile_user USING ((owner_id = public.current_user_id())) WITH CHECK ((owner_id = public.current_user_id()));


--
-- Name: access_token; Type: ROW SECURITY; Schema: app; Owner: -
--

ALTER TABLE app.access_token ENABLE ROW LEVEL SECURITY;

--
-- Name: access_token access_token_if_allowed; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY access_token_if_allowed ON app.access_token TO postgraphile_user USING ((user_id = public.current_user_id())) WITH CHECK ((user_id = public.current_user_id()));


--
-- Name: document all_for_owner; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY all_for_owner ON app.document TO postgraphile_user USING ((creator_id = public.current_user_id())) WITH CHECK ((creator_id = public.current_user_id()));


--
-- Name: document create_document_for_current_user; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY create_document_for_current_user ON app.document FOR INSERT TO postgraphile_user WITH CHECK ((creator_id = public.current_user_id()));


--
-- Name: data_upload; Type: ROW SECURITY; Schema: app; Owner: -
--

ALTER TABLE app.data_upload ENABLE ROW LEVEL SECURITY;

--
-- Name: document; Type: ROW SECURITY; Schema: app; Owner: -
--

ALTER TABLE app.document ENABLE ROW LEVEL SECURITY;

--
-- Name: document_tags; Type: ROW SECURITY; Schema: app; Owner: -
--

ALTER TABLE app.document_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: document_tags document_tags_if_allowed; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY document_tags_if_allowed ON app.document_tags TO postgraphile_user USING ((document_id IN ( SELECT document.id
   FROM app.document
  WHERE (document.id = document_tags.document_id)))) WITH CHECK ((document_id IN ( SELECT document.id
   FROM app.document
  WHERE (document.id = document_tags.document_id))));


--
-- Name: document_templates; Type: ROW SECURITY; Schema: app; Owner: -
--

ALTER TABLE app.document_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: document_templates document_templates_if_allowed; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY document_templates_if_allowed ON app.document_templates TO postgraphile_user USING (((user_id IS NULL) OR (user_id = public.current_user_id()))) WITH CHECK ((user_id = public.current_user_id()));


--
-- Name: document_updates_queue document_updates_queue_if_allowed; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY document_updates_queue_if_allowed ON app.document_updates_queue TO postgraphile_user USING ((document_id IN ( SELECT document.id
   FROM app.document
  WHERE (document.id = document_updates_queue.document_id)))) WITH CHECK ((document_id IN ( SELECT document.id
   FROM app.document
  WHERE (document.id = document_updates_queue.document_id))));


--
-- Name: user_document invite_to_document_if_allowed; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY invite_to_document_if_allowed ON app.user_document FOR INSERT TO postgraphile_user WITH CHECK ((document_id IN ( SELECT document.id
   FROM app.document
  WHERE (document.creator_id = public.current_user_id()))));


--
-- Name: document select_document_if_allowed; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY select_document_if_allowed ON app.document FOR SELECT TO postgraphile_user USING (((creator_id = public.current_user_id()) OR (is_public = true) OR (id IN ( SELECT user_document.document_id
   FROM app.user_document
  WHERE (user_document.user_id = public.current_user_id())))));


--
-- Name: user_document; Type: ROW SECURITY; Schema: app; Owner: -
--

ALTER TABLE app.user_document ENABLE ROW LEVEL SECURITY;

--
-- Name: data_upload access_data_uploads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY access_data_uploads ON public.data_upload TO postgraphile_user USING ((owner_id = public.current_user_id())) WITH CHECK ((owner_id = public.current_user_id()));


--
-- Name: access_token; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.access_token ENABLE ROW LEVEL SECURITY;

--
-- Name: access_token access_token_if_allowed; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY access_token_if_allowed ON public.access_token TO postgraphile_user USING ((user_id = public.current_user_id())) WITH CHECK ((user_id = public.current_user_id()));


--
-- Name: document all_for_owner; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY all_for_owner ON public.document TO postgraphile_user USING ((creator_id = public.current_user_id())) WITH CHECK ((creator_id = public.current_user_id()));


--
-- Name: document create_document_for_current_user; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY create_document_for_current_user ON public.document FOR INSERT TO postgraphile_user WITH CHECK ((creator_id = public.current_user_id()));


--
-- Name: data_upload; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.data_upload ENABLE ROW LEVEL SECURITY;

--
-- Name: document; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.document ENABLE ROW LEVEL SECURITY;

--
-- Name: document_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.document_history ENABLE ROW LEVEL SECURITY;

--
-- Name: document_updates_queue document_updates_queue_if_allowed; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY document_updates_queue_if_allowed ON public.document_updates_queue TO postgraphile_user USING ((document_id IN ( SELECT document.id
   FROM public.document
  WHERE (document.id = document_updates_queue.document_id)))) WITH CHECK ((document_id IN ( SELECT document.id
   FROM public.document
  WHERE (document.id = document_updates_queue.document_id))));


--
-- Name: user_document invite_to_document_if_allowed; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY invite_to_document_if_allowed ON public.user_document FOR INSERT TO postgraphile_user WITH CHECK ((document_id IN ( SELECT document.id
   FROM public.document
  WHERE (document.creator_id = public.current_user_id()))));


--
-- Name: document_history select_document_history_if_allowed; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY select_document_history_if_allowed ON public.document_history FOR SELECT TO postgraphile_user USING ((document_id IN ( SELECT document.id
   FROM public.document
  WHERE (document.id = document_history.document_id))));


--
-- Name: document select_document_if_allowed; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY select_document_if_allowed ON public.document FOR SELECT TO postgraphile_user USING (((creator_id = public.current_user_id()) OR (is_public = true) OR (id IN ( SELECT user_document.document_id
   FROM public.user_document
  WHERE (user_document.user_id = public.current_user_id())))));


--
-- Name: user_document; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_document ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20210629194148'),
    ('20210713211341'),
    ('20210715214346'),
    ('20210720160437'),
    ('20210722161826'),
    ('20210722181845'),
    ('20210723153150'),
    ('20210726125556'),
    ('20210726224018'),
    ('20210729151156'),
    ('20210802130820'),
    ('20210824213638'),
    ('20210827184910'),
    ('20210830223744'),
    ('20211001124627'),
    ('20220405024517'),
    ('20220429204045'),
    ('20220518124101'),
    ('20220629005921'),
    ('20220701142108'),
    ('20220712185036'),
    ('20220714214707'),
    ('20220717162732'),
    ('20220717194812'),
    ('20220725215639'),
    ('20220728132102'),
    ('20220813173507'),
    ('20220817220159'),
    ('20220820213316'),
    ('20220821170138'),
    ('20220830221420'),
    ('20220902171603'),
    ('20220903210733'),
    ('20220920132631'),
    ('20220925191921'),
    ('20220928214549');
