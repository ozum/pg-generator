/*
Created: 24.11.2015
Modified: 09.12.2015
Project: pg-generator-test
Model: pg-generator-test
Company: Fortibase
Author: Özüm Eldoğan
Version: 1.0.0
Database: PostgreSQL 9.4
*/

-- Create tables section -------------------------------------------------

-- Table company

CREATE TABLE "company"(
 "id" Serial NOT NULL,
 "owner_id" Integer,
 "created_at" Timestamp(0) DEFAULT now() NOT NULL,
 "updated_at" Timestamp(0) DEFAULT now() NOT NULL,
 "name" Character varying(20) NOT NULL,
 "income" Integer
)
;

COMMENT ON TABLE "company" IS 'Firma.'
;
COMMENT ON COLUMN "company"."id" IS 'Kayıt no.'
;
COMMENT ON COLUMN "company"."owner_id" IS 'Owner of the company.'
;
COMMENT ON COLUMN "company"."created_at" IS 'Creation time.'
;
COMMENT ON COLUMN "company"."updated_at" IS 'Update time.'
;
COMMENT ON COLUMN "company"."name" IS 'Name of the company.'
;
COMMENT ON COLUMN "company"."income" IS 'Yearly income.
Multi Line.'
;

-- Create indexes for table company

CREATE INDEX "IX_contact_companys" ON "company" ("owner_id")
;

-- Add keys for table company

ALTER TABLE "company" ADD CONSTRAINT "Key1" PRIMARY KEY ("id")
;

-- Table contact

CREATE TABLE "contact"(
 "id" Serial NOT NULL,
 "company_id" Integer,
 "name" Character varying(20) NOT NULL,
 "surname" Character varying(20) NOT NULL,
 "email" Character varying(20) NOT NULL,
 "age" Integer
)
;

COMMENT ON TABLE "contact" IS 'İrtibat.'
;
COMMENT ON COLUMN "contact"."id" IS 'Kayıt no.'
;
COMMENT ON COLUMN "contact"."company_id" IS 'Company where this contact works.'
;
COMMENT ON COLUMN "contact"."name" IS 'Name of the contact.'
;
COMMENT ON COLUMN "contact"."surname" IS 'Surname of the contact.'
;
COMMENT ON COLUMN "contact"."email" IS 'Email of the contact.'
;
COMMENT ON COLUMN "contact"."age" IS 'Age of the contact.'
;

-- Create indexes for table contact

CREATE INDEX "IX_company_contacts" ON "contact" ("company_id")
;

-- Add keys for table contact

ALTER TABLE "contact" ADD CONSTRAINT "Key2" PRIMARY KEY ("id")
;

ALTER TABLE "contact" ADD CONSTRAINT "email" UNIQUE ("email")
;

-- Table product

CREATE TABLE "product"(
 "id" Serial NOT NULL,
 "name" Character varying(20) NOT NULL,
 "color" Character varying(20)
)
;

COMMENT ON TABLE "product" IS 'Ürün.'
;
COMMENT ON COLUMN "product"."id" IS 'Kayıt no.'
;
COMMENT ON COLUMN "product"."name" IS 'Name of the product.'
;
COMMENT ON COLUMN "product"."color" IS 'Color of the product.'
;

-- Add keys for table product

ALTER TABLE "product" ADD CONSTRAINT "Key3" PRIMARY KEY ("id")
;

-- Table cart

CREATE TABLE "cart"(
 "id" Serial NOT NULL,
 "contact_id" Integer NOT NULL,
 "created_at" Timestamp(0) DEFAULT now() NOT NULL,
 "name" Character varying(20),
 "VAT" Character varying(20)
)
;

COMMENT ON TABLE "cart" IS 'Alışveriş sepeti.'
;
COMMENT ON COLUMN "cart"."id" IS 'Kayıt no.'
;
COMMENT ON COLUMN "cart"."contact_id" IS 'Owner of the cart.'
;
COMMENT ON COLUMN "cart"."created_at" IS 'Creation time.'
;
COMMENT ON COLUMN "cart"."name" IS 'Name of the cart.'
;

-- Create indexes for table cart

CREATE INDEX "IX_contact_carts" ON "cart" ("contact_id")
;

-- Add keys for table cart

ALTER TABLE "cart" ADD CONSTRAINT "Key4" PRIMARY KEY ("id")
;

-- Table cart_line_item

CREATE TABLE "cart_line_item"(
 "product_id" Integer NOT NULL,
 "cart" Integer NOT NULL,
 "quantity" Smallint DEFAULT 1 NOT NULL
)
;

COMMENT ON TABLE "cart_line_item" IS 'Alışveriş sepetindeki malzeme.'
;
COMMENT ON COLUMN "cart_line_item"."product_id" IS 'Product of the cart.'
;
COMMENT ON COLUMN "cart_line_item"."cart" IS 'Cart of the product.'
;
COMMENT ON COLUMN "cart_line_item"."quantity" IS 'Quantity of the product.'
;

-- Add keys for table cart_line_item

ALTER TABLE "cart_line_item" ADD CONSTRAINT "Key5" PRIMARY KEY ("product_id","cart")
;

-- Create relationships section -------------------------------------------------

ALTER TABLE "contact" ADD CONSTRAINT "company_contacts" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
;

ALTER TABLE "company" ADD CONSTRAINT "owned_companies" FOREIGN KEY ("owner_id") REFERENCES "contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
;

ALTER TABLE "cart_line_item" ADD CONSTRAINT "product_cart_line_items" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
;

ALTER TABLE "cart_line_item" ADD CONSTRAINT "cart_cart_line_items" FOREIGN KEY ("cart") REFERENCES "cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
;

ALTER TABLE "cart" ADD CONSTRAINT "contact_carts" FOREIGN KEY ("contact_id") REFERENCES "contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
;



