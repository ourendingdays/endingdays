require("dotenv").config();
const mysql = require("mysql2/promise");

async function getData() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // local forwarded port
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
  });

  const [rows] = await pool.query(`
    SELECT id, doomsday_date, display_year, detail
    FROM doomsdays
    ORDER BY doomsday_date ASC
  `);
  console.log(rows);
  await pool.end();
}

getData().catch(console.error);