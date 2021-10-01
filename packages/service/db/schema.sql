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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

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
-- Name: document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    value text NOT NULL,
    web_rtc_key text NOT NULL,
    origin bytea NOT NULL,
    latest_update_time timestamp without time zone NOT NULL,
    creator_id uuid NOT NULL,
    is_public boolean DEFAULT true NOT NULL
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
-- Name: document_updates_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_updates_queue (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_id uuid NOT NULL,
    document_update bytea NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
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
-- Name: document document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


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
-- Name: document document_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: document_updates_queue document_updates_queue_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_updates_queue
    ADD CONSTRAINT document_updates_queue_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.document(id) ON DELETE CASCADE;


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
-- Name: document create_document_for_current_user; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY create_document_for_current_user ON public.document FOR INSERT TO postgraphile_user WITH CHECK ((creator_id = public.current_user_id()));


--
-- Name: document; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.document ENABLE ROW LEVEL SECURITY;

--
-- Name: user_document invite_to_document_if_allowed; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY invite_to_document_if_allowed ON public.user_document FOR INSERT TO postgraphile_user WITH CHECK ((document_id IN ( SELECT document.id
   FROM public.document
  WHERE (document.creator_id = public.current_user_id()))));


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
    ('20210830223744');
