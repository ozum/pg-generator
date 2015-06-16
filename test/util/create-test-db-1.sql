--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.5
-- Dumped by pg_dump version 9.3.1
-- Started on 2014-12-24 15:40:43 EET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 7 (class 2615 OID 277720)
-- Name: extra_modules; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extra_modules;


--
-- TOC entry 8 (class 2615 OID 277841)
-- Name: other_schema; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA other_schema;


--
-- TOC entry 188 (class 3079 OID 12018)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2432 (class 0 OID 0)
-- Dependencies: 188
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 189 (class 3079 OID 277721)
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA extra_modules;


--
-- TOC entry 2433 (class 0 OID 0)
-- Dependencies: 189
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


SET search_path = public, pg_catalog;

--
-- TOC entry 600 (class 1247 OID 277846)
-- Name: composite_udt; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE composite_udt AS (
	company_id integer,
	business_unit_id integer
);


--
-- TOC entry 603 (class 1247 OID 277848)
-- Name: enumerated_udt; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE enumerated_udt AS ENUM (
    'option_a',
    'option_b'
);


--
-- TOC entry 599 (class 1247 OID 277842)
-- Name: tax_no; Type: DOMAIN; Schema: public; Owner: -
--

CREATE DOMAIN tax_no AS character varying(20) NOT NULL DEFAULT 1234;


--
-- TOC entry 257 (class 1255 OID 277843)
-- Name: t_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION t_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
     NEW.updated_at := now();
     RETURN NEW;
END;
$$;


SET search_path = other_schema, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 185 (class 1259 OID 277937)
-- Name: other_schema_table; Type: TABLE; Schema: other_schema; Owner: -; Tablespace:
--

CREATE TABLE other_schema_table (
    id integer NOT NULL,
    name character varying(20),
    account_id integer
);


--
-- TOC entry 2434 (class 0 OID 0)
-- Dependencies: 185
-- Name: TABLE other_schema_table; Type: COMMENT; Schema: other_schema; Owner: -
--

COMMENT ON TABLE other_schema_table IS 'Diğer bir şemayı kontrol etmek için kullanılan tablo.';


--
-- TOC entry 2435 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN other_schema_table.id; Type: COMMENT; Schema: other_schema; Owner: -
--

COMMENT ON COLUMN other_schema_table.id IS 'Kayıt no.';


--
-- TOC entry 2436 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN other_schema_table.name; Type: COMMENT; Schema: other_schema; Owner: -
--

COMMENT ON COLUMN other_schema_table.name IS 'Adı';


--
-- TOC entry 2437 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN other_schema_table.account_id; Type: COMMENT; Schema: other_schema; Owner: -
--

COMMENT ON COLUMN other_schema_table.account_id IS 'Bağlı olduğu firma.';


--
-- TOC entry 184 (class 1259 OID 277935)
-- Name: other_schema_table_id_seq; Type: SEQUENCE; Schema: other_schema; Owner: -
--

CREATE SEQUENCE other_schema_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2438 (class 0 OID 0)
-- Dependencies: 184
-- Name: other_schema_table_id_seq; Type: SEQUENCE OWNED BY; Schema: other_schema; Owner: -
--

ALTER SEQUENCE other_schema_table_id_seq OWNED BY other_schema_table.id;


SET search_path = public, pg_catalog;

--
-- TOC entry 176 (class 1259 OID 277879)
-- Name: account; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE account (
    id integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    owner_id integer,
    is_active boolean DEFAULT true NOT NULL,
    def_false boolean DEFAULT false NOT NULL,
    name character varying(50) NOT NULL,
    field1 character varying(2)[],
    field2 numeric(3,2)[],
    field3 character(7)[],
    field4 timestamp(0) without time zone[],
    field5 bit(4)[],
    field6 bit varying(10)[],
    field7 timestamp(0) with time zone[],
    field8 time(6) without time zone[],
    field9 time(4) with time zone[],
    field10 smallint[],
    field11 integer[],
    field12 bigint[]
);


