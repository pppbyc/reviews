const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sdc',
  password: 'HR@2021',
  port: 5432,
})

const handleParam = (param, defaultValue) => {
  // console.log(param);
  if (param === undefined) {
    return defaultValue;
  } else {
    return param;
  }
};

const getReviews = (req, res) => {
  const productId = Number(req.query.product_id);
  console.log('productId' + productId);
  const page =  Number(handleParam(req.query.page, 1));
  const count = Number(handleParam(req.query.count, 5))
  const sort = req.query.sort === 'newest' ? 'date' : 'helpfulness';

  const query = `SELECT t1.review_id, t1.rating, t1.summary, t1.recommend, t1.response, t1.body, t1.date, t1.reviewer_name, t1.helpfulness, t2.photos FROM
  (SELECT id as review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews WHERE product_id = $1 and reported = false ORDER BY ${sort}) AS t1
  LEFT JOIN (SELECT review_id, json_agg(json_build_object('id', id, 'url', "url")) as photos FROM reviews_photos GROUP BY review_id) AS t2
  on t1.review_id = t2.review_id`;

  pool.query(query, [productId], (err, results) => {

    if (err) {
      throw err;
    } else {
      res.status(200).send({
        review: req.params.review_id,
        page,
        count,
        results: results.rows
      })
    }
    // res.status(200).json({ results: results.rows });
  });

}





const getReviewsMeta = (req, res) => {
  // console.log(typeof (req.query.product_id));
  const productId = Number(req.query.product_id);
  console.log('getReviewsMeta', productId)
  const sqlQuery = 'select * from reviews_meta where product_id = $1';

  pool.query(sqlQuery, [productId], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows[0]);
  });
};

const updateReviewHelpful = (req, res) => {
  console.log('review_id', req.params.id);
  const id = Number(req.params.id);
  const { helpfulness } = req.body;
  const query = 'UPDATE reviews SET helpfulness = helpfulness+1 WHERE id = $1'
  pool.query(query, [id], (err) => {
    if (err) {
      throw err;
    }
    res.status(200).send('update helpfulness!');
  });
};


const updateReviewReport = (req, res) => {
  const id = Number(req.params.id);
  pool.query('UPDATE reviews SET reported = true WHERE id = $1', [id], (err) => {
    if (err) {
      throw err;
    }
    res.status(200).send('reported!');
  });
}

const postReview = (req, res) => {
  const {
    id, product_id, rating, summary, body, recommend, name, email, photos, characteristics,
  } = req.body;
  const date = new Date().getTime();

  const params = [product_id, rating, date, summary, body, recommend, name, email];
  console.log(params);
  pool.query('INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', params, (err, results) => {
    if (err) {
      throw err;
    }
    const reviewId = results.rows[0].id;
    console.log('reviewid', reviewId);
    // insert into review photo
    if (photos.length) {
      photos.forEach((url) => {
        pool.query('INSERT INTO reviews_photo(review_id, url) VALUES($1, $2)', [reviewId, url], (errphoto) => {
          if (errphoto) {
            throw errphoto;
          }
          res.status(200).send('ok');
        });
      });
    }

    //insert into the characteristics_reviews
    Object.keys(characteristics).forEach((key) => {
    console.log('key',key);
      pool.query('INSERT INTO characteristics_reviews(review_id, characteristic_id) VALUES($1, $2)', [reviewId, key], (charError) => {
        if (charError) {
          throw charError;
        }
      });
    });
    res.status(200).send('ok');
  });
};

module.exports = {
  getReviews,
  getReviewsMeta,
  updateReviewHelpful,
  updateReviewReport,
  postReview,
};