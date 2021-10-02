import http from 'k6/http';
import { check, sleep } from 'k6';
import { getReviews, getReviewsMeta, getReviewsAndRatingsByProductId } from './test.js';

// export let option = {
//   vus: 1,
//   duration: '10s'
// };


export let option = {
  stage: [
    {duration: '30s', target: 2000},
    { duration: '1m30s', target: 1000 },
    { duration: '20s', target: 200 },
  ]
}


export default () => {
  getReviews();
  getReviewsMeta();
  // getReviewsAndRatingsByProductId();
};