--
-- TOC entry 2439 (class 0 OID 0)
-- Dependencies: 176
-- Name: TABLE account; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE account IS 'Firma bilgilerinin tutulduğu tablo.';


--
-- TOC entry 2440 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN account.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN account.id IS 'Kayıt no.';


--
-- TOC entry 2441 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN account.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN account.created_at IS 'Kaydın oluşturulduğu zaman.';


--
-- TOC entry 2442 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN account.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN account.updated_at IS 'Kaydın son güncellendiği zaman.';


--
-- TOC entry 2443 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN account.owner_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN account.owner_id IS 'Şirket sahibi.';


--
-- TOC entry 2444 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN account.is_active; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN account.is_active IS 'Kayıt sistemde aktif olarak kullanılıyor mu. Silme işlemi olmadığından kalabalık yaratması istenmeyen kayıtlar pasif konuma getirilir.';


--
-- TOC entry 2445 (class 0 OID 0)
-- Dependencies: 176
-- Name: COLUMN account.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN account.name IS 'Firma adı.';


--
-- TOC entry 175 (class 1259 OID 277877)
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2446 (class 0 OID 0)
-- Dependencies: 175
-- Name: account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE account_id_seq OWNED BY account.id;


--
-- TOC entry 178 (class 1259 OID 277895)
-- Name: cart; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE cart (
    id integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    contact_id integer NOT NULL
);


--
-- TOC entry 2447 (class 0 OID 0)
-- Dependencies: 178
-- Name: TABLE cart; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE cart IS 'Alışveriş sepetlerini tutan tablo.';


--
-- TOC entry 2448 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN cart.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN cart.id IS 'Kayıt no.';


--
-- TOC entry 2449 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN cart.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN cart.created_at IS 'Kaydın oluşturulduğu zaman.';


--
-- TOC entry 2450 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN cart.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN cart.updated_at IS 'Kaydın son güncellendiği zaman.';


--
-- TOC entry 2451 (class 0 OID 0)
-- Dependencies: 178
-- Name: COLUMN cart.contact_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN cart.contact_id IS 'Alışveriş sepetinin sahibi.';


--
-- TOC entry 177 (class 1259 OID 277893)
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2452 (class 0 OID 0)
-- Dependencies: 177
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE cart_id_seq OWNED BY cart.id;


--
-- TOC entry 181 (class 1259 OID 277917)
-- Name: cart_line_item; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE cart_line_item (
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    quantity smallint DEFAULT 1 NOT NULL
);


--
-- TOC entry 2453 (class 0 OID 0)
-- Dependencies: 181
-- Name: TABLE cart_line_item; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE cart_line_item IS 'Sepetteki ürünleri tutan tablo.';


--
-- TOC entry 2454 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN cart_line_item.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN cart_line_item.created_at IS 'Kaydın oluşturulduğu zaman.';


--
-- TOC entry 2455 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN cart_line_item.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN cart_line_item.updated_at IS 'Kaydın son güncellendiği zaman.';


--
-- TOC entry 2456 (class 0 OID 0)
-- Dependencies: 181
-- Name: COLUMN cart_line_item.quantity; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN cart_line_item.quantity IS 'Sepete eklenen ürün adedi.';


--
-- TOC entry 174 (class 1259 OID 277855)
-- Name: contact; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE contact (
    id integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    name character varying(20) DEFAULT 'oz'::character varying NOT NULL,
    surname character varying(20) DEFAULT 'O''Reilly'::character varying NOT NULL,
    email character varying(20) DEFAULT 'x"x@x.com'::character varying NOT NULL,
    birth_date date DEFAULT '2010-01-01'::date NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    company_id integer NOT NULL,
    second_company_id integer,
    custom json,
    custom_hstore extra_modules.hstore
);


--
-- TOC entry 2457 (class 0 OID 0)
-- Dependencies: 174
-- Name: TABLE contact; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE contact IS 'Kişi bilgilerini tutan tablo.';


