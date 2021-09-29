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

fs.createReadStream(path.resolve(__dirname, '../data/reviews.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', row => {
    console.log(row)
    const query = 'INSERT INTO reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [Number(row.id), Number(row.product_id), Number(row.rating), new Date(Number(row.date)), row.summary, row.body, !!Number(row.recommend), !!Number(row.reported), row.reviewer_name, row.reviewer_email, row.response, Number(row.helpful), ];
    // console.log(values);
    pool.query(query, values, (err, res) => {
      if (err) console.error(err)
    })
  })
  .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));


// const CSV_DIR = path.resolve(__dirname, '..', 'csv');
// const header = 'id,review_id,url';
// const writeFile = fs.createWriteStream(path.resolve(CSV_DIR, 'cleanedReviews.csv'));
// writeFile.write(header);

// const errorRows = [];
// const startTime = new Date();
// console.log('Parsing product.csv...');
// fs.createReadStream(path.resolve(CSV_DIR, 'reviews.csv'))
//   .pipe(
//     parse({
//       delimiter: ',',
//       from_line: 2,
//     }),
//   )
//   .on('data', (row) => {
//     if (
//       row.length !== 12
//       || isNaN(row[0])
//       || isNaN(row[1])
//       || isNaN(row[2])
//       || isNaN(Number(row[3]))
//       || row[3].length > 500
//       || row[4].length > 50
//       || isNaN(+row[5])
//     ) {
//       errorRows.push(row);
//     } else {
//       writeFile.write(`\n${row[0]},"${row[1]}","${row[2]}","${row[3]}","${row[4]}",${row[5]}`);
//     }
//   })
//   .on('end', () => {
//     const endTime = new Date();
//     console.log(`${endTime - startTime}ms to complete operation`);
//     console.log('These rows have length problems');
//     console.log(errorRows);
//   });