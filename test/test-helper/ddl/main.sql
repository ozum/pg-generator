/*
Created: 2/24/2021
Modified: 3/10/2021
Model: PostgreSQL 12
Database: PostgreSQL 12
*/

-- Create schemas section -------------------------------------------------

CREATE SCHEMA "archive"
;

-- Create tables section -------------------------------------------------

-- Table contact

CREATE TABLE "contact"
(
  "id" Integer NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1),
  "account_id" Integer,
  "region_Id" Integer NOT NULL,
  "name" Character varying(20) NOT NULL,
  "surname" Character varying(20) NOT NULL,
  "phone" Character varying(20),
  "preferred_languages" Character varying(2)[],
  "priority" Smallint DEFAULT 1 NOT NULL
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "contact" IS 'A person who buys goods or a service from our business. In sales, commerce and economics, a customer (sometimes known as a client, buyer, or purchaser) is the recipient of a good, service, product or an idea - obtained from a seller, vendor, or supplier via a financial transaction or exchange for money or some other valuable consideration.'
;
COMMENT ON COLUMN "contact"."id" IS 'Record id.'
;
COMMENT ON COLUMN "contact"."account_id" IS 'Account of the contact.'
;
COMMENT ON COLUMN "contact"."region_Id" IS 'Region of the contact.'
;
COMMENT ON COLUMN "contact"."name" IS 'Name of the contact.'
;
COMMENT ON COLUMN "contact"."surname" IS 'Surname of the contact.'
;
COMMENT ON COLUMN "contact"."phone" IS 'Phone number of the contact.'
;
COMMENT ON COLUMN "contact"."preferred_languages" IS 'Preferred languages of the contact as an array in order of preference.'
;
COMMENT ON COLUMN "contact"."priority" IS 'Contact priority level. 1 is the highest.'
;

CREATE INDEX "IX_customerregion" ON "contact" ("region_Id")
;

CREATE INDEX "IX_customeraccount" ON "contact" ("account_id")
;

ALTER TABLE "contact" ADD CONSTRAINT "PK_contact" PRIMARY KEY ("id")
;

-- Table region

CREATE TABLE "region"
(
  "id" Integer NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1),
  "name" Character varying(20) NOT NULL,
  "parentid" Integer
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "region" IS 'Geographical regions.'
;
COMMENT ON COLUMN "region"."id" IS 'Record id.'
;
COMMENT ON COLUMN "region"."name" IS 'Name of the region.'
;

CREATE INDEX "IX_regionregion" ON "region" ("parentid")
;

ALTER TABLE "region" ADD CONSTRAINT "PK_region" PRIMARY KEY ("id")
;

-- Table account

CREATE TABLE "account"
(
  "id" Integer NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1),
  "name" Character varying(20) NOT NULL,
  "primary_contact_id" Integer,
  "secondary_contact_id" Integer
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "account" IS 'Company or other entity, which contacts are linked.'
;
COMMENT ON COLUMN "account"."id" IS 'Account id.'
;
COMMENT ON COLUMN "account"."name" IS 'Account name.'
;
COMMENT ON COLUMN "account"."primary_contact_id" IS 'Account''s primary contact.'
;
COMMENT ON COLUMN "account"."secondary_contact_id" IS 'Account''s secondary contact.'
;

CREATE INDEX "IX_account_primary_contact" ON "account" ("primary_contact_id")
;

CREATE INDEX "IX_account_secondary_contact" ON "account" ("secondary_contact_id")
;

ALTER TABLE "account" ADD CONSTRAINT "accountId" PRIMARY KEY ("id")
;

-- Table product

CREATE TABLE "product"
(
  "id" Integer NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1),
  "name" Character varying(20) NOT NULL,
  "price" Numeric(10,4) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "product" IS 'a product is an object or system made available for consumer use; it is anything that can be offered to a market to satisfy the desire or need of a customer.'
;
COMMENT ON COLUMN "product"."id" IS 'Record id.'
;
COMMENT ON COLUMN "product"."name" IS 'Name of the product.'
;
COMMENT ON COLUMN "product"."price" IS 'Price of the product.'
;

ALTER TABLE "product" ADD CONSTRAINT "productId" PRIMARY KEY ("id")
;

-- Table line_item