--
-- TOC entry 2458 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.id IS 'Kayıt no.';


--
-- TOC entry 2459 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.created_at IS 'Kaydın oluşturulduğu zaman.';


--
-- TOC entry 2460 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.updated_at IS 'Kaydın son güncellendiği zaman.';


--
-- TOC entry 2461 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.name IS 'Kullanıcının adı.';


--
-- TOC entry 2462 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.surname; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.surname IS 'Kullanıcının soyadı.';


--
-- TOC entry 2463 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.email IS 'Kullanıcının e-posta adresi.';


--
-- TOC entry 2464 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.birth_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.birth_date IS 'Doğum tarihi.';


--
-- TOC entry 2465 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.is_active; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.is_active IS 'Kayıt sistemde aktif olarak kullanılıyor mu. Silme işlemi olmadığından kalabalık yaratması istenmeyen kayıtlar pasif konuma getirilir.';


--
-- TOC entry 2466 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.company_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.company_id IS 'İrtibatın dahil olduğu firma.';


--
-- TOC entry 2467 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.second_company_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.second_company_id IS 'İrtibatın ikinci şirketi. (Aynı tablodan aynı tabloya birden fazla relation varsa test etmek için)';


--
-- TOC entry 2468 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.custom; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.custom IS 'JSON formatında custom değerleri tutan alan.';


--
-- TOC entry 2469 (class 0 OID 0)
-- Dependencies: 174
-- Name: COLUMN contact.custom_hstore; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN contact.custom_hstore IS 'HSTORE formatında custom değerleri tutan alan';


--
-- TOC entry 173 (class 1259 OID 277853)
-- Name: contact_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2470 (class 0 OID 0)
-- Dependencies: 173
-- Name: contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE contact_id_seq OWNED BY contact.id;


--
-- TOC entry 180 (class 1259 OID 277907)
-- Name: product; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE product (
    id integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    name character varying(20) NOT NULL,
    product_category_id integer NOT NULL
);


--
-- TOC entry 2471 (class 0 OID 0)
-- Dependencies: 180
-- Name: TABLE product; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE product IS 'Ürünleri tutan tablo.';


--
-- TOC entry 2472 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN product.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN product.id IS 'Kayıt no.';


--
-- TOC entry 2473 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN product.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN product.created_at IS 'Kaydın oluşturulduğu zaman.';


--
-- TOC entry 2474 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN product.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN product.updated_at IS 'Kaydın son güncellendiği zaman.';


--
-- TOC entry 2475 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN product.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN product.name IS 'Ürünün ismi';


--
-- TOC entry 2476 (class 0 OID 0)
-- Dependencies: 180
-- Name: COLUMN product.product_category_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN product.product_category_id IS 'Ürün kategorisi';


--
-- TOC entry 183 (class 1259 OID 277928)
-- Name: product_category; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE product_category (
    id integer NOT NULL,
    parent_category_id integer,
    name character varying(20) NOT NULL
);


--
-- TOC entry 2477 (class 0 OID 0)
-- Dependencies: 183
-- Name: TABLE product_category; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE product_category IS 'Ürün kategorilerini tutan tablo.';


--
-- TOC entry 2478 (class 0 OID 0)
-- Dependencies: 183
-- Name: COLUMN product_category.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN product_category.id IS 'Kayıt no.';


--
-- TOC entry 2479 (class 0 OID 0)
-- Dependencies: 183
-- Name: COLUMN product_category.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN product_category.name IS 'Ürün kategori ismi.';


--
-- TOC entry 182 (class 1259 OID 277926)
-- Name: product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE product_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2480 (class 0 OID 0)
-- Dependencies: 182
-- Name: product_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE product_category_id_seq OWNED BY product_category.id;


--
-- TOC entry 179 (class 1259 OID 277905)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2481 (class 0 OID 0)
-- Dependencies: 179
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE product_id_seq OWNED BY product.id;


