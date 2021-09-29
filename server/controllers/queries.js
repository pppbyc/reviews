const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sdc',
  password: 'HR@2021',
  port: 5432,
})

const handleParam = (param, defaultValue) => {
  console.log(param);
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
  LEFT JOIN (SELECT review_id, url as photos FROM reviews_photo ) AS t2
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





// const getReviewsMeta = (req, res) => {
//   // console.log(typeof (req.query.product_id));
//   const productId = parseInt(req.query.product_id, 10);
//   // console.log(productId)
//   const sqlQuery = 'select * from characterstics where product_id = $1';

//   pool.query(sqlQuery, [productId], (err, results) => {
//     if (err) {
//       throw err;
//     }
//     res.status(200).json(results.rows[0]);
//   });
// };

const updateReviewHelpful = (req, res) => {
  console.log(req.params.id);
  const id = parseInt(req.params.id, 10);
  const { helpfulness } = req.body;
  const query = 'UPDATE reviews SET helpfulness = helpfulness+1 WHERE id = $1'
  pool.query(query, [id], (err) => {
    if (err) {
      throw err;
    }
    res.status(200).send('update helpfulness!');
  });
};


// const updateReviewReport = (req, res) => {

// }

// const postReview = (req, res) => {

// }

module.exports = {
  getReviews,
  // getReviewsMeta,
  updateReviewHelpful,
  // updateReviewReport,
  // postReview,
};