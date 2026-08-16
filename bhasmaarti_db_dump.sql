--
-- PostgreSQL database dump
--

\restrict IsyRVrOu4VF9SV0e8HFe4hLgNP7mQiusT1oDstlyURMrCgaqMttMGfIi16dtuNx

-- Dumped from database version 14.24 (Homebrew)
-- Dumped by pg_dump version 14.24 (Homebrew)

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
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aartis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aartis (
    id integer NOT NULL,
    title text NOT NULL,
    category character varying(100) NOT NULL,
    duration character varying(50) NOT NULL,
    video_url text NOT NULL,
    thumbnail_url text,
    status character varying(50) DEFAULT 'Published'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.aartis OWNER TO postgres;

--
-- Name: aartis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aartis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.aartis_id_seq OWNER TO postgres;

--
-- Name: aartis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aartis_id_seq OWNED BY public.aartis.id;


--
-- Name: about_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.about_settings (
    id integer DEFAULT 1 NOT NULL,
    eyebrow text NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    text_1 text NOT NULL,
    text_2 text NOT NULL,
    stats jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT about_settings_id_check CHECK ((id = 1))
);


ALTER TABLE public.about_settings OWNER TO postgres;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'administrator'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_id_seq OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: calendar_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_events (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date character varying(100) NOT NULL,
    image_url text NOT NULL,
    more_info text,
    aartis_count integer DEFAULT 5 NOT NULL,
    status character varying(50) DEFAULT 'Published'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.calendar_events OWNER TO postgres;

--
-- Name: calendar_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calendar_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.calendar_events_id_seq OWNER TO postgres;

--
-- Name: calendar_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calendar_events_id_seq OWNED BY public.calendar_events.id;


--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_items (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date character varying(100) NOT NULL,
    image_url text NOT NULL,
    status character varying(50) DEFAULT 'Published'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery_items OWNER TO postgres;

--
-- Name: gallery_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gallery_items_id_seq OWNER TO postgres;

--
-- Name: gallery_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_items_id_seq OWNED BY public.gallery_items.id;


--
-- Name: hero_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hero_settings (
    id integer DEFAULT 1 NOT NULL,
    eyebrow text NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    cta_primary text NOT NULL,
    cta_secondary text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT hero_settings_id_check CHECK ((id = 1))
);


ALTER TABLE public.hero_settings OWNER TO postgres;

--
-- Name: library_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.library_items (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    category character varying(100) NOT NULL,
    duration character varying(50) NOT NULL,
    lyrics text,
    translation text,
    audio_url text NOT NULL,
    thumbnail_url text,
    status character varying(50) DEFAULT 'Published'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.library_items OWNER TO postgres;

--
-- Name: library_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.library_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.library_items_id_seq OWNER TO postgres;

--
-- Name: library_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.library_items_id_seq OWNED BY public.library_items.id;


--
-- Name: media_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media_items (
    id integer NOT NULL,
    name text NOT NULL,
    filename text NOT NULL,
    file_type character varying(50) NOT NULL,
    file_url text NOT NULL,
    file_size bigint NOT NULL,
    duration character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.media_items OWNER TO postgres;

--
-- Name: media_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.media_items_id_seq OWNER TO postgres;

--
-- Name: media_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_items_id_seq OWNED BY public.media_items.id;


--
-- Name: trust_features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trust_features (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image_url text,
    status character varying(50) DEFAULT 'Active'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trust_features OWNER TO postgres;

--
-- Name: trust_features_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trust_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trust_features_id_seq OWNER TO postgres;

--
-- Name: trust_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trust_features_id_seq OWNED BY public.trust_features.id;


--
-- Name: trust_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trust_settings (
    id integer DEFAULT 1 NOT NULL,
    eyebrow text NOT NULL,
    title text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT trust_settings_id_check CHECK ((id = 1))
);


ALTER TABLE public.trust_settings OWNER TO postgres;

--
-- Name: aartis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aartis ALTER COLUMN id SET DEFAULT nextval('public.aartis_id_seq'::regclass);


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: calendar_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_events ALTER COLUMN id SET DEFAULT nextval('public.calendar_events_id_seq'::regclass);


--
-- Name: gallery_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items ALTER COLUMN id SET DEFAULT nextval('public.gallery_items_id_seq'::regclass);


--
-- Name: library_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.library_items ALTER COLUMN id SET DEFAULT nextval('public.library_items_id_seq'::regclass);


--
-- Name: media_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_items ALTER COLUMN id SET DEFAULT nextval('public.media_items_id_seq'::regclass);


--
-- Name: trust_features id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trust_features ALTER COLUMN id SET DEFAULT nextval('public.trust_features_id_seq'::regclass);


--
-- Data for Name: aartis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.aartis (id, title, category, duration, video_url, thumbnail_url, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: about_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.about_settings (id, eyebrow, title, subtitle, text_1, text_2, stats, updated_at) FROM stdin;
1	The Sacred Legend	Shri Mahakaleshwar Jyotirlinga	One of the Twelve Sacred Jyotirlingas of India	Located in the ancient city of Ujjain, Shri Mahakaleshwar Jyotirlinga is one of the most powerful manifestations of Lord Shiva on earth — a sacred flame of divine consciousness that has burned continuously since the dawn of cosmic time.	Known as the only Dakshinamukhi Jyotirlinga — the one that faces south — Mahakaleshwar represents the supreme force of time itself. As Mahakal, Lord Shiva is the master of death and liberation, transcending the boundaries of past, present, and future.	[{"id": 1, "label": "Sacred Jyotirlingas", "value": "12"}, {"id": 2, "label": "Years of History", "value": "5000+"}, {"id": 3, "label": "Daily Aartis", "value": "6"}, {"id": 4, "label": "Divine Blessings", "value": "∞"}]	2026-06-16 17:14:17.400702+05:30
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, name, email, password, role, is_active, last_login, created_at, updated_at) FROM stdin;
4	Krishnansh	krishnansh@bhasmaarti.com	$2a$12$WFL658TV.Eq0pq1aBBa44uxBiCg9X.UY5AlhuVl1pWjM9stk0k/yu	administrator	t	2026-06-16 16:40:34.947016+05:30	2026-06-16 16:40:18.987771+05:30	2026-06-16 16:40:34.947016+05:30
1	Temple Admin	admin@bhasmaarti.com	$2a$12$WHZzne.a68v9f4OZeMHJRO0ZQGS4y.R3..5EAwTtd7Kir.rdlAkyC	administrator	t	2026-08-16 21:08:38.039519+05:30	2026-06-16 16:12:03.868346+05:30	2026-08-17 00:21:07.551067+05:30
\.


--
-- Data for Name: calendar_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendar_events (id, title, description, date, image_url, more_info, aartis_count, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: gallery_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery_items (id, title, description, date, image_url, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: hero_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hero_settings (id, eyebrow, title, subtitle, cta_primary, cta_secondary, updated_at) FROM stdin;
1	Shri Mahakaleshwar Jyotirlinga, Ujjain	Experience the Divine Presence of Mahakal	Discover the sacred world of Shri Mahakaleshwar Jyotirlinga through recorded Bhasma Aarti videos, devotional archives, temple information, spiritual resources, and festival celebrations from the holy city of Ujjain.	Watch Latest Bhasma Aarti	Explore Archive	2026-06-16 16:56:41.563461+05:30
\.


--
-- Data for Name: library_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.library_items (id, title, description, category, duration, lyrics, translation, audio_url, thumbnail_url, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: media_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media_items (id, name, filename, file_type, file_url, file_size, duration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: trust_features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trust_features (id, title, description, image_url, status, created_at, updated_at) FROM stdin;
1	Daily Updated Archive	Fresh Bhasma Aarti recordings added regularly to our growing collection	/aarti-diya-thumb.png	Active	2026-06-16 17:17:44.836132+05:30	2026-06-16 17:17:44.836132+05:30
2	Temple Information	Accurate, curated details about Mahakaleshwar Jyotirlinga and its sacred history	/temple-bell-thumb.png	Active	2026-06-16 17:17:44.837296+05:30	2026-06-16 17:17:44.837296+05:30
3	Festival Coverage	Immersive coverage of Mahashivratri, Shravan Maas, and other sacred occasions	/bhasma-aarti-preview.png	Active	2026-06-16 17:17:44.837901+05:30	2026-06-16 17:17:44.837901+05:30
4	Devotional Library	Stotras, mantras, bhajans, and sacred texts in one curated spiritual resource	/temple-bell-thumb.png	Active	2026-06-16 17:17:44.838325+05:30	2026-06-16 17:17:44.838325+05:30
6	Live Streaming Ready	Infrastructure in place for future live Bhasma Aarti streaming experiences	/bhasma-aarti-preview.png	Active	2026-06-16 17:17:44.839042+05:30	2026-06-16 17:17:44.839042+05:30
5	Mobile Optimized	Seamless devotional experience across all your devices, anytime on the browser	/aarti-diya-thumb.png	Active	2026-06-16 17:17:44.838642+05:30	2026-06-16 17:23:14.751452+05:30
\.


--
-- Data for Name: trust_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trust_settings (id, eyebrow, title, updated_at) FROM stdin;
1	Why BhasmaArti.com	Sacred. Authentic. Devotional.	2026-06-16 17:17:44.833642+05:30
\.


--
-- Name: aartis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.aartis_id_seq', 15, true);


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 5, true);


--
-- Name: calendar_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calendar_events_id_seq', 1, false);


--
-- Name: gallery_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gallery_items_id_seq', 1, false);


--
-- Name: library_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.library_items_id_seq', 1, false);


--
-- Name: media_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_items_id_seq', 30, true);


--
-- Name: trust_features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trust_features_id_seq', 6, true);


--
-- Name: aartis aartis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aartis
    ADD CONSTRAINT aartis_pkey PRIMARY KEY (id);


--
-- Name: about_settings about_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_settings
    ADD CONSTRAINT about_settings_pkey PRIMARY KEY (id);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: calendar_events calendar_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT calendar_events_pkey PRIMARY KEY (id);


--
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- Name: hero_settings hero_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hero_settings
    ADD CONSTRAINT hero_settings_pkey PRIMARY KEY (id);


--
-- Name: library_items library_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.library_items
    ADD CONSTRAINT library_items_pkey PRIMARY KEY (id);


--
-- Name: media_items media_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_pkey PRIMARY KEY (id);


--
-- Name: trust_features trust_features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trust_features
    ADD CONSTRAINT trust_features_pkey PRIMARY KEY (id);


--
-- Name: trust_settings trust_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trust_settings
    ADD CONSTRAINT trust_settings_pkey PRIMARY KEY (id);


--
-- Name: admins trg_admins_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- PostgreSQL database dump complete
--

\unrestrict IsyRVrOu4VF9SV0e8HFe4hLgNP7mQiusT1oDstlyURMrCgaqMttMGfIi16dtuNx