--
-- TOC entry 187 (class 1259 OID 277946)
-- Name: type_table; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE type_table (
    id integer NOT NULL,
    person_tax tax_no,
    name character varying(20) DEFAULT 'oz'::character varying,
    company composite_udt,
    options enumerated_udt
);


--
-- TOC entry 2482 (class 0 OID 0)
-- Dependencies: 187
-- Name: TABLE type_table; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE type_table IS 'Table to test custom data types.';


--
-- TOC entry 2483 (class 0 OID 0)
-- Dependencies: 187
-- Name: COLUMN type_table.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN type_table.id IS 'Kayıt no.';


--
-- TOC entry 2484 (class 0 OID 0)
-- Dependencies: 187
-- Name: COLUMN type_table.person_tax; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN type_table.person_tax IS 'Tax number of person.';


--
-- TOC entry 2485 (class 0 OID 0)
-- Dependencies: 187
-- Name: COLUMN type_table.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN type_table.name IS 'Name of the person';


--
-- TOC entry 2486 (class 0 OID 0)
-- Dependencies: 187
-- Name: COLUMN type_table.options; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN type_table.options IS 'Options of person';


--
-- TOC entry 186 (class 1259 OID 277944)
-- Name: type_table_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE type_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2487 (class 0 OID 0)
-- Dependencies: 186
-- Name: type_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE type_table_id_seq OWNED BY type_table.id;


SET search_path = other_schema, pg_catalog;

--
-- TOC entry 2261 (class 2604 OID 277940)
-- Name: id; Type: DEFAULT; Schema: other_schema; Owner: -
--

