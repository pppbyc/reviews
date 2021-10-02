import http from 'k6/http';
import { check, sleep, group} from 'k6';

// https://www.youtube.com/watch?v=r-Jte8Y8zag

/*
Stress testing is a type of laod testing
*/


exports.getReviews = function () {
  const productId = 1;
  const res = http.get(`http://localhost:3004/reviews?product_id=${productId}`);
  check(res, {'reviews status was 200 ': (r) => r.status== 200 });
  sleep(1);
}

exports.getReviewsMeta = function () {
  const productId = 1;
  const res = http.get(`http://localhost:3004/reviews/meta?product_id=${productId}`);
  check(res, {'review meta status was 200 ': (r) => r.status== 200 });
  sleep(1);
}

// export default function getReviewsAndRatingsByProductId() {
//   const productId = 1;
//   const count = 5;
//   group('loading the ratings and reviews for a single product', () => {
//     // get review meta data request
//     const review_meta_res = http.get(`http://localhost:3004/reviews/meta?product_id=${productId}`);
//     check(review_meta_res, { 'review meta data status was 200': (r) => r.status === 200 });
//     sleep(1);

//     // get reviews by product id
//     const reviews_res = http.get(`http://localhost:3004/?product_id=${productId}&count=${count}`);
//     check(reviews_res, { 'reviews status was 200': (r) => r.status === 200 });
//     sleep(1);
//   });
// }