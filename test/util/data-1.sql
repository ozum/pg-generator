
SET search_path = public, pg_catalog;
--
-- Data for table public.company (OID = 726222) (LIMIT 0,2)
--
INSERT INTO company (id, owner_id, created_at, updated_at, name, income)
VALUES (1, NULL, '2015-11-24 17:39:04', '2015-11-24 17:39:04', 'Acmesai', 200000);

INSERT INTO company (id, owner_id, created_at, updated_at, name, income)
VALUES (2, NULL, '2015-11-24 17:41:13', '2015-11-24 17:41:13', 'Chain Co.', 120000);

--
-- Data for table public.contact (OID = 726233) (LIMIT 0,3)
--
INSERT INTO contact (id, company_id, name, surname, email, age)
VALUES (3, 2, 'Nathan', 'Appsio', 'nathan@z.com', 34);

INSERT INTO contact (id, company_id, name, surname, email, age)
VALUES (2, 2, 'George', 'Conta', 'george@y.com', 28);

INSERT INTO contact (id, company_id, name, surname, email, age)
VALUES (1, 1, 'Susan', 'Tea', 'susan@x.com', 42);

--
-- Data for table public.product (OID = 726244) (LIMIT 0,3)
--
INSERT INTO product (id, name, color)
VALUES (1, 'Monitor', 'Gray');

INSERT INTO product (id, name, color)
VALUES (2, 'Mouse', 'White');

INSERT INTO product (id, name, color)
VALUES (3, 'Watch', 'Red');

--
-- Data for table public.cart (OID = 726252) (LIMIT 0,2)
--
INSERT INTO cart (id, contact_id, created_at, name)
VALUES (1, 1, '2015-11-24 17:42:39', 'New year');

INSERT INTO cart (id, contact_id, created_at, name)
VALUES (2, 2, '2015-11-24 17:42:48', 'Birthday');

--
-- Data for table public.cart_line_item (OID = 726260) (LIMIT 0,4)
--
INSERT INTO cart_line_item (product_id, cart, quantity)
VALUES (1, 2, 1);

INSERT INTO cart_line_item (product_id, cart, quantity)
VALUES (3, 2, 3);

INSERT INTO cart_line_item (product_id, cart, quantity)
VALUES (2, 1, 2);

INSERT INTO cart_line_item (product_id, cart, quantity)
VALUES (1, 1, 3);


