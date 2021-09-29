DROP DATABASE IF EXISTS sdc;

CREATE DATABASE sdc;

\c sdc;


-- DROP TABLE IF EXISTS product;
-- CREATE TABLE product (
--   id INTEGER,
--   "name" VARCHAR(255),
--   slogan TEXT,
--   "description" TEXT,
--   category VARCHAR(50),
--   default_price INTEGER,
--   PRIMARY KEY (id)
-- );



DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id INTEGER,
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

-- DROP TABLE IF EXISTS reviews_photo;
-- CREATE TABLE reviews_photo (
--   id INTEGER,
--   review_id INTEGER,
--   "url" TEXT,
--   PRIMARY KEY (id)
-- );

-- DROP TABLE IF EXISTS characterstic;
-- CREATE TABLE characteristics (
--   id INTEGER,
--   product_id INTEGER,
--   "name" VARCHAR(50),
--   PRIMARY KEY (id)
-- );

-- DROP TABLE IF EXISTS characteristic_reviews;
-- CREATE TABLE characteristic_reviews (
--   id INTEGER,
--   characteristic_id INTEGER,
--   review_id INTEGER,
--   "value" INTEGER,
--   PRIMARY KEY (id)
-- );




-- ALTER TABLE reviews ADD FOREIGN KEY (product_id) REFERENCES product (id);
-- -- ALTER TABLE reviews_photo ADD FOREIGN KEY (review_id) REFERENCES reviews (id);
-- ALTER TABLE characteristics ADD FOREIGN KEY (product_id) REFERENCES product (id);
-- ALTER TABLE characteristic_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES characteristics (id);
-- ALTER TABLE characteristic_reviews ADD FOREIGN KEY (review_id) REFERENCES reviews (id);

\dt


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