DROP DATABASE IF EXISTS sdc;

CREATE DATABASE sdc
    -- WITH
    -- OWNER = postgres
    -- ENCODING = 'UTF8'
    -- -- LC_COLLATE = 'C'
    -- -- LC_CTYPE = 'C'
    -- TABLESPACE = pg_default
    -- CONNECTION LIMIT = -1;

\c sdc;


-- DROP TABLE IF EXISTS product;
-- CREATE TABLE product (
--   id SERIAL,
--   "name" VARCHAR(255),
--   slogan TEXT,
--   "description" TEXT,
--   category VARCHAR(50),
--   default_price INTEGER,
--   PRIMARY KEY (id)
-- );

-- \COPY product FROM '/Users/Yingchen/Desktop/Hack_Reactor/reviews/csv/product.csv' CSV HEADER;

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id SERIAL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  "date" BIGINT,
  summary TEXT,
  body TEXT,
  recommend BOOLEAN DEFAULT TRUE,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name VARCHAR(50),
  reviewer_email VARCHAR(50),
  response TEXT,
  helpfulness INTEGER DEFAULT 0,
  PRIMARY KEY (id)
);

\COPY reviews FROM '/Users/Yingchen/Desktop/Hack_Reactor/reviews/csv/reviews.csv' CSV HEADER;

DROP TABLE IF EXISTS reviews_photos;
CREATE TABLE reviews_photos (
  id SERIAL,
  review_id INTEGER,
  "url" TEXT,
  PRIMARY KEY (id)
);

\COPY reviews_photos FROM '/Users/Yingchen/Desktop/Hack_Reactor/reviews/csv/reviews_photos.csv' CSV HEADER;

DROP TABLE IF EXISTS characteristics;
CREATE TABLE characteristics (
  id SERIAL,
  product_id INTEGER,
  "name" VARCHAR(50),
  PRIMARY KEY (id)
);

\COPY characteristics FROM '/Users/Yingchen/Desktop/Hack_Reactor/reviews/csv/characteristics.csv' CSV HEADER;

DROP TABLE IF EXISTS characteristics_reviews;
CREATE TABLE characteristics_reviews (
  id SERIAL,
  characteristic_id INTEGER,
  review_id INTEGER,
  "value" INTEGER,
  PRIMARY KEY (id)
);
\COPY characteristics_reviews FROM '/Users/Yingchen/Desktop/Hack_Reactor/reviews/csv/characteristics_reviews.csv' CSV HEADER;



-- ALTER TABLE reviews ADD FOREIGN KEY (product_id) REFERENCES product (id);
-- ALTER TABLE reviews_photos ADD FOREIGN KEY (review_id) REFERENCES reviews (id);
-- ALTER TABLE characteristics ADD FOREIGN KEY (product_id) REFERENCES product (id);
-- ALTER TABLE characteristics_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES characteristics (id);
-- ALTER TABLE characteristics_reviews ADD FOREIGN KEY (review_id) REFERENCES reviews (id);

\dt

CREATE MATERIALIZED VIEW reviews_meta AS
SELECT t1.product_id, t1.ratings, t2.recommended, t3.characteristics
FROM (
    SELECT product_id, json_object_agg(rating, "count") AS ratings
    FROM (SELECT product_id, rating, COUNT(id)
    FROM reviews
    GROUP BY product_id, rating) AS r
    GROUP BY product_id
) AS t1
INNER JOIN (
  SELECT product_id, json_object_agg(recommend, "count") AS recommended
  FROM (SELECT product_id, recommend, COUNT(id)
  FROM reviews
  GROUP BY product_id, recommend) AS r
  GROUP BY product_id
) AS t2 ON t1.product_id = t2.product_id
INNER JOIN (
    SELECT product_id, json_object_agg("name", json_build_object('id', characteristic_id, 'value', "value")) AS characteristics
  FROM (SELECT product_id, characteristic_id, "name", AVG("value") AS "value"
  FROM characteristics
  INNER JOIN characteristics_reviews
  ON characteristics_reviews.characteristic_id = characteristics.id
  GROUP BY product_id, characteristic_id, "name") AS a
  GROUP BY product_id
) AS t3 ON t3.product_id = t1.product_id;


SELECT MAX(id) FROM reviews;
select nextval('reviews_id_seq');
BEGIN;
LOCK TABLE reviews IN EXCLUSIVE MODE;
SELECT setval('reviews_id_seq', COALESCE((SELECT MAX(id)+1 FROM reviews), 1), false);
COMMIT;

BEGIN;
LOCK TABLE reviews_photos IN EXCLUSIVE MODE;
SELECT setval('reviews_photos_id_seq', COALESCE((SELECT MAX(id)+1 FROM reviews_photos), 1), false);
COMMIT;

SELECT MAX(id) FROM characteristics_reviews;
select nextval('characteristics_reviews_id_seq');
BEGIN;
LOCK TABLE reviews IN EXCLUSIVE MODE;
SELECT setval('characteristics_reviews_id_seq', COALESCE((SELECT MAX(id)+1 FROM characteristics_reviews), 1), false);
COMMIT;

CREATE INDEX idx_product_id
ON reviews(product_id);

CREATE INDEX idx_product_id_characteristics
ON characteristics(product_id);

CREATE INDEX idx_id_characteristics
ON characteristics_reviews(characteristic_id);

CREATE INDEX idx_review_id_photo
ON reviews_photos(review_id);

CREATE INDEX idx_reported
ON reviews(reported);


-- INSERT INTO product (id, "name", slogan, "description", category, default_price) VALUES
-- (1,'Camo Onesie','Blend in to your crowd','The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.','Jackets',140);

-- INSERT INTO reviews (id, product_id, rating, "date", summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES
-- (1, 1, 5, 1596080000000, 'This product was great!', 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.', true, false, 'funtime', 'first.last@gmail.com', null, 8);

-- INSERT INTO reviews_photo (id, review_id, "url") VALUES
-- (1, 1, 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80');

-- INSERT INTO characteristics  (id, product_id, "name") VALUES
-- (1, 1, 'Fit');

-- INSERT INTO characteristic_reviews (id, characteristic_id, review_id, "value") VALUES
-- (1, 1, 1, 4);

-- COPY product(id, "name", slogan, "description", category, default_price)
-- FROM '/Users/Yingchen/Desktop/reviews_data/product.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY reviews(id, product_id, rating, "date", summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
-- FROM '/Users/Yingchen/Desktop/reviews_data/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY reviews_photo(id, review_id, "url")
-- FROM '/Users/Yingchen/Desktop/reviews_data/reviews_photos.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristics(id, product_id, "name")
-- FROM '/Users/Yingchen/Desktop/reviews_data/haracteristics.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristic_reviews(id, characteristic_id, review_id, "value")
-- FROM '/Users/Yingchen/Desktop/reviews_data/characteristic_reviews.csv'
-- DELIMITER ','
-- CSV HEADER;
