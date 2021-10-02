// require('newrelic');
const express = require('express');
const cors = require('cors');
const path = require('path');
const controller = require('./controllers/queries')

const app = express();
const port = 3004;
const loaderio = 'loaderio-cbd7efcf9191f98197898fbe2edf9ad5';

app.use(express.json());
app.use(cors());

//https://www.youtube.com/watch?v=ZTL0U4RER7Q
app.get(`/${loaderio}`, (req, res) => {
  res.send(loaderio);
});

app.get('/reviews', controller.getReviews);
app.get('/reviews/meta', controller.getReviewsMeta);
app.put('/reviews/:id/helpful', controller.updateReviewHelpful);
app.put('/reviews/:id/report', controller.updateReviewReport);
app.post('/reviews', controller.postReview);

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