CREATE TABLE "line_item"
(
  "purchase_id" Integer NOT NULL,
  "product_id" Integer NOT NULL,
  "quantity" Smallint DEFAULT 1 NOT NULL,
  "unit_price" Numeric(10,4) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "line_item" IS 'Items of an order.'
;
COMMENT ON COLUMN "line_item"."purchase_id" IS 'Order of this line item belongs to.'
;
COMMENT ON COLUMN "line_item"."product_id" IS 'Product of the line item.'
;
COMMENT ON COLUMN "line_item"."quantity" IS 'Quantitiy ordered.'
;
COMMENT ON COLUMN "line_item"."unit_price" IS 'Unit price of the product for the order.'
;

ALTER TABLE "line_item" ADD CONSTRAINT "line_itemId" PRIMARY KEY ("purchase_id","product_id")
;

-- Table purchase

CREATE TABLE "purchase"
(
  "id" Integer NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1),
  "created_at" Timestamp(0) with time zone DEFAULT now() NOT NULL,
  "purchased_at" Timestamp(0) with time zone,
  "contact_id" Integer NOT NULL
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "purchase" IS 'The sales order, sometimes abbreviated as SO, is an order issued by a business or sole trader to a customer. A sales order may be for products and/or services. Given the wide variety of businesses, this means that the orders can be fulfilled in several ways. Broadly, the fulfillment modes, based on the relationship between the order receipt and production.'
;
COMMENT ON COLUMN "purchase"."id" IS 'Order id.'
;
COMMENT ON COLUMN "purchase"."created_at" IS 'Creation time of the order.'
;
COMMENT ON COLUMN "purchase"."purchased_at" IS 'If order is closed, time of the order. If order is still open, this is null.'
;
COMMENT ON COLUMN "purchase"."contact_id" IS 'Customer who purchased the order.'
;

CREATE INDEX "IX_ordercustomer" ON "purchase" ("contact_id")
;

ALTER TABLE "purchase" ADD CONSTRAINT "purchaseId" PRIMARY KEY ("id")
;

-- Table purchase_history

CREATE TABLE "purchase_history"
(
  "id" Serial NOT NULL,
  "contact_id" Integer NOT NULL,
  "purchased_at" Timestamp with time zone NOT NULL,
  "total_amount" Numeric(10,4) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "purchase_history" IS 'Log table for recent orders.'
;
COMMENT ON COLUMN "purchase_history"."id" IS 'History record id. (Used serial instead of identity to show how serial works.)'
;
COMMENT ON COLUMN "purchase_history"."contact_id" IS 'Customer who purchased the order.'
;
COMMENT ON COLUMN "purchase_history"."purchased_at" IS 'Purchase time.'
;
COMMENT ON COLUMN "purchase_history"."total_amount" IS 'Total of the order.'
;

CREATE INDEX "IX_order_historycustomer" ON "purchase_history" ("contact_id")
;

ALTER TABLE "purchase_history" ADD CONSTRAINT "purchase_historyId" PRIMARY KEY ("id")
;

-- Table archive.purchase_history

CREATE TABLE "archive"."purchase_history"
(
  "id" Serial NOT NULL,
  "contact_id" Integer NOT NULL,
  "purchased_at" Timestamp with time zone NOT NULL,
  "total_amount" Numeric(10,4) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "archive"."purchase_history" IS 'Log table for older orders. Customers'' recent orders are stored at "public.order_history".'
;
COMMENT ON COLUMN "archive"."purchase_history"."id" IS 'History record id. (Used serial instead of identity to show how serial works.)'
;
COMMENT ON COLUMN "archive"."purchase_history"."contact_id" IS 'Customer who purchased the order.'
;
COMMENT ON COLUMN "archive"."purchase_history"."purchased_at" IS 'Purchase time.'
;
COMMENT ON COLUMN "archive"."purchase_history"."total_amount" IS 'Total of the order.'
;

CREATE INDEX "IX_order_historycustomer" ON "archive"."purchase_history" ("contact_id")
;

ALTER TABLE "archive"."purchase_history" ADD CONSTRAINT "purchase_historyId" PRIMARY KEY ("id")
;

-- Table system_option_history

CREATE TABLE "system_option_history"
(
  "id" Integer NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1),
  "system_option_key" UUID NOT NULL,
  "system_option_sub_key" Integer NOT NULL
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "system_option_history" IS 'Table to track changes in line item table. Also shows usage of composite foreign key.'
;
COMMENT ON COLUMN "system_option_history"."id" IS 'Kayıt no.'
;

CREATE INDEX "IX_system_option_history_system_option" ON "system_option_history" ("system_option_key","system_option_sub_key")
;

ALTER TABLE "system_option_history" ADD CONSTRAINT "system_option_historyId" PRIMARY KEY ("id")
;

-- Table system_option

CREATE TABLE "system_option"
(
  "key" UUID NOT NULL,
  "sub_key" Integer NOT NULL,
  "value" Jsonb NOT NULL
)
WITH (
  autovacuum_enabled=true)
;
COMMENT ON TABLE "system_option" IS 'Optons used by application. This table has two primary keys to show usage of composite keys and composite foreign keys.'
;
COMMENT ON COLUMN "system_option"."key" IS 'Option key.'
;
COMMENT ON COLUMN "system_option"."sub_key" IS 'Option sub-key.'
;
COMMENT ON COLUMN "system_option"."value" IS 'Value for option.'
;

ALTER TABLE "system_option" ADD CONSTRAINT "system_optionId" PRIMARY KEY ("key","sub_key")
;

-- Create foreign keys (relationships) section -------------------------------------------------

ALTER TABLE "region"
  ADD CONSTRAINT "parent_region"
    FOREIGN KEY ("parentid")
    REFERENCES "region" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "parent_region" ON "region" IS 'Parent of a region.'
;

ALTER TABLE "contact"
  ADD CONSTRAINT "contact_region"
    FOREIGN KEY ("region_Id")
    REFERENCES "region" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "contact_region" ON "contact" IS 'Region of a contact.'
;

ALTER TABLE "contact"
  ADD CONSTRAINT "client_account"
    FOREIGN KEY ("account_id")
    REFERENCES "account" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "client_account" ON "contact" IS 'Account of a client.'
;

ALTER TABLE "purchase"
  ADD CONSTRAINT "purchase_contact"
    FOREIGN KEY ("contact_id")
    REFERENCES "contact" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "purchase_contact" ON "purchase" IS 'Purchase of a contact.'
;

ALTER TABLE "line_item"
  ADD CONSTRAINT "line_item_purchase"
    FOREIGN KEY ("purchase_id")
    REFERENCES "purchase" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "line_item_purchase" ON "line_item" IS 'Purchase of a line item.'
;

ALTER TABLE "line_item"
  ADD CONSTRAINT "line_item_product"
    FOREIGN KEY ("product_id")
    REFERENCES "product" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "line_item_product" ON "line_item" IS 'Product of a lin item.'
;

ALTER TABLE "purchase_history"
  ADD CONSTRAINT "purchase_history_contact"
    FOREIGN KEY ("contact_id")
    REFERENCES "contact" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "purchase_history_contact" ON "purchase_history" IS 'Purchase history of a contact.'
;

ALTER TABLE "archive"."purchase_history"
  ADD CONSTRAINT "archived_purchase_history_contact"
    FOREIGN KEY ("contact_id")
    REFERENCES "contact" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "archived_purchase_history_contact" ON "archive"."purchase_history" IS 'Archived purchase history of a contact.'
;

ALTER TABLE "account"
  ADD CONSTRAINT "account_primary_contact"
    FOREIGN KEY ("primary_contact_id")
    REFERENCES "contact" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "account_primary_contact" ON "account" IS 'Primary contact of an account who should be contacted first.'
;

ALTER TABLE "account"
  ADD CONSTRAINT "account_secondary_contact"
    FOREIGN KEY ("secondary_contact_id")
    REFERENCES "contact" ("id")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;
COMMENT ON CONSTRAINT "account_secondary_contact" ON "account" IS 'Secondary contact of an account, who may be called if primary account is not available.'
;

ALTER TABLE "system_option_history"
  ADD CONSTRAINT "system_option_history_system_option"
    FOREIGN KEY ("system_option_key", "system_option_sub_key")
    REFERENCES "system_option" ("key", "sub_key")
      ON DELETE RESTRICT
      ON UPDATE RESTRICT
;

