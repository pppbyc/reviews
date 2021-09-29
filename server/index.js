const express = require('express');
const cors = require('cors');
const path = require('path');
const controller = require('./controllers/queries')

const app = express();
const port = 3004;

app.use(express.json());
app.use(cors());


app.get('/reviews', controller.getReviews);
// app.get('/reviews/meta', controller.getReviewsMeta);
app.put('/reviews/:id/helpful', controller.updateReviewHelpful);

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
