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

fs.createReadStream(path.resolve(__dirname, '../csv/reviews_photos.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error('error reading photos', error))
  .on('data', row => {
    console.log(row)
    const query = 'INSERT INTO reviews_photos(id, review_id, url) VALUES($1, $2, $3)';
    const values = [Number(row.id), Number(row.product_id), row.url];
    console.log(values);
    pool.query(query, values, (err, res) => {
      if (err) console.error(err)
    })
  })
  .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));


// const CSV_DIR = path.resolve(__dirname, '..', 'csv');
// const header = 'id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness';
// const writeFile = fs.createWriteStream(path.resolve(CSV_DIR, 'cleanedPhotos.csv'));
// writeFile.write(header);

// const errorRows = [];
// const startTime = new Date();
// console.log('Parsing photo.csv...');
// fs.createReadStream(path.resolve(CSV_DIR, 'reviews_photo.csv'))
//   .pipe(
//     parse({
//       delimiter: ',',
//       from_line: 2,
//       quote: '',
//     }),
//   )
//   .on('data', (row) => {
//     if (
//       row.length !== 3
//       || isNaN(row[0])
//       || isNaN(row[1])
//     ) {
//       errorRows.push(row);
//     } else if (
//       row[2].slice(0, 1) !== '"' || row[2].slice(-1) !== '"'
//     ) {
//       const tempRow2 = row[2].replace(/["]+/g, '');
//       writeFile.write(`\n${row[0]},${row[1]},"${tempRow2}"`);
//     } else {
//       writeFile.write(`\n${row[0]},${row[1]},${row[2]}`);
//     }
//   })
//   .on('end', () => {
//     const endTime = new Date();
//     console.log(`${endTime - startTime}ms to complete operation`);
//     console.log('These rows have length problems');
//     console.log(errorRows);
//   });