ALTER TABLE ONLY other_schema_table ALTER COLUMN id SET DEFAULT nextval('other_schema_table_id_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- TOC entry 2247 (class 2604 OID 277882)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY account ALTER COLUMN id SET DEFAULT nextval('account_id_seq'::regclass);


--
-- TOC entry 2251 (class 2604 OID 277898)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY cart ALTER COLUMN id SET DEFAULT nextval('cart_id_seq'::regclass);


--
-- TOC entry 2239 (class 2604 OID 277858)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY contact ALTER COLUMN id SET DEFAULT nextval('contact_id_seq'::regclass);


--
-- TOC entry 2254 (class 2604 OID 277910)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY product ALTER COLUMN id SET DEFAULT nextval('product_id_seq'::regclass);


--
-- TOC entry 2260 (class 2604 OID 277931)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_category ALTER COLUMN id SET DEFAULT nextval('product_category_id_seq'::regclass);


--
-- TOC entry 2262 (class 2604 OID 277949)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY type_table ALTER COLUMN id SET DEFAULT nextval('type_table_id_seq'::regclass);


SET search_path = other_schema, pg_catalog;

--
-- TOC entry 2423 (class 0 OID 277937)
-- Dependencies: 185
-- Data for Name: other_schema_table; Type: TABLE DATA; Schema: other_schema; Owner: -
--

INSERT INTO other_schema_table VALUES (1, 'Super', 1);
INSERT INTO other_schema_table VALUES (2, 'Mega', 1);
INSERT INTO other_schema_table VALUES (3, 'Other', 2);
INSERT INTO other_schema_table VALUES (4, 'Shoe', 2);


--
-- TOC entry 2488 (class 0 OID 0)
-- Dependencies: 184
-- Name: other_schema_table_id_seq; Type: SEQUENCE SET; Schema: other_schema; Owner: -
--

SELECT pg_catalog.setval('other_schema_table_id_seq', 1, true);


SET search_path = public, pg_catalog;

--
-- TOC entry 2414 (class 0 OID 277879)
-- Dependencies: 176
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO account VALUES (1, '2014-12-12 14:41:40', '2014-12-12 14:41:40', NULL, true, false, 'Fortibase', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO account VALUES (2, '2014-12-12 14:41:40', '2014-12-12 14:41:40', NULL, true, false,'FPS Production', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO account VALUES (3, '2014-12-12 14:41:40', '2014-12-12 14:41:40', NULL, true, false,'Microsoft', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO account VALUES (4, '2014-12-12 14:41:40', '2014-12-12 14:41:40', NULL, true, false,'Acme', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- TOC entry 2489 (class 0 OID 0)
-- Dependencies: 175
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('account_id_seq', 4, true);


--
-- TOC entry 2416 (class 0 OID 277895)
-- Dependencies: 178
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO cart VALUES (1, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 1);
INSERT INTO cart VALUES (2, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 4);
INSERT INTO cart VALUES (3, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 3);
INSERT INTO cart VALUES (4, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 2);
INSERT INTO cart VALUES (5, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 1);


--
-- TOC entry 2490 (class 0 OID 0)
-- Dependencies: 177
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('cart_id_seq', 5, true);


--
-- TOC entry 2419 (class 0 OID 277917)
-- Dependencies: 181
-- Data for Name: cart_line_item; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO cart_line_item VALUES (4, 3, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 3);
INSERT INTO cart_line_item VALUES (4, 1, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 1);
INSERT INTO cart_line_item VALUES (3, 3, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 1);
INSERT INTO cart_line_item VALUES (3, 5, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 2);
INSERT INTO cart_line_item VALUES (2, 4, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 1);
INSERT INTO cart_line_item VALUES (2, 1, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 1);
INSERT INTO cart_line_item VALUES (1, 3, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 1);
INSERT INTO cart_line_item VALUES (1, 2, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 3);
INSERT INTO cart_line_item VALUES (1, 1, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 2);


--
-- TOC entry 2412 (class 0 OID 277855)
-- Dependencies: 174
-- Data for Name: contact; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO contact VALUES (1, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Özüm', 'Eldoğan', 'ozum@ozum.net ', '1980-01-02', true, 1, NULL, '{"team":"BJK", "city":"Istanbul"}', '"city"=>"''Istanbul''", "team"=>"''BJK''"');
INSERT INTO contact VALUES (2, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Alihan', 'Karagül', 'a@fpsproduction.com', '2978-01-01', true, 2, NULL, '{"team":"FB", "city":"Istanbul"}', '"city"=>"''Istanbul''", "team"=>"''FB''"');
INSERT INTO contact VALUES (3, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Atalay', 'Saraç', 'atalay@fortibase.com', '1978-03-04', true, 2, NULL, '{"team":"FB", "city":"Istanbul"}', '"city"=>"''Istanbul''", "team"=>"''BJK''"');
INSERT INTO contact VALUES (4, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Ufuk', 'Yurtsever', 'ufuk@fortibase.com', '0150-01-01', true, 2, NULL, '{"team":"FB", "city":"Istanbul"}', '"city"=>"''Istanbul''", "team"=>"''FB''"');


--
-- TOC entry 2491 (class 0 OID 0)
-- Dependencies: 173
-- Name: contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('contact_id_seq', 4, true);


--
-- TOC entry 2418 (class 0 OID 277907)
-- Dependencies: 180
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO product VALUES (1, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Sony Z2', 3);
INSERT INTO product VALUES (2, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Logitech T-14', 5);
INSERT INTO product VALUES (3, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Çikolata', 6);
INSERT INTO product VALUES (4, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Pergel', 7);
INSERT INTO product VALUES (5, '2014-12-12 14:41:40', '2014-12-12 14:41:40', 'Kalem', 7);


--
-- TOC entry 2421 (class 0 OID 277928)
-- Dependencies: 183
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO product_category VALUES (1, NULL, 'Elektronik');
INSERT INTO product_category VALUES (2, 1, 'Telekom');
INSERT INTO product_category VALUES (3, 2, 'Telefon');
INSERT INTO product_category VALUES (4, 1, 'Bilgisayar');
INSERT INTO product_category VALUES (5, 4, 'Mouse');
INSERT INTO product_category VALUES (6, NULL, 'Diğer');
INSERT INTO product_category VALUES (7, NULL, 'Kırtasiye');


--
-- TOC entry 2492 (class 0 OID 0)
-- Dependencies: 182
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('product_category_id_seq', 7, true);


--
-- TOC entry 2493 (class 0 OID 0)
-- Dependencies: 179
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('product_id_seq', 5, true);


--
-- TOC entry 2425 (class 0 OID 277946)
-- Dependencies: 187
-- Data for Name: type_table; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO type_table VALUES (1, '62736273', 'John', '(1,2)', 'option_a');
INSERT INTO type_table VALUES (2, '83736282', 'Michael', '(4,99)', 'option_b');


--
-- TOC entry 2494 (class 0 OID 0)
-- Dependencies: 186
-- Name: type_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('type_table_id_seq', 2, true);


SET search_path = other_schema, pg_catalog;

--
-- TOC entry 2287 (class 2606 OID 277943)
-- Name: Key13; Type: CONSTRAINT; Schema: other_schema; Owner: -; Tablespace:
--

ALTER TABLE ONLY other_schema_table
    ADD CONSTRAINT "Key13" PRIMARY KEY (id);


SET search_path = public, pg_catalog;

--
-- TOC entry 2268 (class 2606 OID 277873)
-- Name: Key1; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY contact
    ADD CONSTRAINT "Key1" PRIMARY KEY (id);


--
-- TOC entry 2273 (class 2606 OID 277891)
-- Name: Key2; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY account
    ADD CONSTRAINT "Key2" PRIMARY KEY (id);


--
-- TOC entry 2276 (class 2606 OID 277903)
-- Name: Key3; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY cart
    ADD CONSTRAINT "Key3" PRIMARY KEY (id);


--
-- TOC entry 2279 (class 2606 OID 277915)
-- Name: Key4; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY product
    ADD CONSTRAINT "Key4" PRIMARY KEY (id);


--
-- TOC entry 2281 (class 2606 OID 277924)
-- Name: Key5; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY cart_line_item
    ADD CONSTRAINT "Key5" PRIMARY KEY (cart_id, product_id);


--
-- TOC entry 2284 (class 2606 OID 277934)
-- Name: Key6; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY product_category
    ADD CONSTRAINT "Key6" PRIMARY KEY (id);


--
-- TOC entry 2270 (class 2606 OID 277875)
-- Name: email; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY contact
    ADD CONSTRAINT email UNIQUE (email);


--
-- TOC entry 2289 (class 2606 OID 277955)
-- Name: type_table_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY type_table
    ADD CONSTRAINT type_table_key PRIMARY KEY (id);


SET search_path = other_schema, pg_catalog;

--
-- TOC entry 2285 (class 1259 OID 277941)
-- Name: IX_other_schema_table_id; Type: INDEX; Schema: other_schema; Owner: -; Tablespace:
--

CREATE INDEX "IX_other_schema_table_id" ON other_schema_table USING btree (account_id);


SET search_path = public, pg_catalog;

--
-- TOC entry 2264 (class 1259 OID 277869)
-- Name: IX_Relationship1; Type: INDEX; Schema: public; Owner: -; Tablespace:
--

CREATE INDEX "IX_Relationship1" ON contact USING btree (company_id);


--
-- TOC entry 2274 (class 1259 OID 277901)
-- Name: IX_Relationship2; Type: INDEX; Schema: public; Owner: -; Tablespace:
--

CREATE INDEX "IX_Relationship2" ON cart USING btree (contact_id);


--
-- TOC entry 2282 (class 1259 OID 277932)
-- Name: IX_Relationship3; Type: INDEX; Schema: public; Owner: -; Tablespace:
--

CREATE INDEX "IX_Relationship3" ON product_category USING btree (parent_category_id);


--
-- TOC entry 2277 (class 1259 OID 277913)
-- Name: IX_Relationship4; Type: INDEX; Schema: public; Owner: -; Tablespace:
--

CREATE INDEX "IX_Relationship4" ON product USING btree (product_category_id);


--
-- TOC entry 2265 (class 1259 OID 277870)
-- Name: IX_Relationship6; Type: INDEX; Schema: public; Owner: -; Tablespace:
--

CREATE INDEX "IX_Relationship6" ON contact USING btree (second_company_id);


--
-- TOC entry 2271 (class 1259 OID 277889)
-- Name: IX_Relationship7; Type: INDEX; Schema: public; Owner: -; Tablespace:
--

CREATE INDEX "IX_Relationship7" ON account USING btree (owner_id);


--
-- TOC entry 2266 (class 1259 OID 277871)
-- Name: IX_Unique_Full_Name; Type: INDEX; Schema: public; Owner: -; Tablespace:
--

CREATE UNIQUE INDEX "IX_Unique_Full_Name" ON contact USING btree (name, surname);


--
-- TOC entry 2299 (class 2620 OID 277876)
-- Name: updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER updated_at BEFORE UPDATE ON contact FOR EACH ROW EXECUTE PROCEDURE t_updated_at();


--
-- TOC entry 2300 (class 2620 OID 277892)
-- Name: updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER updated_at BEFORE UPDATE ON account FOR EACH ROW EXECUTE PROCEDURE t_updated_at();


--
-- TOC entry 2301 (class 2620 OID 277904)
-- Name: updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE PROCEDURE t_updated_at();


--
-- TOC entry 2302 (class 2620 OID 277916)
-- Name: updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER updated_at BEFORE UPDATE ON product FOR EACH ROW EXECUTE PROCEDURE t_updated_at();


--
-- TOC entry 2303 (class 2620 OID 277925)
-- Name: updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER updated_at BEFORE UPDATE ON cart_line_item FOR EACH ROW EXECUTE PROCEDURE t_updated_at();


SET search_path = other_schema, pg_catalog;

--
-- TOC entry 2298 (class 2606 OID 277996)
-- Name: other_schema_tables; Type: FK CONSTRAINT; Schema: other_schema; Owner: -
--

ALTER TABLE ONLY other_schema_table
    ADD CONSTRAINT other_schema_tables FOREIGN KEY (account_id) REFERENCES public.account(id) ON UPDATE CASCADE ON DELETE CASCADE;


SET search_path = public, pg_catalog;

--
-- TOC entry 2295 (class 2606 OID 277966)
-- Name: cart_cart_line_items; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY cart_line_item
    ADD CONSTRAINT cart_cart_line_items FOREIGN KEY (cart_id) REFERENCES cart(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 2293 (class 2606 OID 277961)
-- Name: carts; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY cart
    ADD CONSTRAINT carts FOREIGN KEY (contact_id) REFERENCES contact(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2297 (class 2606 OID 277976)
-- Name: child_product_categories; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product_category
    ADD CONSTRAINT child_product_categories FOREIGN KEY (parent_category_id) REFERENCES product_category(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 2292 (class 2606 OID 277991)
-- Name: owned_companies; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY account
    ADD CONSTRAINT owned_companies FOREIGN KEY (owner_id) REFERENCES contact(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2290 (class 2606 OID 277956)
-- Name: primary_contacts; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY contact
    ADD CONSTRAINT primary_contacts FOREIGN KEY (company_id) REFERENCES account(id);


--
-- TOC entry 2296 (class 2606 OID 277971)
-- Name: product_cart_line_items; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY cart_line_item
    ADD CONSTRAINT product_cart_line_items FOREIGN KEY (product_id) REFERENCES product(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 2294 (class 2606 OID 277981)
-- Name: product_category_products; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY product
    ADD CONSTRAINT product_category_products FOREIGN KEY (product_category_id) REFERENCES product_category(id);


--
-- TOC entry 2291 (class 2606 OID 277986)
-- Name: secondary_contacts; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY contact
    ADD CONSTRAINT secondary_contacts FOREIGN KEY (second_company_id) REFERENCES account(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2014-12-24 15:40:43 EET

--
-- PostgreSQL database dump complete
--

