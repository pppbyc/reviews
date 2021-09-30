const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testsdc',
  password: 'HR@2021',
  port: 5432,
})

fs.createReadStream(path.resolve(__dirname, '../csv/characteristics_reviews.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error('error reading photos', error))
  .on('data', row => {
    console.log(row)
    const query = 'INSERT INTO characteristics_reviews(id,characteristic_id,review_id,value) VALUES($1, $2, $3)';
    const values = [Number(row.id), Number(row.characteristic_id), Number(review_id), row.value];
    console.log(values);
    pool.query(query, values, (err, res) => {
      if (err) console.error(err)
    })
  })
  .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));